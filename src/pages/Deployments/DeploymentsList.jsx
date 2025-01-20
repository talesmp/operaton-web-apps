import { useContext, useState } from "preact/hooks";
import { AppState } from "../../state.js";
import { get_deployment_resources } from "../../api.js";
import * as Icons from '../../assets/icons.jsx'

export const DeploymentsList = () => {
  const state = useContext(AppState);
  const [isAscending, setIsAscending] = useState(true);

  const sortDeploymentsByTime = () => {
    state.deployments.value.sort((a, b) => {
      const timeA = new Date(a.deploymentTime).getTime();
      const timeB = new Date(b.deploymentTime).getTime();
      return isAscending ? timeA - timeB : timeB - timeA;
    });
  };

  return (
    <div class="deployments-list list-scrollable">
      <h1 class="title">Deployments</h1>
      {/**
       * sort button
       * <button
        onClick={() => {
          setIsAscending(!isAscending);
          sortDeploymentsByTime();
        }}
        class="sort-button"
        title={`Sort by Time (${isAscending ? "Ascending" : "Descending"})`}
      >
        Sort by Time {isAscending ? <Icons.chevron_up /> : <Icons.chevron_down/>}
      </button>
       */}

      <ul class="tile-list">
        {state.deployments.value.map((deployment) => (
          <li
            key={deployment.id}
            class={`tile-item ${
              state.selected_deployment.value?.id === deployment.id ? "selected" : ""
            }`}
            onClick={() => {
              resetSelectedDetails(state);
              state.selected_deployment.value = deployment;
              get_deployment_resources(state, deployment.id);
            }}
          >
            <div class="padding-1">
              <header>
                {deployment?.name ? (
                  <span class="title">{deployment?.name}</span>
                ) : (
                  <span class="title">N/A</span>
                )}
              </header>
              <div>{deployment?.deploymentTime}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const resetSelectedDetails = (state) => {
  state.selected_deployment.value = null;
  state.selected_resource.value = null;
  state.selected_process_statistics.value = null;
  state.bpmn20Xml.value = null;
};