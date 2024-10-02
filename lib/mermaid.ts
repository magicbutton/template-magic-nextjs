import { APPNAME } from "@/app/global";

interface Column {
  column_name: string;
  data_type: string;
}

interface Table {
  table_name: string;
  columns: Column[];
}

interface Relationship {
  source_table: string;
  source_column: string;
  target_table: string;
  target_column: string;
}

interface Schema {
  tables: Table[];
  relationships: Relationship[];
}

export function transformToMermaidERDiagram(schema: Schema): string {
  let diagram = "erDiagram\n";

  // Add table definitions
  // schema.tables.forEach((table) => {
  //   diagram += `    ${table.table_name.toUpperCase()} {\n`;
  //   table.columns.forEach((column) => {
  //     diagram += `        varchar ${column.column_name} \n`;
  //   });
  //   diagram += `    }\n\n`;
  // });

  // Add relationships
  schema?.relationships?.forEach((relationship) => {
    diagram += `    ${relationship.source_table} }o--|| ${relationship.target_table} : "${relationship.source_column} to ${relationship.target_column}"\n`;
  });

  // Add table definitions
  schema.tables.forEach((table) => {
    return;
    diagram += `    
  ${table.table_name} {
      link "${"//" + APPNAME + "/studio/database/" + table.table_name}"
  }
    `;
  });
  return diagram;
}
