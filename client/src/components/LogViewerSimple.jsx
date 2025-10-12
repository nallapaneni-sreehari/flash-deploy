import React, { useEffect, useRef, useState } from "react";
import { ScrollPanel } from "primereact/scrollpanel";
import { io } from "socket.io-client"; // Add this import
import { useParams } from "react-router-dom";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { Toast } from "primereact/toast";

const SOCKET_URL = "http://localhost:5000"; // Update if your server runs elsewhere

const LogViewerSimple = () => {
  const [visibleLogs, setVisibleLogs] = useState([]);
  const [projectLink, setProjectLink] = useState("");

  const scrollRef = useRef(null);
  const bottomRef = useRef(null);
  const toast = useRef(null);
  const { project_name } = useParams();

  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ["websocket", "polling"] });

    const eventName = `logs:${project_name}`;

    const handler = (data) => {
      // Normalize incoming data
      const output = typeof data === "string" ? data : data?.message || "";
      const command = data?.project || "deploy";

      if (output?.toLowerCase()?.includes("completed successfully")) {
        const link = `http://${project_name}.${import.meta.env.VITE_DEP_BASE}`;
        setProjectLink(link);
        toast.current?.show({
          severity: "success",
          summary: "Deployment complete",
          detail: `Project available at ${link}`,
          life: 6000,
        });
        // keep socket alive for a small grace period to receive final logs, then disconnect
        setTimeout(() => socket.disconnect(), 1500);
      }

      setVisibleLogs((prev) => [
        ...prev,
        { timestamp: new Date().toISOString(), command, output },
      ]);
    };

    socket.on(eventName, handler);

    return () => {
      try {
        socket.off(eventName, handler);
        socket.disconnect();
      } catch (e) {
        // ignore cleanup errors
      }
    };
  }, [project_name]);

  const getSeverity = (text) => {
    const lower = (text || "").toLowerCase();
    if (lower.includes("error") || lower.includes("failed") || lower.includes("exception")) return "error";
    if (lower.includes("warn") || lower.includes("warning")) return "warn";
    if (lower.includes("info")) return "info";
    return "success";
  };

  useEffect(() => {
    // Auto scroll to bottom when new logs appended
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (scrollRef.current) {
      try {
        const el = scrollRef.current.getElement();
        el.scrollTop = el.scrollHeight;
      } catch (e) {}
    }
  }, [visibleLogs]);

  const copyLog = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.current?.show({ severity: "info", summary: "Copied", detail: "Log copied to clipboard", life: 2000 });
    } catch (e) {
      toast.current?.show({ severity: "warn", summary: "Copy failed", detail: "Could not copy to clipboard", life: 3000 });
    }
  };

  return (
    <div className="!h-full p-4 max-w-8xl">
      <Toast ref={toast} />

      <div className="flex justify-between items-center mb-4">
        <div>
          <span className="font-semibold text-xl mb-2 block">Deployment Logs:</span>
          <code className="text-sm">{project_name}</code>
        </div>
        <div className="flex items-center gap-2">
          {projectLink && (
            <Button
              text
              outlined
              icon="pi pi-external-link"
              className="p-0 m-0"
              label="View Project"
              onClick={() => window.open(projectLink, "_blank", "noopener,noreferrer")}
            />
          )}
          <Button
            icon="pi pi-trash"
            severity="danger"
            outlined
            text
            label="Clear Logs"
            onClick={() => setVisibleLogs([])}
          />
        </div>
      </div>

      <ScrollPanel ref={scrollRef} style={{ width: "100%", height: "550px" }} className="rounded-xl">
        <div className="p-3">
          {visibleLogs.length === 0 && (
            <div className="p-3 text-center text-sm text-gray-500">Waiting for logs...</div>
          )}

          <div className="space-y-3 font-mono text-sm">
            {visibleLogs.map((log, idx) => {
              const severity = getSeverity(log.output);
              const time = new Date(log.timestamp).toLocaleTimeString();
              return (
                <div key={idx} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 shadow-sm border">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <div className="flex items-center gap-3">
                      <Message className="!rounded-lg px-2 !py-[0.05rem]" text={log.command ? `$ ${log.command} - ${time}` : ""} />
                      {/* <div className="text-xs text-gray-500">{time}</div> */}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        icon="pi pi-copy"
                        className="p-button-text"
                        tooltip="Copy log"
                        onClick={() => copyLog(log.output)}
                      />
                    </div>
                  </div>

                  <div className="whitespace-pre-wrap text-xs text-gray-800 dark:text-gray-200">
                    <pre className="m-0 whitespace-break-spaces">{log.output}</pre>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        </div>
      </ScrollPanel>
    </div>
  );
};

export default LogViewerSimple;
