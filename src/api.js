/**
 * api.js
 *
 * Provides endpoints to the default Operaton REST API.
 *
 * Please refer to the `docs/Coding Conventions.md` "JavaScript > api.js" to
 * learn how we organize the code in this file.
 */

const _url = (state) => `${state.server.value}/engine-rest`

let headers = new Headers()
headers.set('Authorization', 'Basic ' + window.btoa(unescape(encodeURIComponent('demo:demo')))) //TODO authentication
let headers_json = headers
headers_json.set('Content-Type', 'application/json')

export const get_user_profile = (state, user_name) => {
  // TODO remove it when we have a login!
  if (!user_name) {
    user_name = 'demo'
  }

  fetch(`${_url(state)}/user/${user_name}/profile`, { headers })
    .then(response => response.json())
    .then(json => state.user_profile.value = json)
}

export const get_users = (state) =>
  fetch(`${_url(state)}/user`)
    .then(response => response.json())
    .then(json => state.users.value = json)

export const create_user = (state) =>
  fetch(`${_url(state)}/user/create`,
    {
      headers: headers_json,
      method: 'POST',
      body: JSON.stringify(state.user_create.value)
    })
    .then(response => response.ok ? response.ok : Promise.reject(response))
    .then(result => state.user_create_response.value = {success: true, ...result})
    .catch(response => response.json())
    .then(json => state.user_create_response.value = { success: false, ...json })


export const get_user_count = (state) =>
  fetch(`${_url(state)}/user`)
    .then(response => response.json())
    .then(json => state.user_count.value = json)


export const get_process_definitions = (state) =>
  fetch(`${_url(state)}/process-definition/statistics`)
    .then(response => response.json())
    .then(json => state.process_definitions.value = json)

export const get_process_definition = (state, id) =>
  fetch(`${_url(state)}/process-definition/${id}`)
    .then(response => response.json())
    .then(json => state.process_definition.value = json)

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

export const get_process_incidents = (state, definition_id) =>
  fetch(`${_url(state)}/history/incident?processDefinitionId=${definition_id}`)
    .then(response => response.json())
    .then(json => (state.process_incidents.value = json))

export const get_process_instance = (state, instance_id) =>
  fetch(`${_url(state)}/process-instance/${instance_id}`)
    .then(response => response.json())
    .then(json => state.process_instance.value = json)

export const get_process_instance_variables = (state, instance_id) =>
  fetch(`${_url(state)}/process-instance/${instance_id}/variables`)
    .then(response => response.json())
    .then(json => state.selection_values.value = json)

export const get_process_instance_incidents = (state, instance_id) =>
  fetch(`${_url(state)}/history/incident?processInstanceId=${instance_id}`)
    .then(response => response.json())
    .then(json => (state.process_instance_incidents.value = json))

export const get_process_instance_tasks = (state, instance_id) =>
  fetch(`${_url(state)}/task?processInstanceId=${instance_id}`)
    .then(response => response.json())
    .then(json => (state.process_instance_tasks.value = json))

export const get_called_process_instances = (state, instance_id) =>
  fetch(`${_url(state)}/process-instance?superProcessInstance=${instance_id}`)
    .then(response => response.json())
    .then(json => (state.called_process_instances.value = json))

export const get_called_process_definitions = (state, definition_id) =>
  fetch(`${_url(state)}/process-definition/${definition_id}/static-called-process-definitions`)
    .then(response => response.json())
    .then(json => state.called_definitions.value = json)

export const get_job_definitions = (state, definition_id) =>
  fetch(`${_url(state)}/job-definition?processDefinitionId=${definition_id}`)
    .then(response => response.json())
    .then(json => state.job_definitions.value = json)

export const get_diagram = (state, definition_id) =>
  fetch(`${_url(state)}/process-definition/${definition_id}/xml`)
    .then(response => response.json())
    .then(json => state.process_definition_diagram.value = json)

