import { fetchResources } from "./api/api";
import { globalState } from "./globalState";

const DeploymentsList = () => {
  console.log(globalState.deployments.value)
  return (
    <div class="deployments-list list-scrollable">
      <h1 class="title">Deployments</h1>
      <ul class="tile-list">
  {globalState.deployments.value.map((deployment) => (
    <li
      key={deployment.id}
      class={`tile-item ${globalState.selectedDeployment.value?.id === deployment.id ? "selected" : ""}`}
      onClick={() => {
        resetSelectedDetails(); // Setze alle Details zurück
        globalState.selectedDeployment.value = deployment; // Setze das neue Deployment
        fetchResources(deployment.id); // Lade die Ressourcen des ausgewählten Deployments
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
      </div>
    </li>
  ))}
</ul>
    </div>
  );
};

const resetSelectedDetails = () => {
  globalState.selectedResource.value = null;
  globalState.selectedProcessStatistics.value = null;
  globalState.selectedProcessDetails.value = null;
  globalState.bpmnXml.value = null;
};

export { DeploymentsList };