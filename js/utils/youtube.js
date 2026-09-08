/**
 * YouTube Utility Helper
 * Extracts video IDs from all standard YouTube URL formats and generates thumbnail URLs.
 */

/**
 * Extract YouTube Video ID from various URL formats
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://m.youtube.com/watch?v=VIDEO_ID
 * - Plain video ID (11 chars)
 * @param {string} url - YouTube URL or raw ID
 * @returns {string} 11-character video ID or empty string
 */
export function extractYouTubeVideoId(url) {
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();

  // If it's already an 11-char alphanumeric/dash/underscore ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Regex for standard YouTube URLs
  const regExp = /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = trimmed.match(regExp);

  return match && match[1] ? match[1] : "";
}

/**
 * Get YouTube Thumbnail URL
 * @param {string} videoIdOrUrl - Video ID or full YouTube URL
 * @param {'maxres'|'hq'|'mq'|'default'} quality - Image quality
 * @returns {string} Image URL
 */
export function getYouTubeThumbnailUrl(videoIdOrUrl, quality = "maxres") {
  const videoId = extractYouTubeVideoId(videoIdOrUrl);
  if (!videoId) return "";

  const qualityFilename = {
    maxres: "maxresdefault.jpg",
    hq: "hqdefault.jpg",
    mq: "mqdefault.jpg",
    default: "default.jpg"
  }[quality] || "maxresdefault.jpg";

  return `https://img.youtube.com/vi/${videoId}/${qualityFilename}`;
}
