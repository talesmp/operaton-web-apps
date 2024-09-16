import {signal} from "@preact/signals";
import {createContext} from "preact";

const createAppState = () => {
    const process_definitions = signal(null);
    const process_definition = signal(null);
    const selected_process_definition_id = signal(null);
    const process_instances = signal(null);
    const process_instance = signal(null);
    const process_definition_diagram = signal(null);
    const selection_values = signal(null);

    return {
        process_definitions,
        process_definition,
        process_definition_diagram,
        selected_process_definition_id,
        process_instances,
        process_instance,
        selection_values
    };
};

const AppState = createContext(undefined);

export { createAppState, AppState }