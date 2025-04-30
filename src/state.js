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
  const user_create = signal({ profile: {}, credentials: {} })
  const user_create_response = signal()
  const user_profile = signal(null) // should be set after login
  const user_profile_edit = signal(null)
  const user_profile_edit_response = signal()
  const user_credentials = signal({})
  const user_credentials_response = signal(null)
  const user_unlock_response = signal(null)
  const user_delete_response = signal(null)
  const user_groups = signal(null) // should be set after login
  const groups = signal(null)
  const add_group_response = signal({})
  const remove_group_response = signal({})
  const user_tenants = signal(null)
  const tenants = signal(null)
  const add_tenant_response = signal({})
  const remove_tenant_response = signal({})
  const user_logout_response = signal({})
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

//--------------------------------//
//------StartProcessList----------//
//--------------------------------//
  const show_processes = signal(false); 
  const process_list = signal([]);
  const search_term = signal('');
  const showConfirmation = signal(false);  
  const processToStart = signal(null);
  const formFields = [];
  const start_processID = signal(null)
  const display_start_formular = signal(false)
//--------------------------------//
//--------------------------------//

  //const process_start_error_message = signal("");

  // admin
  // const admin_users = signal(null)
  const api = {
    engine: {
      telemetry: signal(null)
    },
    user: {
      count: user_count,
      list: users,
      create: {
        request: user_create,
        response: user_create_response,
      },
      profile: user_profile,
      group: {
        list: signal(null)
      }
    },
    group: {
      list: signal(null)
    },
    process: {
      definition: {
        single: signal(null),
        list: signal(null),
        called: called_definitions,
        diagram: process_definition_diagram

      },
      instance: {
        called: called_process_instances,
        single: process_instance,
        list: process_instances
      }
    },
    task: {}
  }

  return {
    server,
    api,

    called_definitions,
    called_process_instances,
    job_definitions,
    // process_definition,
    process_definition_diagram,
    // process_definitions,
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
    user_profile_edit,
    user_profile_edit_response,
    user_credentials,
    user_credentials_response,
    user_unlock_response,
    user_delete_response,
    user_groups,
    groups,
    add_group_response,
    remove_group_response,
    user_tenants,
    tenants,
    add_tenant_response,
    remove_tenant_response,
    users,
    user_logout_response,
    deployments,
    selected_deployment,
    deployment_resources,
    selected_resource,
    selected_process_statistics,
    bpmn_xml,


//--------------------------------//
//------StartProcessList----------//
//--------------------------------//
    show_processes,
    process_list,
    search_term,
    showConfirmation,
    processToStart,
    display_start_formular,
    formFields,
    start_processID
//--------------------------------//
//--------------------------------//
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