# Coding Conventions

## Formatting

For consistency across all JavaScript files we use [**standard**](https://github.com/standard/standard?tab=readme-ov-file):

IntelliJ: 

- Go to `Preferences | Editor | Code style | JavaScript`
- Click `Set from...`
- Select `JavaScript Standard Style`

## JavaScript General

- Use `const foo = () => {}` instead of `function foo() {}` for everything

## Preact Specifics

- Use [Signals](https://preactjs.com/guide/v10/signals/) instead of hooks

## CSS

- Split code in multiple files
- Prefer classless styling to classes
- Prefer cascading styles with few additional classes instead of many single classes