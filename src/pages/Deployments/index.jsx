import { AppState } from "../../state.js";
import { DeploymentsList } from "./DeploymentsList.jsx";
import { ResourcesList } from "./ResourcesList.jsx";
import { ProcessDetails } from "./ProcessDetails.jsx";
import { get_deployment } from "../../api.js";
import "./assets/styles.css";
import { useContext } from "preact/hooks";

const Deployments = () => {
  const state = useContext(AppState);

  // Initialisiere Deployments, falls noch keine geladen wurden
  if (!state.deployments.value.length) {
    get_deployment(state);
  }

  return (
    <div class="fade-in deployments-container">
      {state.deployments.value.length > 0 ? (
        <>
          <DeploymentsList />
          <ResourcesList />
          <ProcessDetails />
        </>
      ) : (
        <p>Loading deployments...</p>
      )}
    </div>
  );
};

export { Deployments };