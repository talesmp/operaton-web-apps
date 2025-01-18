import { DeploymentsList } from "./DeploymentsList.jsx";
import { ResourcesList } from "./ResourcesList.jsx";
import { ProcessDetails } from "./ProcessDetails.jsx";
import { fetchDeployments } from "./api/api.js";
import "./assets/styles.css";

const Deployments = () => {
  // Lade die Deployments beim ersten Render
  fetchDeployments();

  return (
    <div class="fade-in deployments-container">
      <DeploymentsList />
      <ResourcesList />
      <ProcessDetails />
    </div>
  );

}

export  { Deployments };