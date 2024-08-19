import { signal, effect } from "@preact/signals";

const base_url = "http://localhost:8888/engine-rest";

const get_process_definitions = () =>
  fetch(base_url + "/process-definition/statistics").then((response) =>
    response.json(),
  );

const get_process_definition = (id) =>
  fetch(base_url + "/process-definition/" + id).then((response) =>
    response.json(),
  );

const get_process_instance_list = (defintion_id) =>
  fetch(
    base_url +
      "/history/process-instance?" +
      new URLSearchParams({
        unfinished: true,
        sortBy: "startTime",
        sortOrder: "asc",
        processDefinitionId: defintion_id,
      }).toString(),
  ).then((response) => response.json());

// helper
//
const fetch_to_signal = async (target_signal, method) => {
  try {
    const result = await method();
    effect(() => (target_signal.value = { status: "success", data: result }));
  } catch (error) {
    target_signal.value = { status: "error", message: error };
  }
};

export {
  fetch_to_signal,
  get_process_definitions,
  get_process_definition,
  get_process_instance_list,
};
