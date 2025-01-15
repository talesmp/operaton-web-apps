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

export default DeploymentTile;