// Ported from JT_dashboard/src/lib/dragToScroll.ts (`enableDragToScroll`, the
// only variant the dashboard used). Returns a cleanup function so the React
// effect that enables it can remove every listener again.

const SCROLLABLE_SELECTOR = '.overflow-y-auto, [style*="overflow-y: auto"]'

/**
 * Enables drag-to-scroll functionality for all elements with overflow-y-auto
 * inside `scope` (the original queried the whole document; the dashboard's
 * DOM now lives inside `.jtd-root`). Uses mouse events to implement smooth
 * scrolling interaction.
 */
export function enableDragToScroll(scope: ParentNode = document): () => void {
  const cleanups: (() => void)[] = []

  scope.querySelectorAll<HTMLElement>(SCROLLABLE_SELECTOR).forEach((htmlElement) => {
    let isMouseDown = false
    let startY = 0
    let scrollTop = 0
    let isDragging = false

    // Mouse down event - start drag
    const onMouseDown = (e: MouseEvent) => {
      // Only handle left mouse button
      if (e.button !== 0) return

      isMouseDown = true
      startY = e.clientY
      scrollTop = htmlElement.scrollTop
      isDragging = false

      // Change cursor to indicate dragging state
      htmlElement.style.cursor = 'grabbing'
      htmlElement.style.userSelect = 'none'

      // Prevent text selection while dragging
      e.preventDefault()
    }

    // Mouse move event - perform scroll
    const onMouseMove = (e: MouseEvent) => {
      if (!isMouseDown) return

      e.preventDefault()

      const deltaY = startY - e.clientY

      // Set dragging flag if mouse has moved significantly
      if (Math.abs(deltaY) > 3) {
        isDragging = true
      }

      // Scroll the element
      htmlElement.scrollTop = scrollTop + deltaY
    }

    // Mouse up / leave - end drag and reset cursor
    const endDrag = () => {
      isMouseDown = false
      isDragging = false
      htmlElement.style.cursor = ''
      htmlElement.style.userSelect = ''
    }

    // Prevent click events when dragging (to avoid unintended clicks)
    const onClick = (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault()
        e.stopPropagation()
      }
    }

    // Add some visual feedback - change cursor on hover
    const onMouseEnter = () => {
      if (!isMouseDown) {
        htmlElement.style.cursor = 'grab'
      }
    }

    htmlElement.addEventListener('mousedown', onMouseDown)
    htmlElement.addEventListener('mousemove', onMouseMove)
    htmlElement.addEventListener('mouseup', endDrag)
    htmlElement.addEventListener('mouseleave', endDrag)
    htmlElement.addEventListener('click', onClick, true)
    htmlElement.addEventListener('mouseenter', onMouseEnter)

    cleanups.push(() => {
      htmlElement.removeEventListener('mousedown', onMouseDown)
      htmlElement.removeEventListener('mousemove', onMouseMove)
      htmlElement.removeEventListener('mouseup', endDrag)
      htmlElement.removeEventListener('mouseleave', endDrag)
      htmlElement.removeEventListener('click', onClick, true)
      htmlElement.removeEventListener('mouseenter', onMouseEnter)
      htmlElement.style.cursor = ''
      htmlElement.style.userSelect = ''
    })
  })

  return () => cleanups.forEach((cleanup) => cleanup())
}
