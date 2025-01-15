import { useContext } from 'preact/hooks';
import { AppState } from '../../state.js';
import DeploymentTile from './deployments-tile';

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
                        onClick={() => setSelectedDeployment(deployment)}
                    >
                        <DeploymentTile deployment={deployment} />
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default DeploymentList;