import { AppState } from "../../state";
import { useContext } from "preact/hooks";

export const resetSelectedDetails = () => {
const state = useContext(AppState)

  state.selected_resource.value = null;
  state.selected_process_statistics.value = null;
  state.bpmn20Xml.value = null;
};