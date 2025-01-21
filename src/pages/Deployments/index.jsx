import { AppState } from "../../state.js";
import { DeploymentsList } from "./DeploymentsList.jsx";
import { ResourcesList } from "./ResourcesList.jsx";
import { ProcessDetails } from "./ProcessDetails.jsx";
import { get_deployment } from "../../api.js";
import "./css/style.css";
import { useContext } from "preact/hooks";

const Deployments = () => {
  const state = useContext(AppState);

  if (!state.deployments.value.length && !state.deployments_loaded.value) {
    state.deployments_loaded.value = true; 
    get_deployment(state);
  }

  return (
    <main class="fade-in deployments-container">
      <h2 class="screen-hidden">Deployments</h2>
      {state.deployments.value.length > 0 ? (
        <>
          <DeploymentsList />
          <ResourcesList />
          <ProcessDetails />
        </>
      ) : (
        <span class="info-box">No deployments found</span>
      )}
    </main>
  );
};

export { Deployments };