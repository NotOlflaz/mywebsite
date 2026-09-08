/**
 * Reusable Modern Image Uploader & Media Picker Component
 * Supports: Drag & Drop, PC File Picker, Direct URL input, Live Image Preview, Replace, Remove,
 * and Smart Client-side Canvas Image Compression for LocalStorage efficiency.
 */

import { getIcon } from "../utils/icons.js";
import { toast } from "./Toast.js";

const MAX_RAW_FILE_SIZE = 10 * 1024 * 1024; // 10MB raw file limit
const TARGET_MAX_DIMENSION = 1600; // Max width/height in px
const COMPRESSION_QUALITY = 0.88; // High visual fidelity with small footprint

/**
 * Optimize and compress image on HTML5 Canvas to prevent LocalStorage quota overflow
 * @param {File} file - User selected image file
 * @returns {Promise<{dataUrl: string, name: string, sizeText: string}>}
 */
export function processImageFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("No file provided"));
      return;
    }

    // Validate mime type
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type.toLowerCase())) {
      reject(new Error("Unsupported format. Please select a PNG, JPG, WEBP, or GIF image."));
      return;
    }

    // Validate size
    if (file.size > MAX_RAW_FILE_SIZE) {
      reject(new Error(`File size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds the 10 MB limit.`));
      return;
    }

    const reader = new FileReader();

    reader.onerror = () => reject(new Error("Failed to read image file from disk."));

    reader.onload = (e) => {
      const rawDataUrl = e.target.result;

      // Keep GIFs as raw data URL to preserve animation frames
      if (file.type === "image/gif") {
        resolve({
          dataUrl: rawDataUrl,
          name: file.name,
          sizeText: formatBytes(file.size)
        });
        return;
      }

      // Resize and optimize PNG/JPG/WEBP on canvas
      const img = new Image();
      img.onerror = () => reject(new Error("Corrupted or unreadable image."));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate proportional scale
        if (width > TARGET_MAX_DIMENSION || height > TARGET_MAX_DIMENSION) {
          if (width > height) {
            height = Math.round((height * TARGET_MAX_DIMENSION) / width);
            width = TARGET_MAX_DIMENSION;
          } else {
            width = Math.round((width * TARGET_MAX_DIMENSION) / height);
            height = TARGET_MAX_DIMENSION;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        
        // Use better smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // Determine best output format
        let outputType = file.type === "image/png" ? "image/png" : "image/jpeg";
        // If PNG is very large and lacks transparency, JPEG at 0.90 is 10x smaller
        let compressedDataUrl = canvas.toDataURL(outputType, COMPRESSION_QUALITY);
        
        // If PNG output is still over 400KB, test JPEG format
        if (outputType === "image/png" && compressedDataUrl.length > 550000) {
          const jpegTest = canvas.toDataURL("image/jpeg", 0.88);
          if (jpegTest.length < compressedDataUrl.length * 0.6) {
            compressedDataUrl = jpegTest;
          }
        }

        const approxBytes = Math.round((compressedDataUrl.length * 3) / 4);
        resolve({
          dataUrl: compressedDataUrl,
          name: file.name,
          sizeText: formatBytes(approxBytes)
        });
      };

      img.src = rawDataUrl;
    };

    reader.readAsDataURL(file);
  });
}

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return "0 KB";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Render Image Uploader HTML Component
 * @param {Object} config - Component configuration
 * @returns {string} HTML markup
 */
