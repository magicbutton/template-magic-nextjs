import { z, ZodSchema } from "zod";
import { useSQLSelect3 } from "@/app/koksmat/usesqlselect3";
import { useState, useEffect, useContext } from "react";
import { execute } from "@/actions/client";
import { MagicboxContext } from "@/app/koksmat/magicbox-context";

// Define types for the record
type RecordType = {
  id: number;
  name: string;
  // Add other fields as necessary
};

interface DatabaseUpdateResult {
  id: string;
  error: string;
}

export interface DatabaseRecordHook<T> {
  item: T | null;
  loading: boolean;
  loaded: boolean;
  newRecord: boolean | null;
  error: React.ReactElement | null;
  save: (record: T) => Promise<DatabaseUpdateResult>;
}
// Define the hook
export default function useDatabaseRecord(
  schema: ZodSchema,
  key: string,
  database: string,
  table: string,
  sqlExpression?: string
): DatabaseRecordHook<z.infer<typeof schema>> {
  const magicbox = useContext(MagicboxContext);

  // Define individual state variables
  const [loading, setLoading] = useState<boolean>(true);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [newRecord, setNewRecord] = useState<boolean | null>(null);
  const [loadedRecord, setLoadedRecord] = useState<z.infer<typeof schema>>();
  const [error, setError] = useState<string | null>(null);
  const [id, setid] = useState("");

  const databaseItem = useSQLSelect3<z.infer<typeof schema>>(
    database,
    sqlExpression ?? `select * from ${table} where id = ${key}`
  );

  const loadRecord = async () => {
    if (!databaseItem) return;

    setLoading(true);

    if (databaseItem.isLoading) return;

    if (databaseItem.error) {
      setLoading(false);
      setError(databaseItem.error);
      return;
    }

    if (databaseItem?.dataset?.length > 0) {
      setLoaded(true);
      setNewRecord(false);
      setLoadedRecord(databaseItem.dataset[0]);
      setid(databaseItem.dataset[0].id);
      setError(null); // Clear error on successful load
    } else {
      setLoaded(true);
      setNewRecord(true);
      //      setLoadedRecord(null);
      setError(null); // Clear error if no record found
    }

    setLoading(false);
  };

  useEffect(() => {
    loadRecord();
  }, [databaseItem]);

  const saveRecord = async (record: Omit<RecordType, "id">, isNew: boolean) => {
    const parsed = schema.safeParse(record);

    if (!parsed.success) {
      setError(parsed.error.errors.map((err) => err.message).join(", "));
      return;
    }

    const dbRecord = { ...parsed.data, tenant: "", searchindex: "", id };

    const action = isNew ? `create_${table}` : `update_${table}`;

    const result = await execute(
      magicbox.authtoken,
      database,
      "magic-mix.app",
      action,
      dbRecord
    );

    if (result.hasError) {
      throw new Error(result.errorMessage);
    }

    return result.data;
  };

  const save = async (
    record: z.infer<typeof schema>
  ): Promise<DatabaseUpdateResult> => {
    try {
      if (loadedRecord) {
        // Update existing record
        await saveRecord(record, false);
      } else {
        // Add new record
        await saveRecord(record, true);
      }
      await loadRecord(); // Reload after save
      return { id: id, error: "" };
    } catch (error) {
      console.error("Error saving record:", error);
      return { id: "", error: "An error occurred while saving the record." };
    }
  };

  return {
    item: loadedRecord,
    loading,
    loaded,
    newRecord,
    error: error ? <div className="text-red-500">{error}</div> : null,
    save,
  };
}
