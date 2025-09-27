import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";

import Deployments from "./components/Deployments";
function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* App is the layout route */}
        <Route path="/" element={<App />}>
          <Route path="deployments" element={<Deployments />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