export function renderImageUploader(config) {
  const {
    id,
    value = "",
    label = "Image Asset",
    helperText = "Supports PNG, JPG, WEBP, GIF (Auto-optimized)",
    placeholder = "https://... or images/asset.png",
    aspect = "16/9",
    allowUrl = true,
    badgeText = ""
  } = config;

  const hasImage = Boolean(value && value.trim());
  const isDataUrl = hasImage && value.startsWith("data:");
  const initialBadge = badgeText || (isDataUrl ? "Local Upload" : (hasImage ? "URL Asset" : ""));

  return `
    <div class="image-uploader-wrapper" id="uploader-wrap-${id}" data-uploader-id="${id}" data-aspect="${aspect}">
      
      <!-- Component Header -->
      <div class="image-uploader-header flex items-center justify-between">
        <label class="form-label font-bold" for="${id}" style="margin-bottom: 0;">${label}</label>
        <span class="image-uploader-format-badge">PNG • JPG • WEBP • GIF</span>
      </div>

      <!-- Hidden Real Input Value -->
      <input type="hidden" id="${id}" name="${id}" class="image-uploader-hidden-value" value="${escapeHtml(value)}" />
      <input type="file" id="${id}-file-input" class="image-uploader-native-file" accept="image/png,image/jpeg,image/webp,image/gif" style="display: none;" />

      <!-- State 1: Image Preview Card (Shown when an image is present) -->
      <div class="image-uploader-preview-card" id="${id}-preview-card" style="${hasImage ? '' : 'display: none;'}">
        <div class="image-preview-frame" style="aspect-ratio: ${aspect};">
          <img src="${escapeHtml(value)}" id="${id}-preview-img" alt="Uploaded Preview" loading="lazy" />
          
          <div class="image-preview-overlay">
            <button type="button" class="btn btn-secondary btn-sm image-uploader-replace-btn" id="${id}-replace-btn" title="Change / Replace this image">
              ${getIcon("upload", 14)}
              <span>Replace</span>
            </button>
            <button type="button" class="btn btn-danger btn-sm image-uploader-remove-btn" id="${id}-remove-btn" title="Remove image">
              ${getIcon("trash", 14)}
              <span>Remove</span>
            </button>
          </div>
        </div>

        <div class="image-preview-meta flex items-center justify-between">
          <div class="flex items-center gap-xs">
            <span class="image-status-pill" id="${id}-status-pill">${initialBadge}</span>
            <span class="image-size-pill text-xs font-mono" id="${id}-size-pill">${isDataUrl ? 'Optimized' : 'Linked'}</span>
          </div>
          <button type="button" class="btn-text-action text-xs text-muted image-uploader-toggle-url-btn" id="${id}-toggle-url-btn">
            ${getIcon("link", 12)} Edit as URL
          </button>
        </div>
      </div>

      <!-- State 2: Dropzone & Upload Selector (Shown when no image or replacing) -->
      <div class="image-uploader-dropzone-box" id="${id}-dropzone-box" style="${hasImage ? 'display: none;' : ''}">
        
        <!-- Tabs: Upload from PC / Paste URL -->
        ${allowUrl ? `
          <div class="uploader-tabs">
            <button type="button" class="uploader-tab active" id="${id}-tab-pc" data-tab="pc">
              ${getIcon("upload", 13)}
              <span>Upload from PC</span>
            </button>
            <button type="button" class="uploader-tab" id="${id}-tab-url" data-tab="url">
              ${getIcon("link", 13)}
              <span>Image URL</span>
            </button>
          </div>
        ` : ''}

        <!-- Tab Panel 1: PC Drag & Drop Zone -->
        <div class="uploader-tab-content active" id="${id}-panel-pc">
          <div class="upload-dropzone" id="${id}-dropzone" tabindex="0" role="button" aria-label="Upload image from computer">
            <div class="upload-dropzone-content text-center">
              <div class="upload-icon-circle">
                ${getIcon("upload", 22)}
              </div>
              <div class="upload-dropzone-title font-bold">
                <span>Click to browse from PC</span> or drag & drop
              </div>
              <div class="upload-dropzone-subtitle text-xs text-muted">
                ${helperText}
              </div>
            </div>
            
            <!-- Loading Overlay during file compression -->
            <div class="upload-dropzone-loading" id="${id}-dropzone-loading" style="display: none;">
              <span class="spinner" style="width: 24px; height: 24px; border-width: 2px;"></span>
              <span class="text-xs text-muted font-bold" style="margin-top: 8px;">Optimizing image...</span>
            </div>
          </div>
        </div>

        <!-- Tab Panel 2: Direct URL Input -->
        ${allowUrl ? `
          <div class="uploader-tab-content" id="${id}-panel-url" style="display: none;">
            <div class="uploader-url-box">
              <div class="flex gap-xs">
                <input 
                  type="text" 
                  class="form-input uploader-url-input" 
                  id="${id}-url-input" 
                  placeholder="${placeholder}"
                  value="${!isDataUrl && hasImage ? escapeHtml(value) : ''}"
                />
                <button type="button" class="btn btn-secondary uploader-url-apply-btn" id="${id}-url-apply-btn">
                  ${getIcon("check", 14)} Apply
                </button>
              </div>
              <span class="form-helper" style="font-size: 11px;">Paste any public web image URL or Media Library path.</span>
            </div>
          </div>
        ` : ''}

      </div>

    </div>
  `;
}

/**
 * Initialize Event Listeners for an Image Uploader
 * @param {HTMLElement|string} containerOrScope - Container element or modal element
 * @param {string} id - Uploader ID
 * @param {Object} callbacks - Optional callbacks { onChange, onRemove }
 */
