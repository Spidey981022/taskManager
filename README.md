# Browser Concepts Behind This Project

This document is split into two parts:

- **Part 1 — Used in this project**: concepts this codebase actually touches, with real examples from the code.
- **Part 2 — Good to know**: concepts that happen under the hood in every browser, but aren't directly exercised by this project's code.

---

## Part 1: Concepts Used in This Project

### 1. DOM Tree

The DOM (Document Object Model) is the browser's structured, in-memory representation of the HTML page — every tag becomes a node, and JavaScript reads/writes that structure directly.

This project interacts with the DOM constantly:

```js
const taskName = document.querySelector('.task-name');
const showTask = document.querySelector('#show-task');
```

Every time `ui()` runs, it destroys and rebuilds a chunk of the DOM:

```js
const ui = () => {
    showTask.innerHTML = '';
    taskArr.forEach((elem, index) => {
        showTask.innerHTML += `<div class="task-box" ...>...</div>`;
    });
};
```

This is also *why* directly styling an element (`taskBox[index].style.border = ...`) didn't persist earlier in development — `ui()` wipes those DOM nodes and creates fresh ones from `taskArr` on every call. The fix was to store state (`status`, `tCategory`) in the data and let the DOM be re-derived from it every time.

### 2. CSSOM (CSS Object Model)

The CSSOM is the browser's structured representation of CSS rules — similar to the DOM, but for stylesheets. This project uses it in two ways:

- **Static styling**, written in `task.css` and applied via class selectors like `.task-box`.
- **Dynamic styling**, generated in JS and injected as inline styles:

```js
const statusColors = {
    complete: '#98FB98',
    pending: '#F0E68C',
    reject: '#F88379',
};

const backgroundColor = statusColors[elem.status];
// ...
`<div class="task-box" style="background-color: ${backgroundColor};">`
```

Here, the CSSOM ends up being a mix of your external stylesheet's rules plus whatever inline `style` attributes get generated per task, based on its `status`.

### 3. Event Bubbling

Event Bubbling means an event fires on the exact element clicked, then travels back up through its ancestors. This project relies on bubbling for the edit form:

```js
editForm.addEventListener('submit', (e) => {
    const clickedBtn = e.submitter;
    if (clickedBtn.classList.contains('cncl-btn')) { ... }
    if (clickedBtn.classList.contains('edit-btn')) { ... }
});
```

Clicking either the "Edit" or "Cancel" `<button>` triggers a `submit` event that bubbles up to the `<form>`, where the single listener is attached. Without bubbling, this pattern wouldn't work — you'd need a separate listener directly on each button.

### 4. Event Delegation

Event Delegation is the technique of attaching one listener to a parent (or the form, in this case) instead of separate listeners on each child element, then using event information (`e.submitter`, or `e.target` in other setups) to determine which child actually triggered it.

This project's edit/cancel logic is a working example of delegation: one `submit` listener handles two different buttons by checking `e.submitter.classList`.

**Where this project could extend the pattern further:** right now, each task's icons (`edit`, `delete`, `complete`, etc.) use inline `onclick="completeTask(${index})"` attributes — a separate handler call generated per icon, per task. A more delegated approach would be a single `click` listener on `showTask` (the container) that checks `e.target` to figure out which icon and which task index was clicked — avoiding inline `onclick` attributes entirely and handling any number of dynamically-created task boxes through one listener.

---

## Part 2: Good to Know (Browser Internals Not Directly Used Here)

These happen automatically in every browser, including when this project's pages load — but the code itself never directly interacts with them, so they're explained here for context rather than tied to specific lines.

**Tokenization** — Before a browser can understand HTML or CSS, it breaks the raw text into small meaningful chunks called tokens (e.g., `StartTag: div`, `Attribute: class="task-box"`, `Text: Hello`). This happens before any tree structure is built.

**Parsing** — Once tokenized, the browser arranges those tokens into an actual tree structure. Parsing is the umbrella process; tokenization is its first step.

**Render Tree** — After the DOM Tree and CSSOM Tree both exist, the browser combines them into a Render Tree: only the elements that will actually be visible, each carrying its final computed style. Elements with `display: none` are excluded from this tree entirely; `visibility: hidden` elements are included but not painted.

**Event Capturing** — The phase before bubbling: when an event fires, it actually travels *down* from `document` to the target element first (capturing), before bubbling back up. Most listeners ignore this phase by default; it has to be explicitly opted into with `{ capture: true }`.

---

## Quick Reference

| Concept | Status in this project |
|---|---|
| DOM Tree | ✅ Used directly — `querySelector`, `innerHTML` |
| CSSOM | ✅ Used directly — `task.css` + dynamic inline styles |
| Event Bubbling | ✅ Used directly — submit button → form |
| Event Delegation | ✅ Used directly — `e.submitter` on edit form |
| Tokenization | ℹ️ Browser-internal, not directly touched |
| Parsing | ℹ️ Browser-internal, not directly touched |
| Render Tree | ℹ️ Browser-internal, not directly touched |
| Event Capturing | ℹ️ Browser-internal, not directly touched |
