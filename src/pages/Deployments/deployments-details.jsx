const DeploymentDetails = ({ selectedDeployment }) => {
    if (!selectedDeployment) {
        return (
            <div class="deployments-details-panel deployments-details">
                <p class="deployments-details-empty">
                    Select a deployment to view details.
                </p>
            </div>
        );
    }

    return (
        <div class="details-panel deployments-details">
            <h1 class="title">{selectedDeployment.definition.name}</h1>
            {selectedDeployment.definition.suspended ? (
                <p>
                    <strong>Status: </strong>
                    <span class="status-suspended">Suspended</span>
                </p>
            ) : (
                <p>
                    <strong>Status: </strong>
                    <span class="status-active">Active</span>
                </p>
            )}
            <p> <strong>Process Definition Key: </strong>{selectedDeployment.definition.key}</p>
            <p><strong>Version: </strong>{selectedDeployment.definition.version}</p>
            <p><strong>Deployment ID: </strong>{selectedDeployment.definition.deploymentId}</p>
            {selectedDeployment.definition.startableInTasklist ? (
                <p><strong>Startable in Tasklist: </strong>True</p>
                ) : (
                <p><strong>Startable in Tasklist: </strong>False</p>
            )}
        </div>
    );
};

export default DeploymentDetails;