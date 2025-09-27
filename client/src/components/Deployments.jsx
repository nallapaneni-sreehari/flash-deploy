import React, { useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

const Deployments = () => {
  const [visible, setVisible] = useState(false);
  const [gitUrl, setGitUrl] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectNameError, setProjectNameError] = useState("");
  const [gitUrlError, setGitUrlError] = useState("");

  const handleProceed = async () => {
    let valid = true;
    // Validate git url
    if (!gitUrl.trim()) {
      setGitUrlError("Git URL is required.");
      valid = false;
    } else {
      setGitUrlError("");
    }
    // Validate project name
    if (!/^[a-zA-Z0-9]+$/.test(projectName)) {
      setProjectNameError("Project name must be alphanumeric.");
      valid = false;
    } else {
      setProjectNameError("");
    }
    if (!valid) return;
    // Add logic to handle deployment creation
    try {
      const payload = {
        git_url: gitUrl,
        project_name: projectName,
      };
      const { requestDeployment } = await import("../services/core");
      const response = await requestDeployment(payload);
      setVisible(false);
      setGitUrl("");
      setProjectName("");
      console.log("Deployment response:", response.data);
    } catch (err) {
      console.error("Deployment error:", err);
    }
  };

  const handleCancel = () => {
    setVisible(false);
    setGitUrl("");
    setProjectName("");
    setProjectNameError("");
    setGitUrlError("");
  };

  return (
    <div className="flex justify-end">
      <Button
        label=""
        icon="pi pi-plus"
        onClick={() => setVisible(true)}
        className="md:hidden"
      />
      <Button
        label="Create a deployment"
        icon="pi pi-plus"
        onClick={() => setVisible(true)}
        className="hidden md:block"
      />

      <Dialog
        header="Create Deployment"
        visible={visible}
        style={{ maxWidth: "100vw" }}
        onHide={handleCancel}
        className="!w-full md:!w-1/2"
      >
        <div className="flex flex-col gap-4 mt-4">
          <span className="p-float-label mb-4">
            <InputText
              id="giturl"
              value={gitUrl}
              onChange={(e) => {
                setGitUrl(e.target.value);
                if (gitUrlError && e.target.value.trim()) {
                  setGitUrlError("");
                }
              }}
              className={`w-full${gitUrlError ? " p-invalid" : ""} py-2`}
            />
            <label htmlFor="giturl">
              Git URL <span className="!text-red-500">*</span>
            </label>
          </span>
          {gitUrlError && (
            <small className="p-error" style={{ marginTop: "-1rem" }}>
              {gitUrlError}
            </small>
          )}
          <span className="p-float-label">
            <InputText
              id="projectname"
              value={projectName}
              onChange={(e) => {
                const value = e.target.value;
                setProjectName(value);
                if (value === "" || /^[a-zA-Z0-9]+$/.test(value)) {
                  setProjectNameError("");
                } else {
                  setProjectNameError("Project name must be alphanumeric.");
                }
              }}
              className={`w-full${projectNameError ? " p-invalid" : ""} py-2`}
            />
            <label htmlFor="projectname">
              Project Name <span className="!text-red-500">*</span>
            </label>
          </span>
          {projectNameError && (
            <small className="p-error" style={{ marginTop: "-1rem" }}>
              {projectNameError}
            </small>
          )}
          <div className="flex justify-end gap-4 mt-4">
            <Button
              label="Cancel"
              icon="pi pi-times"
              className="p-button-secondary"
              onClick={handleCancel}
            />
            <Button
              label="Proceed"
              icon="pi pi-check"
              onClick={handleProceed}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Deployments;
