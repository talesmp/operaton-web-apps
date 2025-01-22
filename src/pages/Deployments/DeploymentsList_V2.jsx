import { useContext, useState } from 'preact/hooks'
import { AppState } from '../../state.js'
import { get_deployment_resources, get_deployment_v2 } from '../../api.js'
import { signal } from '@preact/signals'

const deployments = signal(null)

export const DeploymentsList_V2 = () => {
  const state = useContext(AppState)


  if(deployments.value == null){
    get_deployment_v2(state).then((response) => deployments.value = response).then(() => console.log(deployments))
  }


  return (
    <div>
       {deployments.value ? (
          <div class="deployments-list list-scrollable">
          <h3 class="screen-hidden">Queried deployments</h3>
          <ul class="tile-list">
            {deployments.value.map((deployment) => (
              <li
                key={deployment.id}
                class={`tile-item ${state.selected_deployment.value?.id === deployment.id ? 'selected' : ''
                  }`}
                onClick={() => {
                  //resetSelectedDetails(state)
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
        ) : (
          <p>Loading deployments...</p>
        )}
    </div>
  )
}

export const resetSelectedDetails = (state) => {
  state.selected_deployment.value = null
  state.selected_resource.value = null
  state.selected_process_statistics.value = null
}