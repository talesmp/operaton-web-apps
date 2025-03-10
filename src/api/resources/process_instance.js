import { GET, POST } from '../helper.jsx'

const get_process_instance = (state, instance_id) =>
  GET(`/process-instance/${instance_id}`, state, state.api.process.instance.one)

const get_process_instance_variables = (state, instance_id) =>
  GET(`/process-instance/${instance_id}/variables`, state, state.api.process.instance.variables)

const get_called_process_instances = (state, instance_id) =>
  GET(`/process-instance?superProcessInstance=${instance_id}`, state, state.api.process.instance.called)

/**
 * Counts running process instances for a deployment
 * @param {Object} state - Application state
 * @param {string} deployment_id - Deployment ID
 * @returns {Promise<number|null>} Instance count or null on error
 */
const get_process_instance_count = (state, deployment_id) =>
  POST("/process-instance/count", { deploymentId: deployment_id }, state, state.api.process.instance.count)

const process_instance = {
  one: get_process_instance,
  variables: get_process_instance_variables,
  called: get_called_process_instances,
  count: get_process_instance_count
}

export default process_instance