const DeploymentTile = ({ deployment }) => {
    return (
        <div class="deployments-tile">
            <header>
                {deployment.definition.name ? (
                    <span class="title">{deployment.definition.name}</span>
                ) : (
                    <span class="title">N/A</span>
                )}
            </header>
            <div>
                {deployment.definition.suspended ? (
                    <p class="status-suspended">Suspended</p>
                ) : (
                    <p class="status-active">Active</p>
                )}
                <span>
                    <div class="mt-1"></div>
                    <p>Running Instances: {deployment.instances}</p>
                </span>
                <span>
                    <p>Incidents: {deployment.incidents.length}</p>
                </span>
                <p>Deployment Name: {deployment.name}</p>

            </div>
        </div>
    );
};

export default DeploymentTile;