// getting all tasks, when no sorting is provided it will use "name" and ascending
export const get_tasks = (state, sort_key, sort_order) => {
  const sort = sort_key ? sort_key : 'name'
  const order = sort_order ? sort_order : 'asc'

  fetch(`${_url(state)}/task?sortBy=${sort}&sortOrder=${order}`, { headers: headers })
    .then((response) => response.json())
    .then(json => {
      const ids = json.map(task => task.processDefinitionId) // list of needed process definitions

      // we need the process definition name for each task
      get_task_process_definitions(state, ids)
        .then( defList => {
          const defMap = new Map() // helper map, mapping ID to process name
          defList.map(def => defMap.set(def.id, def))

          // set process name to task list
          json.forEach((task) => {
            const def = defMap.get(task.processDefinitionId)
            task.def_name = def ? def.name : ''
            task.def_version = def ? def.version : ''
          })

          state.tasks.value = json
        })
    })
}

// API call to enhance the data of the task list, no need for signal here
const get_task_process_definitions = (state, ids) =>
  fetch(`${_url(state)}/process-definition?processDefinitionIdIn=${ids}`, { headers: headers })
    .then((response) => response.json())

export const get_task = (state, task_id) =>
   fetch(`${_url(state)}/task/${task_id}`, { headers: headers })
     .then((response) => response.json())
     .then(json => state.task.value = json)

export const get_task_rendered_form = (state, task_id) =>
   fetch(`${_url(state)}/task/${task_id}/rendered-form`, { headers: headers })
     .then((response) => response.text())
     .then(text => state.task_generated_form.value = text)

export const get_task_deployed_form = (state, task_id) =>
  fetch(`${_url(state)}/task/${task_id}/deployed-form`, { headers: headers })
    .then((response) => response.json())
    .then(json => state.task_deployed_form.value = json)

// claim and unclaim tasks
export const post_task_claim = (state, do_claim, task_id) =>
  fetch(`${_url(state)}/task/${task_id}/${do_claim ? 'claim' : 'unclaim'}`,
    {
      headers: headers_json,
      method: 'POST',
      body: JSON.stringify({ userId: state.user_profile.value.id })
    })
    .then((response) => response.ok)
    .then(result => state.task_change_result.value = result)


export const post_task_assign = (state, assignee, task_id) =>
  fetch(`${_url(state)}/task/${task_id}/assignee`,
    {
      headers: headers_json ,
      method: 'POST',
      body: JSON.stringify({ userId: assignee })
    })
    .then((response) => response.ok)
    .then(result => state.task_change_result.value = result)


/* return null or error message from server, in fact all validation should be done by HTML5 validation, but who knows ... */
export const post_task_form = (state, task_id, data) => {
  fetch(`${_url(state)}/task/${task_id}/submit-form`,
    {
      headers: headers_json ,
      method: 'POST',
      body: JSON.stringify({ variables: data, withVariablesInReturn: true })
    })
    .then((response) => response.json())
    .then(json => {
      // if there is a json type, we get an error message back
      if (!json.type) {
        state.tasks.value = null
        // it's important that the form data is cleared before the task data, because the signal effect will be called immediately
        state.task_generated_form.value = null
        state.selected_task.value = null // the task is completed, so let it go
      } else {
        return json.message
      }
    })

  return null
}



// ######### DEPLOYMENTS API #########

/**
 * Fetches deployments sorted by deployment time, sets the first as selected
 * @sideeffects Updates `state.deployments`, triggers `get_deployment_resources`
 */
export const get_deployment = (state) => { 
  return fetch(`${_url(state)}/deployment?sortBy=deploymentTime&sortOrder=desc`)
    .then((res) => res.json())
    .then((data) => {
      state.deployments.value = data;      
      if (data?.length > 0) {
        state.selected_deployment.value = data[0];
        get_deployment_resources(state, data[0].id); 
      }
    })
    .catch((error) => console.error("Error fetching deployments:", error));
};

