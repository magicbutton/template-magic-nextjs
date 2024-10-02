// types.ts

export interface Action {
  id: string;
  name: string;
  description: string;
  icon: string; // LucideReact icon reference
}

export interface SectionStage {
  action: string;
  description: string;
}

export interface Section {
  id: string;
  name: string;
  register: SectionStage;
  start: SectionStage;
  complete: SectionStage;
  decide: SectionStage;
}

export interface Workflow {
  name: string;
  description: string;
  actions: Action[];
  sections: Section[];
}

export interface WorkflowFile {
  workflow: Workflow;
}

// parser.ts

import { parse } from "yaml";

export function parseWorkflowYaml(yamlContent: string): WorkflowFile {
  // Parse the YAML string into a JavaScript object
  const parsed = parse(yamlContent);

  // Optionally, add runtime validation here if needed
  // For example, using a library like `zod` to ensure the parsed object conforms to the WorkflowFile interface

  return parsed as WorkflowFile;
}
