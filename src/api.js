import { signal, effect } from "@preact/signals";

const base_url = "http://localhost:8888/camunda/api";

let formData = new FormData();
formData.append("username", "demo");
formData.append("password", "demo");

export const login = () =>
  fetch(base_url + "/admin/auth/user/default/login/cockpit", {
    method: "POST",
    mode: "no-cors",
    body: "username=demo&password=demo", //formData,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    // body: JSON.stringify({ username: "demo", password: "demo" }),
  });

const process_defintions_url =
  base_url +
  "/cockpit/plugin/base/default/process-definition/statistics?firstResult=0&maxResults=50&sortBy=name&sortOrder=asc";

const get_process_definitions = () =>
  fetch("http://localhost:8888/engine-rest/process-definition/statistics").then(
    (response) => response.json(),
  );

const get_process_definition = (id) =>
  fetch("http://localhost:8888/engine-rest/process-definition/" + id).then(
    (response) => response.json(),
  );

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

export { fetch_to_signal, get_process_definitions, get_process_definition };
