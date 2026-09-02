import "server-only";

import fs from "fs";
import path from "path";

/**
 * Reads intrinsic pixel dimensions straight from an image file header.
 *
 * Deliberately dependency-free (no sharp/image-size at build time) and only
 * supports the formats the site actually ships: PNG, JPEG, WebP. Used so
 * Open Graph and JSON-LD can declare an image's *real* size instead of a
 * hardcoded guess — wrong dimensions make social scrapers mis-render previews.
 */
export type ImageDimensions = { width: number; height: number };

function pngSize(buf: Buffer): ImageDimensions | undefined {
  if (buf.length < 24) return undefined;
  if (buf.readUInt32BE(0) !== 0x89504e47) return undefined;
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

function jpegSize(buf: Buffer): ImageDimensions | undefined {
  if (buf.length < 4 || buf[0] !== 0xff || buf[1] !== 0xd8) return undefined;
  let i = 2;
  while (i < buf.length - 9) {
    if (buf[i] !== 0xff) {
      i += 1;
      continue;
    }
    const marker = buf[i + 1];
    // SOF0/1/2/3 and SOF5-7, SOF9-11, SOF13-15 carry the frame dimensions.
    const isSof =
      (marker >= 0xc0 && marker <= 0xc3) ||
      (marker >= 0xc5 && marker <= 0xc7) ||
      (marker >= 0xc9 && marker <= 0xcb) ||
      (marker >= 0xcd && marker <= 0xcf);
    if (isSof) {
      return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
    }
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      i += 2;
      continue;
    }
    i += 2 + buf.readUInt16BE(i + 2);
  }
  return undefined;
}

function webpSize(buf: Buffer): ImageDimensions | undefined {
  if (buf.length < 30) return undefined;
  if (buf.toString("ascii", 0, 4) !== "RIFF" || buf.toString("ascii", 8, 12) !== "WEBP") {
    return undefined;
  }
  const chunk = buf.toString("ascii", 12, 16);
  if (chunk === "VP8X") {
    return {
      width: 1 + buf.readUIntLE(24, 3),
      height: 1 + buf.readUIntLE(27, 3)
    };
  }
  if (chunk === "VP8 ") {
    return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
  }
  if (chunk === "VP8L") {
    const b = buf.readUInt32LE(21);
    return { width: (b & 0x3fff) + 1, height: ((b >> 14) & 0x3fff) + 1 };
  }
  return undefined;
}

const cache = new Map<string, ImageDimensions | undefined>();

/**
 * Resolve dimensions for a site-relative image path (e.g. "/blog-1.jpg").
 * Returns undefined for remote URLs or unreadable/unsupported files, so callers
 * can fall back rather than emitting a wrong number.
 */
export function getPublicImageSize(imagePath: string): ImageDimensions | undefined {
  if (/^https?:\/\//.test(imagePath)) return undefined;
  if (cache.has(imagePath)) return cache.get(imagePath);

  let result: ImageDimensions | undefined;
  try {
    const clean = imagePath.split(/[?#]/)[0];
    const filePath = path.join(process.cwd(), "public", clean.replace(/^\//, ""));
    const buf = fs.readFileSync(filePath);
    result = pngSize(buf) ?? jpegSize(buf) ?? webpSize(buf);
  } catch {
    result = undefined;
  }

  cache.set(imagePath, result);
  return result;
}
