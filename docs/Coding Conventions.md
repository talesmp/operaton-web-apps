# Coding Conventions

## Formatting

For consistency across all JavaScript files we use [**standard**](https://github.com/standard/standard?tab=readme-ov-file).

IntelliJ: 

- Go to `Preferences | Editor | Code style | JavaScript`
- Click `Set from...`
- Select `JavaScript Standard Style`

## JavaScript

### General

- Use `const foo = () => ..` instead of `function foo() {}` for everything
  - Prefer directly returning your result, over `const foo = () => { ... return ... }`
- Use `_` (underscores) instead of camel case for functions
- Use CamelCase for JSX components

### api.js

Each endpoint has an identical structure: 

```js
// api.js

export const get_process_definitions = (state) =>
    fetch(`${_url(state)}/process-definition/statistics`)
        .then(response => response.json())
        .then(json => state.process_definitions.value = json)
```

```js
// state.js


const createAppState = () => {
  const server = signal(localStorage.getItem("server") || JSON.parse(import.meta.env.VITE_BACKEND)[0])
  const process_definitions = signal(null)
  // ...
  // add your new state signal here
  
  return {
    server,
    process_definitions,
    // ...
    // make your new state signal available
  }
}
```

- The JS name of the endpoint is always `{method}_{endpoint_name}`
- Prepend the URL string by using the `${_url(state)}` pattern. We need to fetch the selected server URL from the environment variabel (config)
- Always assign the result to a state value
- Use the `export` keyword with the definition of your function, instead of exporting a map at the end. This is to prevent merge conflicts.

```js
const url_params = (definition_id) =>
  new URLSearchParams({
    unfinished: true,
    sortBy: 'startTime',
    sortOrder: 'asc',
    processDefinitionId: definition_id,
  }).toString()

export const get_process_instances = (state, definition_id) =>
  fetch(`${_url(state)}/history/process-instance?${url_params(definition_id)}`)
    .then(response => response.json())
    .then(json => (state.process_instances.value = json))
```

- In case you need params in your URL, use the `URLSearchParams` and keep it private (no `export`)
- Place your params object before the corresponding endpoint function

## Preact Specifics

- Use [Signals](https://preactjs.com/guide/v10/signals/) instead of hooks

## CSS

- Split code in multiple files
- Prefer classless styling to classes
- Prefer cascading styles with few additional classes instead of many single classes