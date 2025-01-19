import { AppState } from "../../state.js";
import { DeploymentsList } from "./DeploymentsList.jsx";
import { ResourcesList } from "./ResourcesList.jsx";
import { ProcessDetails } from "./ProcessDetails.jsx";
import { get_deployment } from "../../api.js";
import "./assets/styles.css";
import { useContext } from "preact/hooks";

const Deployments = () => {
  const state = useContext(AppState)

  void get_deployment(state)
  console.log(state)

  return (
    <div class="fade-in deployments-container">
      <DeploymentsList />
      <ResourcesList />
      <ProcessDetails />
    </div>
  );

}

export  { Deployments };