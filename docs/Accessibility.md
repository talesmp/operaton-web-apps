# Accessibility

A collection of references and issues concerning the Operaton front-end
applications.

## Knowledge Sources

Official site for web standards: https://www.w3.org/WAI/ARIA/apg/
Mozilla MDN: https://developer.mozilla.org/en-US/docs/Web/Accessibility

Getting started & basics:

- https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/
- https://www.w3.org/WAI/ARIA/apg/practices/names-and-descriptions/

### Keyboard Navigation:

- https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/
- https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/React_accessibility

## Issues

### Split Layout

The split layout pattern can be used when presenting the user with the processes
or tasks page.
An issue is the correct implementation, which isn't properly defined (see GitHub
issues for more information).

https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/
https://github.com/w3c/aria-practices/issues/130
https://github.com/w3c/aria-practices/issues/129

An alternative would be a layout, which is controlled by buttons presenting only
a select amount of states (hidden, min, max). This leads to less user
adjustment, but can circumvent the accessibility and some UX issues. 