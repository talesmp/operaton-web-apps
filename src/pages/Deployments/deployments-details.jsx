const DeploymentDetails = ({ selectedDeployment, activeTab, setActiveTab }) => {
    if (!selectedDeployment) {
        return (
            <div class="details-panel deployments-details">
                <p class="deployments-details-empty">
                    Select a deployment to view details.
                </p>
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

export default DeploymentDetails;