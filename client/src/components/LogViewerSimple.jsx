import React, { useEffect, useRef, useState } from "react";
import { ScrollPanel } from "primereact/scrollpanel";
import { io } from "socket.io-client"; // Add this import
import { useParams } from "react-router-dom";
import { Button } from "primereact/button";

const SOCKET_URL = "http://localhost:5000"; // Update if your server runs elsewhere

const LogViewerSimple = () => {
  const [visibleLogs, setVisibleLogs] = useState([]);
  const [projectLink, setProjectLink] = useState("");

  const scrollRef = useRef(null);
  const { project_name } = useParams();
  console.log("project_name ::: ", project_name);
  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on(`logs:${project_name}`, (data) => {
      console.log("Received log:", data);
      if (data?.message?.includes("completed successfully")) {
        const link = `http://${project_name}.${import.meta.env.VITE_DEP_BASE}`;
        console.log("Project link:", link);
        setProjectLink(link);
        socket.disconnect();
      }

      setVisibleLogs((prev) => [
        ...prev,
        { command: data.project, output: data.message },
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const getLogColor = (log) => {
    if (log.output.includes("error") || log.output.includes("failed")) {
      return "!text-red-500";
    } else if (log.output.includes("warn")) {
      return "!text-amber-500";
    } else {
      return "!text-green-500";
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      const scrollEl = scrollRef.current.getElement();
      scrollEl.scrollTop = scrollEl.scrollHeight;
    }
  }, [visibleLogs]);

  return (
    <div className="!h-full p-4">
      <div className="flex justify-between items-center mb-4">
        <span className="font-semibold text-xl mb-2 block">
          Deployment Logs: <code>{project_name}</code>
        </span>
        <span className="font-semibold text-xl mb-2 block">
          {projectLink && (
            <Button
              text
              outlined
              icon="pi pi-external-link"
              className="p-0 m-0"
              label="View Project"
              onClick={() =>
                window.open(projectLink, "_blank", "noopener,noreferrer")
              }
            />
          )}
        </span>
      </div>
      <ScrollPanel
        ref={scrollRef}
        style={{ width: "100%", height: "550px" }}
        className="bg-gray-900 text-white rounded-xl"
      >
        <div className="font-mono text-xs !py-3">
          {visibleLogs.map((log, idx) => (
            <div key={idx} className="mb-2">
              <div className="!text-white dark:!text-gray-800 text-sm">$ {log?.command}</div>
              <pre className={`whitespace-pre-wrap ${getLogColor(log)} m-0`}>
                {log?.output}
              </pre>
            </div>
          ))}
        </div>
      </ScrollPanel>
    </div>
  );
};

export default LogViewerSimple;
