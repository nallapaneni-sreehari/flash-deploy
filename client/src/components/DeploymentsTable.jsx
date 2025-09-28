import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { initialDeployments } from "../mocks/deployments";
import { useTheme } from "../context/ThemeContext";

const DeploymentsTable = () => {
  const [deployments, setDeployments] = useState(initialDeployments);
  const [selectedDeployments, setSelectedDeployments] = useState([]);
  const { theme, setTheme } = useTheme();

  const handleDelete = (rowData) => {
    setDeployments(deployments.filter((d) => d.id !== rowData.id));
  };

  const handleRetrigger = (rowData) => {
    // Add logic to re-trigger deployment
    alert(`Re-triggering deployment for ${rowData.projectName}`);
  };

  const actionBodyTemplate = (rowData) => (
    <div className="flex gap-2">
      <Button icon="pi pi-external-link" className="p-button-sm" onClick={() => handleRetrigger(rowData)} tooltip="Live Project" />
      <Button icon="pi pi-refresh" className="p-button-sm" onClick={() => handleRetrigger(rowData)} tooltip="Re-trigger" />
      <Button icon="pi pi-trash" className="p-button-sm p-button-danger" onClick={() => handleDelete(rowData)} tooltip="Delete" />
    </div>
  );

  return (
    <div className="gap-2 flex flex-col">
      <span className="font-semibold text-xl">Recent Deployments</span>
      <DataTable
        value={deployments}
        selection={selectedDeployments}
        onSelectionChange={(e) => setSelectedDeployments(e.value)}
        dataKey="id"
        paginator
        rows={theme === "dark" ? 7 : 5}
        size="small"
        sortMode="multiple"
        filterDisplay="menu"
        selectionMode="multiple"
        showGridlines
        responsiveLayout="scroll"
      >
        <Column
          selectionMode="multiple"
          headerStyle={{ width: "3em" }}
        ></Column>
        <Column
          field="projectName"
          header="Project Name"
          sortable
          filter
          filterPlaceholder="Search by name"
        />
        <Column
          field="gitUrl"
          header="Git URL"
          sortable
          filter
          filterPlaceholder="Search by URL"
        />
        <Column
          field="status"
          header="Status"
          sortable
          filter
          filterPlaceholder="Status"
        />
        <Column
          field="createdAt"
          header="Created At"
          sortable
          filter
          filterPlaceholder="Date"
        />
        <Column
          body={actionBodyTemplate}
          header="Actions"
          style={{ minWidth: "8em" }}
        />
      </DataTable>
    </div>
  );
};

export default DeploymentsTable;
