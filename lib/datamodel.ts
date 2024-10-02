type fieldCategoryType = "system" | "standard";
export function hasField(name: string, category: fieldCategoryType): boolean {
  const fields: { name: string; category: fieldCategoryType }[] = [
    { name: "deleted_at", category: "system" },
    { name: "updated_at", category: "system" },
    { name: "created_at", category: "system" },
    { name: "koksmat_bucket", category: "system" },
    { name: "id", category: "system" },
    { name: "koksmat_masterdata_etag", category: "system" },
    { name: "koksmat_compliancetag", category: "system" },
    { name: "koksmat_state", category: "system" },
    { name: "tenant", category: "system" },
    { name: "searchindex", category: "system" },
    { name: "name", category: "standard" },
    { name: "description", category: "standard" },
    { name: "code", category: "standard" },
    { name: "created_by", category: "system" },
    { name: "updated_by", category: "system" },
    { name: "koksmat_masterdataref", category: "system" },
    { name: "koksmat_masterdata_id", category: "system" },
  ];

  return fields.some(
    (field) => field.name === name && field.category === category
  );
}
