/**
 * api.js
 *
 * Provides endpoints to the default Operaton REST API.
 *
 * Please refer to the `docs/Coding Conventions.md` "JavaScript > api.js" to
 * learn how we organize the code in this file.
 */
const _url = (state) => `${state.server.value.url}/engine-rest`

let headers = new Headers()
headers.set('Authorization', `Basic ${window.btoa(unescape(encodeURIComponent('demo:demo')))}`) //TODO authentication
let headers_json = headers
headers_json.set('Content-Type', 'application/json')

/* helpers */

const _STATE = {
  NOT_INITIALIZED: 'NOT_INITIALIZED',
  LOADING: 'LOADING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR'
}

/**
 * Displays the result (SUCCESS, ERROR) of an api request and all other states (LOADING, NOT_INITIALIZED, NULL)
 *
 * @param signl {Preact.Signal} the state signal where the result is stored
 * @param on_success {function: JSXInternal.Element} the element that is shown when the result state is SUCCESS
 * @param on_error {function: JSXInternal.Element} (optional) the element that is shown when the result state is ERROR
 * @param on_nothing (optional) the element that is shown when the state is null
 * @returns {JSXInternal.Element}
 */
export const RequestState = ({ signl, on_success, on_error = null, on_nothing = null }) =>
  <>
    {(signl.value !== null)
      ? {
        NOT_INITIALIZED: <p>No data requested</p>,
        LOADING: <p class="fade-in-delayed">Loading...</p>,
        SUCCESS: signl.value?.data ? on_success() : <p>No data</p>,
        ERROR: on_error ? on_error : <p class="error"><strong>Error:</strong> {signl.value.error !== undefined ? signl.value.error.message : 'No error message.'}</p>
      }[signl.value.status]
      : on_nothing
        ? on_nothing()
        : <p class="fade-in-delayed">Fetching...</p>
    }
  </>

const response_data = (response) =>
  response.ok
    ? (response.status === 204)
      ? Promise.resolve('No Content')
      : response.json()
    : Promise.reject(response)

export const GET = (url, state, signl) => {
  signl.value = { status: _STATE.LOADING }

  return fetch(`${_url(state)}${url}`)
    .then(response => response.ok ? response.json() : Promise.reject(response))
    .then(json => signl.value = { status: _STATE.SUCCESS, data: json })
    .catch(error => signl.value = { status: _STATE.ERROR, error })
}

export const GET_TEXT = (url, state, signl) => {
  signl.value = { status: _STATE.LOADING }

  return fetch(`${_url(state)}${url}`)
    .then(response => response.ok ? response.text() : Promise.reject(response))
    .then(text => signl.value = { status: _STATE.SUCCESS, data: text })
    .catch(error => signl.value = { status: _STATE.ERROR, error })
}

const fetch_with_body = (method, url, body, state, signl) => {
  signl.value = { status: _STATE.LOADING }

  return fetch(`${_url(state)}${url}`,
    {
      headers: headers_json,
      method,
      body: JSON.stringify(body)
    })
    .then(response_data)
    .then(json => signl.value = { status: _STATE.SUCCESS, data: json })
    .catch(error => error.json().then(json => signl.value = { status: _STATE.ERROR, data: json }))
}

export const POST = (url, body, state, signl) =>
  fetch_with_body('POST', url, body, state, signl)

export const PUT = (url, body, state, signl) =>
  fetch_with_body('PUT', url, body, state, signl)

export const DELETE = (url, body, state, signl) =>
  fetch_with_body('DELETE', url, body, state, signl)
