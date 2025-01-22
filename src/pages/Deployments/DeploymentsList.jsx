import { useEffect, useContext } from 'preact/hooks';
import { AppState } from '../../state.js';
import { get_deployment_resources, get_deployment } from '../../api.js';

export const DeploymentsList = () => {
  const state = useContext(AppState);

  useEffect(() => {
    if (!state.deployments.value) { 
      get_deployment(state)
        .then((response) => {
          if (response != null) {
            state.deployments.value = response;
          }
        });
    }
  }, [state.deployments.value]);

  return (
    <div>
      {state.deployments.value ? (
        <div class="deployments-list list-scrollable">
          <h3 class="screen-hidden">Queried deployments</h3>
          <ul class="tile-list">
            {state.deployments.value.map((deployment) => (
              <li
                key={deployment.id}
                class={`tile-item ${state.selected_deployment.value?.id === deployment.id ? 'selected' : ''}`}
                onClick={() => {
                  state.selected_deployment.value = deployment;
                  get_deployment_resources(state, deployment.id);
                }}
              >
                <a>
                  <div class="title">
                    {deployment?.name || deployment?.id}
                  </div>
                  <span>{new Date(deployment.deploymentTime).toLocaleDateString()}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading deployments...</p>
      )}
    </div>
  );
};