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
 * Fetch YouTube Video Metadata (Title, Author, High-Res Thumbnail)
 * Uses client-safe, CORS-friendly oEmbed / Noembed endpoints with timeout and fallback.
 * @param {string} url - YouTube video URL or ID
 * @returns {Promise<{videoId: string, title: string, description: string, thumbnail: string, authorName: string}>}
 */
export async function fetchYouTubeMetadata(url) {
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) {
    throw new Error("Invalid YouTube video URL");
  }

  const thumbnail = getYouTubeThumbnailUrl(videoId, "maxres");
  let title = "";
  let authorName = "";

  const canonicalUrl = `https://www.youtube.com/watch?v= ${videoId}`.replace(" ", "");

  // Strategy 1: Noembed API (Fast, CORS-enabled, reliable)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(canonicalUrl)}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.title) {
        title = data.title;
        authorName = data.author_name || "";
      }
    }
  } catch (e) {
    // Fallback if Noembed is unreachable
  }

  // Strategy 2: Direct YouTube oEmbed (if title still empty)
  if (!title) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(canonicalUrl)}&format=json`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && data.title) {
          title = data.title;
          authorName = data.author_name || "";
        }
      }
    } catch (e) {
      // Ignored
    }
  }

  return {
    videoId,
    title: title || "",
    description: "",
    thumbnail,
    authorName
  };
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


