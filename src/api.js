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

const get_process_defintions = () =>
  fetch(
    "http://localhost:8888/engine-rest/process-definition/statistics",
    // process_defintions_url
    // {
    //   mode: "no-cors",
    //   headers: {
    //     "Content-Type": "application/json",
    //     // Authorization: "Basic " + btoa("demo:demo"),
    //   },
    // },
  ).then((response) => response.json());

export { get_process_defintions };
