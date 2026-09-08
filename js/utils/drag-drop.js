/**
 * Reusable Drag & Drop List & Table Reordering Utility
 * Provides clean, accessible, and responsive drag-and-drop item reordering with boundary detection.
 */

/**
 * Initialize Drag & Drop Reordering on a list or table container
 * @param {Object} options
 * @param {HTMLElement|string} options.container - Container DOM element or selector
 * @param {string} options.itemSelector - Selector for individual draggable items (e.g. "tr.draggable-row" or ".draggable-card")
 * @param {string} [options.handleSelector] - Optional handle selector for drag initiation (default: ".drag-handle")
 * @param {Function} options.onReorder - (fromIndex: number, toIndex: number, fromId?: string, toId?: string) => void
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
  let fromId = null;

  const getItems = () => Array.from(container.querySelectorAll(itemSelector));

  const clearIndicators = () => {
    getItems().forEach(item => {
      item.classList.remove("drop-target-above", "drop-target-below", "is-dragging");
    });
  };

  const handleDragStart = (e) => {
    const item = e.target.closest(itemSelector);
    if (!item) return;

    // Verify handle if handleSelector is defined
    if (handleSelector) {
      const handle = e.target.closest(handleSelector);
      const isCard = item.classList.contains("draggable-card");
      if (!handle && !isCard) {
        // If drag started outside handle, prevent default
        e.preventDefault();
        return;
      }
    }

    draggedItem = item;
    const items = getItems();
    fromIndex = items.indexOf(item);
    fromId = item.getAttribute("data-id") || null;

    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", fromId || fromIndex.toString());

    // Delay adding dragging class so drag ghost image is clean
    setTimeout(() => {
      if (draggedItem) {
        draggedItem.classList.add("is-dragging");
      }
    }, 10);
  };

  const findTargetItemAndPosition = (e) => {
    const items = getItems();
    if (!items.length) return null;

    // First, check if event target is an item
    let targetItem = e.target.closest(itemSelector);

    // If dragged over container header or above first item
    const firstRect = items[0].getBoundingClientRect();
    if (e.clientY < firstRect.top + 5) {
      return { targetItem: items[0], isAbove: true };
    }

    // If dragged below last item
    const lastRect = items[items.length - 1].getBoundingClientRect();
    if (e.clientY > lastRect.bottom - 5) {
      return { targetItem: items[items.length - 1], isAbove: false };
    }

    if (!targetItem) {
      // Find closest item by vertical center
      let closest = items[0];
      let minDistance = Infinity;
      items.forEach(it => {
        const r = it.getBoundingClientRect();
        const dist = Math.abs(e.clientY - (r.top + r.height / 2));
        if (dist < minDistance) {
          minDistance = dist;
          closest = it;
        }
      });
      targetItem = closest;
    }

    const rect = targetItem.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    const isAbove = e.clientY < midY;

    return { targetItem, isAbove };
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";

    if (!draggedItem) return;

    const targetPos = findTargetItemAndPosition(e);
    if (!targetPos) return;

    const { targetItem, isAbove } = targetPos;

    if (targetItem === draggedItem) {
      clearIndicators();
      draggedItem.classList.add("is-dragging");
      return;
    }

    // Clear indicators on other items
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
    if (targetItem && !targetItem.contains(e.relatedTarget) && !container.contains(e.relatedTarget)) {
      targetItem.classList.remove("drop-target-above", "drop-target-below");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();

    if (!draggedItem) {
      clearIndicators();
      return;
    }

    const targetPos = findTargetItemAndPosition(e);
    if (!targetPos) {
      clearIndicators();
      return;
    }

    const { targetItem, isAbove } = targetPos;

    if (!targetItem || targetItem === draggedItem) {
      clearIndicators();
      draggedItem = null;
      fromIndex = -1;
      fromId = null;
      return;
    }

    const items = getItems();
    const currentFromIndex = items.indexOf(draggedItem);
    const targetIndex = items.indexOf(targetItem);

    if (currentFromIndex === -1 || targetIndex === -1) {
      clearIndicators();
      return;
    }

    let newIndex = targetIndex;
    if (isAbove) {
      // Placing above the target item
      if (currentFromIndex > targetIndex) {
        // Dragging UP to above target: target becomes the new position
        newIndex = targetIndex;
      } else {
        // Dragging DOWN to above target: placed before target
        newIndex = Math.max(0, targetIndex - 1);
      }
    } else {
      // Placing below the target item
      if (currentFromIndex > targetIndex) {
        // Dragging UP to below target: placed after target
        newIndex = targetIndex + 1;
      } else {
        // Dragging DOWN to below target: target index in new array
        newIndex = targetIndex;
      }
    }

    clearIndicators();

    const currentFromId = fromId || draggedItem.getAttribute("data-id");
    const targetId = items[newIndex] ? items[newIndex].getAttribute("data-id") : targetItem.getAttribute("data-id");

    if (currentFromIndex !== newIndex) {
      if (typeof onReorder === "function") {
        onReorder(currentFromIndex, newIndex, currentFromId, targetId);
      }
    }

    draggedItem = null;
    fromIndex = -1;
    fromId = null;
  };

  const handleDragEnd = () => {
    clearIndicators();
    draggedItem = null;
    fromIndex = -1;
    fromId = null;
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

  // If container is inside a table, also attach dragover and drop to the table/thead so dragging to the top header works seamlessly
  const table = container.closest("table");
  let tableDragOver = null;
  let tableDrop = null;
  if (table) {
    tableDragOver = (e) => {
      e.preventDefault();
      handleDragOver(e);
    };
    tableDrop = (e) => {
      handleDrop(e);
    };
    table.addEventListener("dragover", tableDragOver);
    table.addEventListener("drop", tableDrop);
  }

  return () => {
    container.removeEventListener("dragstart", handleDragStart);
    container.removeEventListener("dragover", handleDragOver);
    container.removeEventListener("dragleave", handleDragLeave);
    container.removeEventListener("drop", handleDrop);
    container.removeEventListener("dragend", handleDragEnd);
    if (table) {
      if (tableDragOver) table.removeEventListener("dragover", tableDragOver);
      if (tableDrop) table.removeEventListener("drop", tableDrop);
    }
  };
}

