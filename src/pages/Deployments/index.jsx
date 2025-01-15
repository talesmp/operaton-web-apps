import "./style.css";

import { useContext, useEffect, useState } from 'preact/hooks';
import { AppState } from '../../state.js';
import * as api from '../../api';

const Deployments = () => {
    const state = useContext(AppState);
    const [selectedDeployment, setSelectedDeployment] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('details'); // Track the active tab

    useEffect(() => {
        // Fetch all deployed process definitions
        void api.get_process_definitions(state);
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
                <DeploymentDetails 
                    selectedDeployment={selectedDeployment} 
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab} 
                />
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

const DeploymentDetails = ({ selectedDeployment, activeTab, setActiveTab }) => {
    if (!selectedDeployment) {
        return (
            <div class="details-panel deployments-details">
                Select a deployment to view details.
            </div>
        );
    }

    return (
        <div class="details-panel deployments-details">
            <div class="tab-navigation">
                <button 
                    class={`${activeTab === 'details' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('details')}
                >
                    Details
                </button>
                <button 
                    class={`${activeTab === 'incidents' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('incidents')}
                >
                    Incidents
                </button>
                <button 
                    class={`${activeTab === 'instances' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('instances')}
                >
                    Running Instances
                </button>
            </div>
            <div class="tab-content">
                {activeTab === 'details' && (
                    <div>
                        <h3>{selectedDeployment.definition.name || 'No Process Name defined'}</h3>
                        <p>{selectedDeployment.definition.id}</p>
                        <p>Suspended: {selectedDeployment.definition.suspended ? 'Yes' : 'No'}</p>
                    </div>
                )}
                {activeTab === 'incidents' && (
                    <div>
                        <h3>Incidents</h3>
                        <p>Number of incidents: {selectedDeployment.incidents.length}</p>
                    </div>
                )}
                {activeTab === 'instances' && (
                    <div>
                        <h3>Running Instances</h3>
                        <p>Number of instances: {selectedDeployment.instances}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export { Deployments };