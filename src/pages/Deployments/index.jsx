import { ResourcesList } from "./ResourcesList.jsx";
import { ProcessDetails } from "./ProcessDetails.jsx";
import "./css/style.css";
import { DeploymentsList_V2 } from "./DeploymentsList_V2.jsx";

const Deployments = () => {
  return (
    <main class="fade-in deployments-container">
      <h2 class="screen-hidden">Deployments</h2>
          <DeploymentsList_V2 />
          <ResourcesList />
          <ProcessDetails />
    </main>
  );
};

export { Deployments };