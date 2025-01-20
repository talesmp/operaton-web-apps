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
    .then((response) => response.ok)
    .then(result => state.task_change_result.value = result)


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



// ######### DEPLOYMENTS PAGE #########

/**
 * fetch deployments and sort by deployment time
 * set the first entry as selected_deployment
 * fetch deployment resources for details
 */
export const get_deployment = (state) => { 
  fetch(`${_url(state)}/deployment?sortBy=deploymentTime&sortOrder=desc`)
    .then((res) => res.json())
    .then((data) => {
      state.deployments.value = data;
      
      if (data) {
        state.selected_deployment.value = data[0];
        get_deployment_resources(state, data[0].id); 
      }
    });
};

/**
 * fetch resources for a deployment
 * fetch the process definition
 * fetch the bpmn20Xml to display the diagram
 */
export const get_deployment_resources = (state, deploymentId) => {
  fetch(`${_url(state)}/deployment/${deploymentId}/resources`)
    .then((res) => res.json())
    .then((data) => {
      state.deployment_resources.value = data;

      if (data.length > 0) {
        const firstResource = data[0];
        state.selected_resource.value = firstResource;

        get_process_definition_by_deployment_id(state, deploymentId, firstResource.name);
        get_bpmn20xml(state, deploymentId, firstResource.id);
      }
    })
    .catch((error) => {
      console.error("Error fetching resources:", error);
    });
};

/**
 * fetch the bpmn xml data for a resource
 */
export const get_bpmn20xml = (state, deploymentId, resourceId) => {
  fetch(`${_url(state)}/deployment/${deploymentId}/resources/${resourceId}/data`)
    .then((res) => res.text())
    .then((xml) => {
      state.bpmn20Xml.value = xml;
    });
};

/**
 * delete a deployment and all related resources
 */
export const delete_deployment = (state, deployment_id, params = {}) => {
  const queryParams = new URLSearchParams(params).toString();

  fetch(`${_url(state)}/deployment/${deployment_id}?${queryParams}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        get_deployment(state);

        // reset the details view
        state.selected_deployment.value = null;
        state.deployment_resources.value = [];
        state.selected_resource.value = null;
        state.selected_process_statistics.value = null;
        state.bpmn20Xml.value = null;
      } else {
        response.json().then((json) => {
          console.error(`Failed to delete deployment ${deployment_id}:`, json.message);
        });
      }
    })
    .catch((error) => {
      console.error(`Error deleting deployment ${deployment_id}:`, error);
    });
};

/**
 * count all running process instances for a deployment and the related resources
 */
export const get_deployment_instance_count = (state, deployment_id) => {
  return fetch(`${_url(state)}/process-instance/count`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      deploymentId: deployment_id,
    }),
  })
};


/*
* fetch process definition details and statistics
*/
export const get_process_definition_statistics = (state, processDefinitionId) => {
  fetch(`${_url(state)}/process-definition/statistics`)
    .then((res) => res.json())
    .then((data) => {
      const filteredData = data.filter(
        (item) => item.definition.id === processDefinitionId
      );

      state.selected_process_statistics.value =
        filteredData.length > 0 ? filteredData[0] : null;
    })
    .catch((error) => {
      console.error("Error fetching process definition statistics:", error);
      state.selected_process_statistics.value = null; 
    });
};

/**
 * fetch a preocess definition by deploymentId and resource name
 */
export const get_process_definition_by_deployment_id = (state, deploymentId, resourceName) => {
  fetch(
    `${_url(state)}/process-definition?deploymentId=${deploymentId}&resourceName=${encodeURIComponent(
      resourceName
    )}&maxResults=50&firstResult=0`
  )
    .then((res) => res.json())
    .then((data) => {
      get_process_definition_statistics(state, data[0].id)
    });
};