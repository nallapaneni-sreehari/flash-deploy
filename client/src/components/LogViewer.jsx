import React, { useEffect, useState } from "react";
import { Terminal } from "primereact/terminal";
import { TerminalService } from "primereact/terminalservice";

const logData = [
  { command: "git clone https://github.com/user/demo.git", output: "Cloning into 'demo'...\nremote: Enumerating objects: 10, done.\nReceiving objects: 100% (10/10), done." },
  { command: "npm install", output: "added 50 packages, and audited 51 packages in 2s" },
  { command: "npm run build", output: "Compiled successfully!\nBuild complete." },
  { command: "deploy", output: "Deployment started...\nDeployment finished successfully." },
  { command: "error", output: "Error: Unable to connect to server." },
];

const LogViewer = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    let idx = 0;

    const handleResponse = (msg) => {
      setLogs((prev) => [...prev, msg]);
    };

    TerminalService.on("response", handleResponse);

    const printNextLog = () => {
      if (idx < logData.length) {
        TerminalService.emit("response", `$ ${logData[idx].command}`);
        setTimeout(() => {
          TerminalService.emit("response", logData[idx].output);
          idx++;
          setTimeout(printNextLog, 700);
        }, 400);
      }
    };

    setTimeout(printNextLog, 700);

    return () => {
      TerminalService.off("response", handleResponse); // cleanup
    };
  }, []);

  return (
    <div className="p-4">
      <span className="font-semibold text-xl mb-2 block">Deployment Logs</span>
      <div className="rounded-2xl shadow-lg p-4">
        <Terminal
          welcomeMessage="Build In Progress..."
          prompt="sreehari $"
          pt={{
            root: "bg-gray-900 text-white border-round h-64 overflow-auto",
            prompt: "text-gray-400 mr-2",
            command: "text-primary-300",
            response: "text-primary-300",
          }}
          value={logs} // <-- pass logs here
        />
      </div>
    </div>
  );
};

export default LogViewer;
