# Environment Variables

We use Vite as a build tool: https://vite.dev/guide/env-and-mode  

## Overview on our Env Vars

### VITE_BACKEND

A list of possible backends a user can switch between when using the
application.
The data is a JSON list with objects consisting of a `name` and `url` string.
The URL string has the following structure:  
`{http|https}` + `://` + `{your.domain}` + `{port|_}`

Examples are:

- `http://localhost:8080`
- `https://operaton.example.com`

```properties
# .env.development.local
VITE_BACKEND=[{"name": "Development", "url": "http://localhost:8080"}, {"name": "Production", "url": "http://localhost:8888"}]
```
