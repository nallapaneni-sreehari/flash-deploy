import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";

import Deployments from "./components/Deployments";
import LogViewer from "./components/LogViewer";
import LogViewerSimple from "./components/LogViewerSimple";
function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* App is the layout route */}
        <Route path="/" element={<App />}>
          <Route path="deployments" element={<Deployments />} />
          <Route path="deployments/:project_name" element={<LogViewerSimple />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
