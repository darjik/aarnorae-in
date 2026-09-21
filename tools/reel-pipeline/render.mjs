import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { appendHistory, productKey } from "./lib/history.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const bin = join(root, ".tools", "ffmpeg", "ffmpeg-9.0.1-essentials_build", "bin");
const ffmpeg = join(bin, "ffmpeg.exe");
const ffprobe = join(bin, "ffprobe.exe");

function fail(message) {
  console.error(`Reel pipeline: ${message}`);
  process.exit(1);
}

function run(command, args, label) {
  const result = spawnSync(command, args, { encoding: "utf8" });
  if (result.status !== 0) fail(`${label} failed.\n${(result.stderr || result.stdout).trim()}`);
  return result.stdout;
}

function from(base, value) {
  if (!value) return undefined;
  return isAbsolute(value) ? value : resolve(base, value);
}

function ffPath(value) {
  return value.replaceAll("\\", "/").replace(/^([A-Za-z]):/, "$1\\:").replaceAll("'", "'\\''");
}

function number(value, fallback, name) {
  const result = value ?? fallback;
  if (!Number.isFinite(result)) fail(`${name} must be numeric`);
  return result;
}

function loadConfig(path) {
  let raw;
  try { raw = JSON.parse(readFileSync(path, "utf8")); }
  catch (error) { fail(`could not parse campaign JSON: ${error.message}`); }
  const base = dirname(path);
  const duration = number(raw.duration, 12, "duration");
  if (!raw.product?.title || !raw.product?.url) fail("product.title and product.url are required");
  const rawImages = raw.product.images || (raw.product.image ? [raw.product.image] : []);
  if (rawImages.length < 3) fail("product.images must contain at least three images");
  const imageDurations = raw.imageDurations;
  if (imageDurations && (imageDurations.length !== rawImages.length || imageDurations.some((value) => !Number.isFinite(value) || value <= 0))) {
    fail("imageDurations must contain one positive number for each product image");
  }
  if (imageDurations && Math.abs(imageDurations.reduce((sum, value) => sum + value, 0) - duration) > 0.001) {
    fail(`imageDurations must add up to the ${duration}s campaign duration`);
  }
  if (!raw.output?.video) fail("output.video is required");
  if (!raw.scenes?.length) fail("at least one scene is required");
  raw.scenes.forEach((scene, index) => {
    if (!scene.text || !Number.isFinite(scene.start) || !Number.isFinite(scene.end)) fail(`scene ${index + 1} requires text, start, and end`);
    if (scene.start < 0 || scene.end <= scene.start || scene.end > duration) fail(`scene ${index + 1} falls outside the ${duration}s timeline`);
  });
  const accent = String(raw.brand?.accent || "F4D6AE").replace(/^#/, "");
  if (!/^[0-9a-f]{6}$/i.test(accent)) fail(`invalid accent color: ${accent}`);
  const config = {
    ...raw,
    duration,
    imageDurations,
    transitionDuration: number(raw.transitionDuration, 0.22, "transitionDuration"),
    fadeInDuration: number(raw.fadeInDuration, 0.45, "fadeInDuration"),
    fadeOutDuration: number(raw.fadeOutDuration, 0.5, "fadeOutDuration"),
    fullBleed: Boolean(raw.fullBleed),
    fps: number(raw.fps, 30, "fps"),
    width: number(raw.width, 1080, "width"),
    height: number(raw.height, 1920, "height"),
    product: { ...raw.product, images: rawImages.map((image) => from(base, image)) },
    brand: {
      name: raw.brand?.name || "",
      accent: `0x${accent}`,
      font: from(base, raw.brand?.font || "C:/Windows/Fonts/georgiab.ttf"),
      bodyFont: from(base, raw.brand?.bodyFont || "C:/Windows/Fonts/arial.ttf"),
    },
    audio: { ...raw.audio, music: from(base, raw.audio?.music), voiceover: from(base, raw.audio?.voiceover) },
    output: { video: from(base, raw.output.video), cover: from(base, raw.output.cover) },
    historyFile: from(base, raw.historyFile),
  };
  for (const [name, target] of [["FFmpeg", ffmpeg], ["FFprobe", ffprobe], ["music", config.audio.music], ["voiceover", config.audio.voiceover], ["brand font", config.brand.font], ["body font", config.brand.bodyFont], ...config.product.images.map((image, index) => [`product image ${index + 1}`, image])]) {
    if (target && !existsSync(target)) fail(`${name} not found: ${target}`);
  }
  return config;
}

function sceneStyle(name) {
  if (name === "hero") return { size: 76, font: "font", y: 1490, color: "white" };
  if (name === "cta") return { size: 68, font: "font", y: 1515, color: "accent" };
  return { size: 48, font: "bodyFont", y: 1535, color: "white" };
}

function filterGraph(config, textFiles) {
  const { width: w, height: h, fps, duration: d } = config;
  const count = config.product.images.length;
  const transition = Math.min(0.6, config.transitionDuration, d / (count * 4));
  const displayDurations = config.imageDurations || Array(count).fill(d / count);
  const clipDurations = displayDurations.map((value, index) => value + (index < count - 1 ? transition : 0));
  const graph = [];
  config.product.images.forEach((_, index) => {
    const zoom = index % 2 === 0 ? "min(zoom+0.00035,1.08)" : "if(eq(on,1),1.08,max(zoom-0.00025,1.0))";
    if (config.fullBleed) {
      graph.push(`[${index}:v]scale=${w}:${h}:force_original_aspect_ratio=increase,crop=${w}:${h},zoompan=z='${zoom}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${Math.ceil(clipDurations[index] * fps)}:s=${w}x${h}:fps=${fps},setpts=PTS-STARTPTS[clip${index}]`);
    } else {
      graph.push(
        `[${index}:v]split=2[bg${index}src][fg${index}src]`,
        `[bg${index}src]scale=${w}:${h}:force_original_aspect_ratio=increase,crop=${w}:${h},boxblur=28:5,eq=brightness=-0.24:saturation=0.82[bg${index}]`,
        `[fg${index}src]scale=${w}:${h - 420}:force_original_aspect_ratio=decrease[fg${index}]`,
        `[bg${index}][fg${index}]overlay=(W-w)/2:(H-h)/2-25,zoompan=z='${zoom}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${Math.ceil(clipDurations[index] * fps)}:s=${w}x${h}:fps=${fps},setpts=PTS-STARTPTS[clip${index}]`,
      );
    }
  });
  let montage = "clip0";
  for (let index = 1; index < count; index += 1) {
    const next = `montage${index}`;
    const offset = displayDurations.slice(0, index).reduce((sum, value) => sum + value, 0);
    graph.push(`[${montage}][clip${index}]xfade=transition=fade:duration=${transition}:offset=${offset}[${next}]`);
    montage = next;
  }
  const fadeIn = config.fadeInDuration > 0 ? `,fade=t=in:st=0:d=${config.fadeInDuration}` : "";
  const fadeOut = config.fadeOutDuration > 0 ? `,fade=t=out:st=${d - config.fadeOutDuration}:d=${config.fadeOutDuration}` : "";
  const bands = config.fullBleed ? "" : ",drawbox=x=0:y=0:w=iw:h=225:color=black@0.28:t=fill,drawbox=x=0:y=1430:w=iw:h=490:color=black@0.48:t=fill";
  graph.push(`[${montage}]format=yuv420p${fadeIn}${fadeOut}${bands}[v0]`);
  let current = "v0";
  if (config.brand.name) {
    graph.push(`[${current}]drawtext=fontfile='${ffPath(config.brand.font)}':text='${config.brand.name}':fontcolor=white:fontsize=50:x=(w-text_w)/2:y=80:shadowcolor=black@0.65:shadowx=2:shadowy=2[vbrand]`);
    current = "vbrand";
  }
  config.scenes.forEach((scene, index) => {
    const look = { ...sceneStyle(scene.style), ...(scene.size ? { size: scene.size } : {}), ...(scene.y ? { y: scene.y } : {}) };
    const next = `vscene${index}`;
    const fontColor = look.color === "accent" ? config.brand.accent : look.color;
    graph.push(`[${current}]drawtext=fontfile='${ffPath(config.brand[look.font])}':textfile='${ffPath(textFiles[index])}':fontcolor=${fontColor}:fontsize=${look.size}:line_spacing=10:x=(w-text_w)/2:y=${look.y}:enable='between(t,${scene.start},${scene.end})':shadowcolor=black@0.78:shadowx=3:shadowy=3[${next}]`);
    current = next;
  });
  const finalStart = Math.max(0, d - 2.8);
  if (config.product.price) {
    graph.push(`[${current}]drawtext=fontfile='${ffPath(config.brand.bodyFont)}':text='${config.product.price}':fontcolor=white:fontsize=34:x=(w-text_w)/2:y=1660:enable='between(t,${finalStart},${d})'[vprice]`);
    current = "vprice";
  }
  const host = new URL(config.product.url).hostname.replace(/^www\./, "").toUpperCase();
  graph.push(`[${current}]drawtext=fontfile='${ffPath(config.brand.bodyFont)}':text='${host}':fontcolor=${config.brand.accent}:fontsize=38:x=(w-text_w)/2:y=1740:enable='between(t,${finalStart},${d})'[vout]`);
  const musicVolume = number(config.audio.musicVolume, 0.18, "musicVolume");
  const audioIndex = config.product.images.length;
  graph.push(`[${audioIndex}:a]atrim=0:${d},asetpts=PTS-STARTPTS,volume=${config.audio.music ? musicVolume : 0},afade=t=out:st=${d - 0.8}:d=0.8[music]`);
  if (config.audio.voiceover) {
    graph.push(`[${audioIndex + 1}:a]atrim=0:${d},asetpts=PTS-STARTPTS,volume=${number(config.audio.voiceoverVolume, 1, "voiceoverVolume")}[voice]`, `[music][voice]amix=inputs=2:duration=longest:normalize=0[aout]`);
  } else graph.push(`[music]anull[aout]`);
  return graph.join(";\n");
}

function verify(config) {
  const output = run(ffprobe, ["-v", "error", "-show_entries", "stream=codec_name,codec_type,width,height,r_frame_rate:format=duration,size", "-of", "json", config.output.video], "output inspection");
  const metadata = JSON.parse(output);
  const video = metadata.streams.find((stream) => stream.codec_type === "video");
  const audio = metadata.streams.find((stream) => stream.codec_type === "audio");
  if (!video || video.width !== config.width || video.height !== config.height) fail("output dimensions are invalid");
  if (!audio) fail("output has no audio stream");
  return metadata;
}

const input = process.argv[2];
if (!input) fail("usage: node render.mjs <campaign.json>");
const campaign = resolve(process.cwd(), input);
if (!existsSync(campaign)) fail(`campaign not found: ${campaign}`);
const config = loadConfig(campaign);
mkdirSync(dirname(config.output.video), { recursive: true });
if (config.output.cover) mkdirSync(dirname(config.output.cover), { recursive: true });

const work = mkdtempSync(join(tmpdir(), "aarnorae-reel-"));
try {
  const textFiles = config.scenes.map((scene, index) => {
    const path = join(work, `scene-${index}.txt`);
    writeFileSync(path, `${scene.text}\n`, "utf8");
    return path;
  });
  const graph = filterGraph(config, textFiles);
  const args = ["-y"];
  config.product.images.forEach((image) => args.push("-loop", "1", "-framerate", String(config.fps), "-i", image));
  if (config.audio.music) args.push("-stream_loop", "-1", "-i", config.audio.music);
  else args.push("-f", "lavfi", "-i", "anullsrc=r=48000:cl=stereo");
  if (config.audio.voiceover) args.push("-i", config.audio.voiceover);
  args.push("-filter_complex", graph, "-map", "[vout]", "-map", "[aout]", "-t", String(config.duration), "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", "-r", String(config.fps), "-c:a", "aac", "-b:a", "128k", "-ar", "48000", "-movflags", "+faststart", config.output.video);
  run(ffmpeg, args, "video render");
  if (config.output.cover) run(ffmpeg, ["-y", "-ss", "1", "-i", config.output.video, "-frames:v", "1", "-q:v", "2", config.output.cover], "cover render");
  const info = verify(config);
  if (config.historyFile) {
    appendHistory(config.historyFile, {
      productKey: productKey(config.product),
      productId: config.product.id || null,
      handle: config.product.handle || null,
      title: config.product.title,
      status: "generated",
      generatedAt: new Date().toISOString(),
      postedAt: null,
      platform: "instagram",
      reelPath: config.output.video,
    });
  }
  console.log(`Rendered ${config.output.video}`);
  console.log(`${config.width}x${config.height}, ${Number(info.format.duration).toFixed(2)}s, ${(Number(info.format.size) / 1048576).toFixed(2)} MB, H.264 + AAC`);
  if (config.output.cover) console.log(`Cover ${config.output.cover}`);
} finally {
  rmSync(work, { recursive: true, force: true });
}
