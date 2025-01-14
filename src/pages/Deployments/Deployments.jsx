import { useContext, useEffect } from 'preact/hooks';
import { AppState } from '../../state.js';
import * as api from '../../api';
import * as Icons from '../../assets/icons.jsx';

const Deployments = () => {
  const state = useContext(AppState);

  useEffect(() => {
    // Fetch all deployed process definitions
    void api.get_process_definitions(state)
      .then(() => {
        console.log('Deployments fetched successfully:', state.process_definitions.value);
      })
      .catch((error) => {
        console.error('Error fetching deployments:', error);
      });
  }, []);

  return (
    <div id="deployments" className="fade-in">
      <main className="p-2 bg-1">
        <DeploymentList />
      </main>
    </div>
  );
};

const DeploymentList = () => {
  const { process_definitions } = useContext(AppState);

  if (!process_definitions || !process_definitions.value || process_definitions.value.length === 0) {
    // TODO: refactor design
    return <p className="p-2">No deployments found.</p>;
  }

  return (
    <nav id="deployments-list" aria-label="deployments">
        <ul className="tile-list">
            {process_definitions.value.map((deployments) => (
        <li key={deployments.id}>
          <DeploymentTile deployment={deployments} />
        </li>
      ))}
    </ul>
    </nav>
  );
};

const DeploymentTile = ({ deployment }) => {
  return (
    <li className="tile">
      <header className="row space-between">
        <h3 class="title">{deployment.definition.name}</h3>
        {deployment.definition.suspended ? (
          <span className="icon text-danger">Suspended</span>
        ) : (
          <span className="icon text-success">Active</span>
        )}
      </header>
      <p>Running Instances: {deployment.instances}</p>
      <p>Incidents: {deployment.incidents.length}</p>
      <footer className="row space-between">
        <p>Deployment ID: {deployment.id}</p>
        <button
          className="secondary"
          onClick={() => console.log(`Viewing deployment: ${deployment.id}`)}
        >
          View Details
        </button>
      </footer>
    </li>
  );
};

export { Deployments };