/**
 * Fetches resources for a deployment and triggers BPMN diagram fetch
 * @sideeffects Updates `state.deployment_resources`, `state.selected_resource`
 */
export const get_deployment_resources = (state, deployment_id) => {
  return fetch(`${_url(state)}/deployment/${deployment_id}/resources`)
    .then((res) => res.json())
    .then((data) => {
      state.deployment_resources.value = data;
      if (data?.length > 0) {
        state.selected_resource.value = data[0];
        get_process_definition_by_deployment_id(state, deployment_id, data[0].name);
      }
    })
    .catch((error) => console.error("Error fetching resources:", error));
};

/**
 * Fetches BPMN 2.0 XML for a process definition
 * @param {Object} state - Application state
 * @param {string} process_definition_id - Process definition ID
 * @sideeffects Updates state.bpmn_xml
 */
export const get_process_definition_xml = (state, process_definition_id) => {
  return fetch(`${_url(state)}/process-definition/${process_definition_id}/xml`)
    .then((response) => response.json())
    .then((json) => (state.bpmn_xml.value = json.bpmn20Xml))
    .catch((error) => console.error("Error fetching BPMN XML:", error));
};

/**
 * Deletes a deployment and cleans up related state
 * @param {Object} state - Application state
 * @param {string} deployment_id - Deployment ID to delete
 * @param {Object} params - Optional query parameters
 * @sideeffects Resets deployment-related state values
 */
export const delete_deployment = (state, deployment_id, params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  
  return fetch(`${_url(state)}/deployment/${deployment_id}?${queryParams}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        get_deployment(state);
        state.selected_deployment.value = null;
        state.deployment_resources.value = [];
        state.selected_resource.value = null;
        state.selected_process_statistics.value = null;
      } else {
        response.json().then((json) => {
          console.error(`Deletion failed: ${json.message}`);
        });
      }
    })
    .catch((error) => console.error("Error deleting deployment:", error));
};

/**
 * Counts running process instances for a deployment
 * @param {Object} state - Application state
 * @param {string} deployment_id - Deployment ID
 * @returns {Promise<number|null>} Instance count or null on error
 */
export const get_deployment_instance_count = (state, deployment_id) => {
  return fetch(`${_url(state)}/process-instance/count`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ deploymentId: deployment_id }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Count fetch failed");
      return res.json();
    })
    .catch((error) => {
      console.error("Error fetching instance count:", error);
      return null;
    });
};


/**
 * Fetches statistics and all details for a process definition
 * @param {Object} state - Application state
 * @param {string} process_definition_id - Process definition ID
 * @sideeffects Updates state.selected_process_statistics
 */
export const get_process_definition_statistics = (state, process_definition_id) => {
  return fetch(`${_url(state)}/process-definition/statistics`)
    .then((res) => res.json())
    .then((data) => {
      const filteredData = data.filter(
        (item) => item.definition.id === process_definition_id
      );
      state.selected_process_statistics.value = filteredData[0] || null;
    })
    .catch((error) => {
      console.error("Error fetching statistics:", error);
      state.selected_process_statistics.value = null;
    });
};

/**
 * Fetches process definition by deployment ID and resource name
 * @param {Object} state - Application state
 * @param {string} deployment_id - Deployment ID
 * @param {string} resource_name - Resource name
 * @sideeffects Triggers statistics fetch
 */
export const get_process_definition_by_deployment_id = (
  state,
  deployment_id,
  resource_name
) => {
  return fetch(
    `${_url(state)}/process-definition?deploymentId=${deployment_id}&resourceName=${encodeURIComponent(
      resource_name
    )}`
  )
    .then((res) => res.json())
    .then((data) => {
      if (data?.length > 0) {
        get_process_definition_statistics(state, data[0].id);
      }
    })
    .catch((error) => console.error("Error fetching process definition:", error));
};