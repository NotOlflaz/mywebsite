/**
 * Reusable Drag & Drop List & Table Reordering Utility
 * Provides clean, accessible, and responsive drag-and-drop item reordering.
 */

/**
 * Initialize Drag & Drop Reordering on a list or table container
 * @param {Object} options
 * @param {HTMLElement|string} options.container - Container DOM element or selector
 * @param {string} options.itemSelector - Selector for individual draggable items
 * @param {string} [options.handleSelector] - Optional handle selector for drag initiation
 * @param {Function} options.onReorder - (fromIndex: number, toIndex: number) => void
 * @returns {Function} cleanup function to remove event listeners
 */
export function initDraggableList(options) {
  const {
    container: containerOrSelector,
    itemSelector,
    handleSelector = ".drag-handle",
    onReorder
  } = options;

  const container = typeof containerOrSelector === "string"
    ? document.querySelector(containerOrSelector)
    : containerOrSelector;

  if (!container) return () => {};

  let draggedItem = null;
  let fromIndex = -1;

  const getItems = () => Array.from(container.querySelectorAll(itemSelector));

  const clearIndicators = () => {
    getItems().forEach(item => {
      item.classList.remove("drop-target-above", "drop-target-below", "is-dragging");
    });
  };

  const handleDragStart = (e) => {
    const item = e.target.closest(itemSelector);
    if (!item) return;

    // If handleSelector is specified, verify target was inside handle
    if (handleSelector && !e.target.closest(handleSelector) && !item.classList.contains("draggable-card")) {
      e.preventDefault();
      return;
    }

    draggedItem = item;
    const items = getItems();
    fromIndex = items.indexOf(item);

    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", fromIndex.toString());

    // Delay adding dragging class so drag ghost image is clean
    setTimeout(() => {
      if (draggedItem) {
        draggedItem.classList.add("is-dragging");
      }
    }, 10);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";

    const targetItem = e.target.closest(itemSelector);
    if (!targetItem || targetItem === draggedItem) return;

    const rect = targetItem.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    const isAbove = e.clientY < midY;

    // Clear others
    getItems().forEach(item => {
      if (item !== targetItem) {
        item.classList.remove("drop-target-above", "drop-target-below");
      }
    });

    if (isAbove) {
      targetItem.classList.add("drop-target-above");
      targetItem.classList.remove("drop-target-below");
    } else {
      targetItem.classList.add("drop-target-below");
      targetItem.classList.remove("drop-target-above");
    }
  };

  const handleDragLeave = (e) => {
    const targetItem = e.target.closest(itemSelector);
    if (targetItem && !targetItem.contains(e.relatedTarget)) {
      targetItem.classList.remove("drop-target-above", "drop-target-below");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const targetItem = e.target.closest(itemSelector);

    if (!draggedItem || !targetItem || draggedItem === targetItem) {
      clearIndicators();
      return;
    }

    const items = getItems();
    let toIndex = items.indexOf(targetItem);

    if (targetItem.classList.contains("drop-target-below")) {
      // If moving down, index stays as toIndex; if moving up, it becomes toIndex
      if (fromIndex > toIndex) {
        toIndex += 1;
      }
    } else if (targetItem.classList.contains("drop-target-above")) {
      if (fromIndex < toIndex) {
        toIndex -= 1;
      }
    }

    clearIndicators();

    if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
      if (typeof onReorder === "function") {
        onReorder(fromIndex, toIndex);
      }
    }

    draggedItem = null;
    fromIndex = -1;
  };

  const handleDragEnd = () => {
    clearIndicators();
    draggedItem = null;
    fromIndex = -1;
  };

  // Attach drag attributes to items
  const items = getItems();
  items.forEach(item => {
    item.setAttribute("draggable", "true");
  });

  container.addEventListener("dragstart", handleDragStart);
  container.addEventListener("dragover", handleDragOver);
  container.addEventListener("dragleave", handleDragLeave);
  container.addEventListener("drop", handleDrop);
  container.addEventListener("dragend", handleDragEnd);

  return () => {
    container.removeEventListener("dragstart", handleDragStart);
    container.removeEventListener("dragover", handleDragOver);
    container.removeEventListener("dragleave", handleDragLeave);
    container.removeEventListener("drop", handleDrop);
    container.removeEventListener("dragend", handleDragEnd);
  };
}
