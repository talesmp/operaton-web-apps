import { signal } from "@preact/signals";

export const globalState = {
  deployments: signal([]),
  selectedDeployment: signal(null),
  resources: signal([]),
  selectedResource: signal(null),
  selectedProcessDetails: signal(null),
  selectedProcessStatistics: signal(null),
  bpmnXml: signal(null),
};