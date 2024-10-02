"use client";
/**
 * Create operation
 */
export interface CreateActivitymodelProps {
  activity?: string;
  data?: { [key: string]: any };
  description?: string;
  name?: string;
  /**
   * Search Index is used for concatenating all searchable fields in a single field making in
   * easier to search
   */
  searchindex?: string;
  tenant?: string;
  [property: string]: any;
}

import React, { useEffect, useState } from "react";
import ExecuteTransaction from "./execute";

export default function WorkCreateActivityModel(props: {
  transactionid: string;
  request: CreateActivitymodelProps | null | undefined;
}) {
  const { request, transactionid } = props;
  const hasRequestBeenInitialized = () => {
    return request !== null && request !== undefined;
  };
  const [payload, setpayload] = useState<
    CreateActivitymodelProps | null | undefined
  >(null);
  useEffect(() => {
    if (!hasRequestBeenInitialized()) return;

    setpayload(request);
  }, [request]);

  return (
    <div>
      {hasRequestBeenInitialized() && (
        <ExecuteTransaction
          database="works"
          payload={payload}
          processname="create_activitymodel"
          transactionId={transactionid}
        />
      )}
    </div>
  );
}