export function initImageUploader(containerOrScope, id, callbacks = {}) {
  const scope = typeof containerOrScope === "string" 
    ? document.getElementById(containerOrScope) 
    : (containerOrScope || document);

  if (!scope) return null;

  const wrapper = scope.querySelector(`#uploader-wrap-${id}`);
  if (!wrapper) return null;

  const hiddenInput = scope.querySelector(`#${id}`);
  const fileInput = scope.querySelector(`#${id}-file-input`);
  const dropzone = scope.querySelector(`#${id}-dropzone`);
  const dropzoneBox = scope.querySelector(`#${id}-dropzone-box`);
  const loadingOverlay = scope.querySelector(`#${id}-dropzone-loading`);
  const previewCard = scope.querySelector(`#${id}-preview-card`);
  const previewImg = scope.querySelector(`#${id}-preview-img`);
  const statusPill = scope.querySelector(`#${id}-status-pill`);
  const sizePill = scope.querySelector(`#${id}-size-pill`);
  const replaceBtn = scope.querySelector(`#${id}-replace-btn`);
  const removeBtn = scope.querySelector(`#${id}-remove-btn`);
  const toggleUrlBtn = scope.querySelector(`#${id}-toggle-url-btn`);

  const tabPc = scope.querySelector(`#${id}-tab-pc`);
  const tabUrl = scope.querySelector(`#${id}-tab-url`);
  const panelPc = scope.querySelector(`#${id}-panel-pc`);
  const panelUrl = scope.querySelector(`#${id}-panel-url`);
  const urlInput = scope.querySelector(`#${id}-url-input`);
  const urlApplyBtn = scope.querySelector(`#${id}-url-apply-btn`);

  // Update UI with a new image value
  const applyImageValue = (imgValue, sourceName = "Local Upload", sizeText = "Optimized", fileName = "") => {
    if (hiddenInput) hiddenInput.value = imgValue;
    if (previewImg) previewImg.src = imgValue;
    if (statusPill) statusPill.textContent = sourceName;
    if (sizePill) sizePill.textContent = sizeText;

    if (dropzoneBox) dropzoneBox.style.display = "none";
    if (previewCard) previewCard.style.display = "block";

    if (typeof callbacks.onChange === "function") {
      callbacks.onChange(imgValue, { source: sourceName, size: sizeText, name: fileName });
    }
  };

  // Clear image value
  const clearImageValue = () => {
    if (hiddenInput) hiddenInput.value = "";
    if (previewImg) previewImg.src = "";
    if (fileInput) fileInput.value = "";
    if (urlInput) urlInput.value = "";

    if (previewCard) previewCard.style.display = "none";
    if (dropzoneBox) dropzoneBox.style.display = "block";

    if (typeof callbacks.onRemove === "function") {
      callbacks.onRemove();
    }
  };

  // Handle uploaded File
  const handleFile = async (file) => {
    if (!file) return;

    if (loadingOverlay) loadingOverlay.style.display = "flex";

    try {
      const result = await processImageFile(file);
      applyImageValue(result.dataUrl, "Local Upload", result.sizeText, result.name);
      toast.success(`Image "${file.name}" uploaded successfully!`);
    } catch (err) {
      toast.error(err.message || "Failed to process image file.");
    } finally {
      if (loadingOverlay) loadingOverlay.style.display = "none";
      if (fileInput) fileInput.value = "";
    }
  };

  // 1. File Input Trigger & Change
  if (dropzone && fileInput) {
    dropzone.addEventListener("click", (e) => {
      // Don't trigger if clicked on child button
      if (e.target.closest("button") || e.target.closest("input")) return;
      fileInput.click();
    });

    dropzone.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        fileInput.click();
      }
    });

    fileInput.addEventListener("change", (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) handleFile(file);
    });
  }

  // 2. Drag & Drop Handling
  if (dropzone) {
    ["dragenter", "dragover"].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add("dragover");
      });
    });

    ["dragleave", "drop"].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove("dragover");
      });
    });

    dropzone.addEventListener("drop", (e) => {
      const dt = e.dataTransfer;
      const file = dt && dt.files && dt.files[0];
      if (file) {
        handleFile(file);
      }
    });
  }

  // 3. Tab Switching
  if (tabPc && tabUrl && panelPc && panelUrl) {
    tabPc.addEventListener("click", () => {
      tabPc.classList.add("active");
      tabUrl.classList.remove("active");
      panelPc.style.display = "block";
      panelUrl.style.display = "none";
    });

    tabUrl.addEventListener("click", () => {
      tabUrl.classList.add("active");
      tabPc.classList.remove("active");
      panelUrl.style.display = "block";
      panelPc.style.display = "none";
      if (urlInput) urlInput.focus();
    });
  }

  // 4. URL Apply
  if (urlApplyBtn && urlInput) {
    urlApplyBtn.addEventListener("click", () => {
      const url = urlInput.value.trim();
      if (!url) {
        toast.error("Please enter a valid image URL.");
        return;
      }
      applyImageValue(url, "URL Asset", "External");
      toast.success("Image URL linked successfully!");
    });

    urlInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        urlApplyBtn.click();
      }
    });
  }

  // 5. Replace & Remove Buttons
  if (replaceBtn) {
    replaceBtn.addEventListener("click", () => {
      if (fileInput) fileInput.click();
    });
  }

  if (removeBtn) {
    removeBtn.addEventListener("click", () => {
      clearImageValue();
    });
  }

  // 6. Edit as URL toggle from preview
  if (toggleUrlBtn) {
    toggleUrlBtn.addEventListener("click", () => {
      if (dropzoneBox) dropzoneBox.style.display = "block";
      if (previewCard) previewCard.style.display = "none";
      if (tabUrl && tabPc && panelPc && panelUrl) {
        tabUrl.click();
      }
    });
  }

  return {
    setValue: (val, source = "Auto-detected", size = "") => applyImageValue(val, source, size),
    getValue: () => (hiddenInput ? hiddenInput.value.trim() : ""),
    clear: clearImageValue
  };
}
