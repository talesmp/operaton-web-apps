/**
 * state.js
 *
 * Global app state using Preact signals.
 */

import { signal } from '@preact/signals'
import { createContext } from 'preact'

/**
 * Create the global app state by invoking the function in the root [index.jsx`]
 * (./src/index.jsx) by using `<AppState.Provider value={createAppState()}>`.
 *
 * To add new entries to the state expand the list of definitions in a flat
 *
 *
 * @returns {Object} exposing all defined signals
 */
const createAppState = () => {
  const server = signal(localStorage.getItem("server") || JSON.parse(import.meta.env.VITE_BACKEND)[0].url)
  const process_definitions = signal(null)
  const process_definition = signal(null)
  const process_definition_diagram = signal(null)
  const selected_process_definition_id = signal(null)
  const process_instances = signal(null)
  const process_instance = signal(null)
  const process_instance_incidents = signal(null)
  const process_incidents = signal(null)
  const process_instance_tasks = signal(null)
  const called_process_instances = signal(null)
  const selection_values = signal(null)
  const called_definitions = signal(null)
  const job_definitions = signal(null)
  const user_profile = signal(null) // should be set after login
  const tasks = signal(null)
  const selected_task = signal(null)
  const task = signal(null)
  const task_assign_result = signal(null) // used for claim, un-claim, assign, reset assignee
  const task_generated_form = signal(null)

  return {
    server,
    process_definitions,
    process_definition,
    process_definition_diagram,
    selected_process_definition_id,
    process_instances,
    process_instance,
    process_instance_incidents,
    process_instance_tasks,
    called_process_instances,
    process_incidents,
    selection_values,
    called_definitions,
    job_definitions,
    user_profile,
    tasks,
    selected_task,
    task,
    task_assign_result,
    task_generated_form
  }
}

const AppState = createContext(undefined)

export { createAppState, AppState }