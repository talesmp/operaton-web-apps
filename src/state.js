/**
 * state.js
 *
 * Global app state using Preact signals.
 */

import { signal, useSignal } from '@preact/signals'
import { createContext } from 'preact'

/**
 * Create the global app state by invoking the function in the root [Tasks.jsx`]
 * (./src/Tasks.jsx) by using `<AppState.Provider value={createAppState()}>`.
 *
 * To add new entries to the state expand the list of definitions in a flat
 *
 *
 * @returns {Object} exposing all defined signals
 */
const createAppState = () => {
  const server = signal(get_stored_server())
  // TODO remove 'demo' when we have working authentication
  const auth = { user: { id: signal('demo') } }

  const deployments_page = {
    selected_resource: signal(null),
    selected_deployment: signal(null),
    selected_process_statistics: signal(null),
  }
  const history_mode = signal(false)

  const api = {
    authorization: {
      all: signal(null),
      update: signal(null),
      delete: signal(null)
    },
    engine: {
      telemetry: signal(null)
    },
    user: {
      count: signal(null),
      list: signal(null),
      create: signal(null),
      profile: signal(null),
      group: {
        list: signal(null)
      },
      credentials: signal(null),
      unlock: signal(null),
    },
    group: {
      list: signal(null),
      create: signal(null),
      add_user: signal(null)
    },
    tenant: {
      list: signal(null),
      by_member: signal(null),
      create: signal(null),
      add_user: signal(null)
    },
    process: {
      definition: {
        one: signal(null),
        list: signal(null),
        called: signal(null),
        diagram: signal(null),
      },
      instance: {
        called: signal(null),
        one: signal(null),
        list: signal(null),
        count: signal(null),
        variables: signal(null),
      }
    },
    task: {
      by_process_instance: signal(null)
    },
    deployment: {
      one: signal(null),
      all: signal(null),
      resource: signal(null),
      delete: signal(null)
    },
    history: {
      incident: {
        by_process_definition: signal(null),
        by_process_instance: signal(null)
      },
    },
    job_definition: {
      all: {
        by_process_definition: signal(null)
      }
    }
  }

  return {
    server,
    auth,
    api,
    deployments_page,
    history_mode,
  }
}

const AppState = createContext(undefined)

const get_stored_server = () => {
  if (localStorage.getItem('server')) {
    return JSON.parse(localStorage.getItem('server'))
  }

  const stored_server = JSON.parse(import.meta.env.VITE_BACKEND)[0]
  localStorage.setItem('server', JSON.stringify(stored_server))

  return stored_server
}

export { createAppState, AppState }