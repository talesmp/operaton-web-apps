import { useContext, useEffect } from 'preact/hooks';
import { AppState } from '../../state.js';
import * as api from '../../api';
import * as Icons from '../../assets/icons.jsx'

const Deployments = () => {
  const state = useContext(AppState);

  useEffect(() => {
    // fetch all deployed process definitions
    void api.get_process_definitions(state)
      .then(() => {
        console.log('Deployments fetched successfully:', state.process_definitions.value);
      })
      .catch((error) => {
        console.error('Error fetching deployments:', error);
      });
  }, []);

  return (
    <div id="deployments-page" className="p-2 fade-in">
      <main className="p-2 bg-1">
        <DeploymentList />
      </main>
    </div>
  );
};

const DeploymentList = () => {
  const { process_definitions } = useContext(AppState);

  if (!process_definitions || !process_definitions.value || process_definitions.value.length === 0) {
    return <p className="p-2">No deployments found.</p>;
  }

  return (
    <div className="grid-list">
      {process_definitions.value.map((deployment) => (
        <DeploymentTile key={deployment.id} deployment={deployment} />
      ))}
    </div>
  );
};

const DeploymentTile = ({ deployment }) => {
  return (
    <div className="tile bg-2 p-2 fade-in">
      <h3>{deployment.definition.name}</h3>
      <p>Running Instances: {deployment.instances}</p>
      <p>Incidents: {deployment.incidents.length}</p>
      <p>Suspended: {deployment.definition.suspended ? 'Yes' : 'No'}</p>
      <br />
      <p>Process Definition Key: {deployment.definition.key}</p>
      <p>Deployment ID: {deployment.id}</p>
      <div className="row space-between">
        <button
          className="secondary"
          onClick={() => console.log(`Viewing deployment: ${deployment.id}`)}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export { Deployments };