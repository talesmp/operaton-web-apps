import { useContext, useEffect, useState } from 'preact/hooks';
import { AppState } from '../../state.js';
import * as api from '../../api';
import * as Icons from '../../assets/icons.jsx';

const Deployments = () => {
    const state = useContext(AppState);
    const [selectedDeployment, setSelectedDeployment] = useState(null);

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
        <div id="deployments" class="fade-in">
            <main class="fade-in deployments-container">
                <DeploymentList 
                    setSelectedDeployment={setSelectedDeployment} 
                    selectedDeployment={selectedDeployment} 
                />
                <DeploymentDetails selectedDeployment={selectedDeployment} />
            </main>
        </div>
    );
};

const DeploymentList = ({ setSelectedDeployment, selectedDeployment }) => {
    const { process_definitions } = useContext(AppState);

    if (!process_definitions || !process_definitions.value || process_definitions.value.length === 0) {
        return <p className="p-2">No deployments found.</p>;
    }

    return (
        <nav id="deployments-list" aria-label="deployments" class="deployments-item">
            <ul class="tile-list">
                {process_definitions.value.map((deployment) => (
                    <li
                        key={deployment.id}
                        className={`${selectedDeployment === deployment.id ? 'selected' : ''}`}
                        onClick={() => {
                            console.log(`Selected deployment: ${deployment.id}`);
                            setSelectedDeployment(deployment);
                        }}
                    >
                        <DeploymentTile deployment={deployment} />
                    </li>
                ))}
            </ul>
        </nav>
    );
};

const DeploymentTile = ({ deployment }) => {
    return (
        <a href="">
            <header>
                {deployment.definition.name ? (
                    <span class="title">{deployment.definition.name}</span>
                ) : (
                    <span class="title">N/A</span>
                )}
            </header>
            <div>
                {deployment.definition.suspended ? (
                    <p>Suspended</p>
                ) : (
                    <p>Active</p>
                )}
                <p>Running Instances: {deployment.instances}</p>
                <p>Incidents: {deployment.incidents.length}</p>
            </div>
            <footer>
                <p>Deployment ID: {deployment.id}</p>
            </footer>
        </a>
    );
};

const DeploymentDetails = ({ selectedDeployment }) => {
    if (!selectedDeployment) {
        return (
            <div class="details-panel deployments-item">
                Select a deployment to view details.
            </div>
        );
    }

    return (
        <div class="details-panel deployments-item">
            <h3>Process Name</h3>
            <p>{selectedDeployment.definition.name || 'No Process Name defined'}</p>
            <p>{selectedDeployment.definition.id}</p>
        </div>
    );
};

export { Deployments };