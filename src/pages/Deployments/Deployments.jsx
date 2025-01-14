import { useContext, useEffect, useState } from 'preact/hooks';
import { AppState } from '../../state.js';
import * as api from '../../api';

const Deployments = () => {
    const state = useContext(AppState);
    const [selectedDeployment, setSelectedDeployment] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Fetch all deployed process definitions
        void api.get_process_definitions(state)
    }, []);

    return (
        <div id="deployments" class="fade-in">
            <main class="fade-in deployments-container">
                <DeploymentList
                    setSelectedDeployment={setSelectedDeployment}
                    selectedDeployment={selectedDeployment}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                />
                <DeploymentDetails selectedDeployment={selectedDeployment} />
            </main>
        </div>
    );
};

const DeploymentList = ({ setSelectedDeployment, selectedDeployment, searchTerm, setSearchTerm }) => {
    const { process_definitions } = useContext(AppState);

    if (!process_definitions || !process_definitions.value || process_definitions.value.length === 0) {
        return <p>No deployments found.</p>;
    }

    const filteredDeployments = process_definitions.value.filter((deployment) =>
        (deployment.definition.name || 'N/A').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <nav id="deployments-list" aria-label="deployments" class="list-scrollable">
            <div class="filter-header">
                <input
                    type="text"
                    placeholder="Search Deployments..."
                    value={searchTerm}
                    onInput={(e) => setSearchTerm(e.target.value)}
                    class="search-input"
                />
            </div>
            <ul class="tile-list">
                {filteredDeployments.map((deployment) => (
                    <li
                        key={deployment.id}
                        class={`${selectedDeployment?.id === deployment.id ? 'selected' : ''}`}
                        onClick={() => {
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
        <div>
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
        </div>
    );
};

const DeploymentDetails = ({ selectedDeployment }) => {
    if (!selectedDeployment) {
        return (
            <div class="details-panel deployments-details">
                Select a deployment to view details.
            </div>
        );
    }

    return (
        <div class="details-panel deployments-details">
            <h3>{selectedDeployment.definition.name || 'No Process Name defined'}</h3>
            <p>{selectedDeployment.definition.id}</p>
        </div>
    );
};

export { Deployments };