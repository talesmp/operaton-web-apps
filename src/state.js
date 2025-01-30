/**
 * state.js
 *
 * Global app state using Preact signals.
 */

import { signal } from '@preact/signals'
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
  const users = signal(null)
  const user_count = signal(null)
  const user_create = signal({ profile: {}, credentials: { } })
  const user_create_response = signal()
  const user_profile = signal(null) // should be set after login
  const user_groups = signal(null) // should be set after login
  const tasks = signal(null)
  const selected_task = signal(null)
  const task = signal(null)
  const task_claim_result = signal(null)
  const task_assign_result = signal(null)
  const task_generated_form = signal(null)
  const task_deployed_form = signal(null)
  const deployments = signal()
  const selected_deployment = signal(null)
  const deployment_resources = signal([])
  const selected_resource = signal(null)
  const selected_process_statistics = signal(null)
  const bpmn_xml = signal(null)
  // admin
  // const admin_users = signal(null)

  return {
    server,
    called_definitions,
    called_process_instances,
    job_definitions,
    process_definition,
    process_definition_diagram,
    process_definitions,
    process_incidents,
    process_instance,
    process_instance_incidents,
    process_instance_tasks,
    process_instances,
    selected_process_definition_id,
    selected_task,
    selection_values,
    task,
    task_claim_result,
    task_assign_result,
    tasks,
    task_generated_form,
    task_deployed_form,
    user_count,
    user_create,
    user_create_response,
    user_profile,
    user_groups,
    users,
    deployments,
    selected_deployment,
    deployment_resources,
    selected_resource,
    selected_process_statistics,
    bpmn_xml
  }
}

const AppState = createContext(undefined)

const get_stored_server = () => {
  if (localStorage.getItem("server")) {
    return JSON.parse(localStorage.getItem("server"))
  }

  const stored_server = JSON.parse(import.meta.env.VITE_BACKEND)[0]
  localStorage.setItem("server", JSON.stringify(stored_server))

  return stored_server
}

export { createAppState, AppState }