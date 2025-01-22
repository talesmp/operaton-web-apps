import { ResourcesList } from "./ResourcesList.jsx";
import { ProcessDetails } from "./ProcessDetails.jsx";
import "./css/style.css";
import { DeploymentsList } from "./DeploymentsList.jsx";

const Deployments = () => {
  return (
    <main class="fade-in deployments-container">
      <h2 class="screen-hidden">Deployments</h2>
          <DeploymentsList />
          <ResourcesList />
          <ProcessDetails />
    </main>
  );
};

export { Deployments };