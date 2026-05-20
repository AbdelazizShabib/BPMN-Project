# Bug Report: BPMN Process Viewer Path Failure

## Summary of the Issue
The `/bpmn` path in the application was failing to load. It rendered a completely blank/black screen and crashed the React rendering tree. Additionally, even after resolving the crash, the diagram layout was pushed completely off-screen, rendering it invisible to the user.

---

## Root Cause Analysis

### 1. Missing Dependency Providers (`contextPad`, `palette`)
* **Behavior:** The browser console reported errors such as `Error: No provider for 'contextPad'!` or related issues with `keyboard.bindTo`.
* **Cause:** The application utilizes `BpmnNavigatedViewer` (a read-only navigation viewer) to display the Scrum workflow diagram. However, the initial configuration imported the default `bpmn-js-token-simulation` package. The full simulation package assumes it is running inside `BpmnModeler` and attempts to inject context pad extensions, side palettes, and keyboard shortcuts. Since `BpmnNavigatedViewer` does not contain these editor-only modules, the dependency injection container threw a fatal exception, crashing the React component.

### 2. Layout Race Condition & Viewport Corruption
* **Behavior:** Once the React crash was fixed, the canvas container rendered blank. Manual pan/zoom interactions or resetting/fitting the view pushed the diagram off-screen or rendered it in an extremely tiny, squeezed horizontal strip.
* **Cause:** The component attempted to fit the view (`canvas.zoom('fit-viewport')`) immediately on load using a double-`requestAnimationFrame` callback. Because the container is part of a responsive flex grid layout, its dimensions were initially `0px` or very small during the early layout stages. Performing coordinate calculations (like centering the zoom on the Scrum lane at diagram coordinates `{ x: 1500, y: 460 }`) on a zero-size viewport resulted in `NaN` translation matrices, permanently panning the diagram off-screen.

---

## Implemented Fixes

### 1. Switched to Viewer-Specific Token Simulation Module
In `src/pages/BpmnViewer.jsx`, the imports were updated to target the viewer-specific entry point of the token simulation library:
```javascript
// Before (Modeler-only dependencies)
import TokenSimulationModule from 'bpmn-js-token-simulation'

// After (Viewer-compatible sub-module)
import TokenSimulationModule from 'bpmn-js-token-simulation/lib/viewer'
```
This excludes editor-specific modules (`contextPad`, `palette`, `keyboard-bindings`, `editor-actions`) and prevents the dependency injection container from throwing fatal errors.

### 2. Developed a Robust ResizeObserver Container Guard
Instead of using fragile `requestAnimationFrame` timings, we introduced a `ResizeObserver` to monitor the canvas container's bounding rect. We ensure that the viewport fitting calculations are *only* executed when the container has fully stabilized at a readable size:
```javascript
let resizeObserver = null

resizeObserver = new ResizeObserver(entries => {
  if (destroyed) return
  for (let entry of entries) {
    const { width, height } = entry.contentRect
    // Only zoom and center once container is stable and sized
    if (width > 500 && height > 300) {
      canvas.zoom('fit-viewport', 'auto')
      if (canvas.zoom() < 0.25) {
        canvas.zoom(0.28, { x: 1500, y: 460 })
      }
      resizeObserver.disconnect()
    }
  }
})
resizeObserver.observe(containerRef.current)
```
This ensures the initial viewport centering operates on valid client dimensions, placing the start of the Scrum workflow perfectly in the center on first load.

---

## Verification Results

* **Vite Hot Module Replacement:** Hot-reloaded cleanly with no compilation or build warnings.
* **Browser Logs:** Verified zero console errors or React runtime warnings on page load.
* **Diagram Rendering:** The Scrum diagram loads immediately at a readable zoom level, focusing on the Product Owner / Scrum Master lanes, and supports zoom, pan, and token simulation.

![BPMN Viewer Verification Screen](file:///C:/Users/zezom/.gemini/antigravity/brain/4e1600b9-4dd1-4cbb-9da4-847fa5afe0f8/.tempmediaStorage/media_4e1600b9-4dd1-4cbb-9da4-847fa5afe0f8_1779317792177.png)
