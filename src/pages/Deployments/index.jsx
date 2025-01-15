import { useContext, useEffect, useState } from 'preact/hooks';
import { AppState } from '../../state.js';
import DeploymentList from './deployments-list';
import DeploymentDetails from './deployments-details';
import * as api from "../../api"

import "./style.css";

const Deployments = () => {
    const state = useContext(AppState);
    const [selectedDeployment, setSelectedDeployment] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    
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
                />
            </main>
        </div>
    );
};

export { Deployments };