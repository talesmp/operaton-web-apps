import { useContext, useState } from 'preact/hooks'
import { AppState } from '../../state.js'
import { get_deployment_resources } from '../../api.js'

export const DeploymentsList_V2 = () => {
  const state = useContext(AppState)

  return (
    <div class="deployments-list list-scrollable">
      <h3 class="screen-hidden">Queried deployments</h3>
      <ul class="tile-list">
        {state.deployments.value.map((deployment) => (
          <li
            key={deployment.id}
            class={`tile-item ${
              state.selected_deployment.value?.id === deployment.id ? 'selected' : ''
            }`}
            onClick={() => {
              resetSelectedDetails(state)
              state.selected_deployment.value = deployment
              get_deployment_resources(state, deployment.id)
            }}
          >
            <a>
              <div className="title">
                {deployment?.name
                  ? deployment?.name
                  : deployment?.id}</div>
              <span>{deployment?.deploymentTime}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export const resetSelectedDetails = (state) => {
  state.selected_deployment.value = null
  state.selected_resource.value = null
  state.selected_process_statistics.value = null
}