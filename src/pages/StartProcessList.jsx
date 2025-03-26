import { useContext } from "preact/hooks";
import { AppState } from "../state.js";
import * as api from "../api.jsx";
import * as Icons from "../assets/icons.jsx";

const StartProcessList = () => {
  const state = useContext(AppState);
  const { show_processes } = state;
  const { search_term } = state;
  const { process_list } = state;
  //const { process_start_error_message } = state;
  let filtered_processes = [];

  const display_processes = async () => {
    show_processes.value = !show_processes.value;
    if (show_processes.value) {
      try {
        const processes = await api.get_process_definition_for_start_button(
          state
        );
        process_list.value = processes;
      } catch (error) {
        console.error("Error fetching processes:", error);
      }
    }
  };

  if (process_list.value) {
    if (Array.isArray(process_list.value.data)) {
      filtered_processes = process_list.value.data.filter((process) => {
        const process_name = process?.name || "";
        return process_name
          .toLowerCase()
          .includes(search_term.value.toLowerCase());
      });
    }
  }

  const start_process = (process_id, process_name) => {
    const confirmStart = window.confirm(`Are you sure you want to 
                                           start the ${process_name} process?`);
    if (!confirmStart) return;

    api
      .start_process_without_form_field(state, process_id)
      .then((result) => console.log(result))
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div>
      <button id="startButton" onClick={display_processes}>
        <Icons.play />
        {show_processes.value ? "Hide processes" : "Start process"}
      </button>

      {show_processes.value && (
        <>
          <div class="popup-overlay" id="process-popup-overlay">
            <div class="popup" id="process-popup">
              <div class="popup-header" id="process-popup-header">
                <h2 class="popup-title" id="process-popup-title">
                  Start process
                </h2>
                <button class="close-btn" id="process-popup-close-btn" onClick={() => (show_processes.value = false)}>
                  Close
                </button>
                <input
                  type="text"
                  class="search-input"
                  id="process-popup-search-input"
                  placeholder="Search by process name."
                  value={search_term.value}
                  onInput={(e) => (search_term.value = e.target.value)}
                />
              </div>

              <div class="popup-info" id="process-popup-info">
                Click on the process to start.
              </div>

              <ul class="process-list" id="process-popup-list">
                {filtered_processes.length > 0 ? (
                  filtered_processes.map((process, index) => (
                    <li key={index} class="process-item">
                      <button
                        class="process-button"
                        onClick={() => start_process(process.id, process.name)}
                      >
                        {process.name}
                      </button>
                    </li>
                  ))
                ) : (
                  <li class="process-item">No processes found</li>
                )}
              </ul>

              <div class="popup-footer" id="process-popup-footer"></div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export { StartProcessList };
