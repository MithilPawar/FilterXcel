import React from "react";
import BasicOperationPanel from "../components/BasicOperations/BasicOperationPanel";

const BasicOperationsPage = () => {
  return (
    <div className="w-full px-4 py-6 overflow-x-auto">
      <h1 className="text-2xl font-bold mb-6">Basic Operations</h1>
      <BasicOperationPanel />
    </div>
  );
};

export default BasicOperationsPage;
