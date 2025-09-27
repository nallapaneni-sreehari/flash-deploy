import { Outlet } from "react-router-dom";
import TopNavBar from "./components/TopNavBar";
import SideNav from "./components/SideNav";
import Footer from "./components/Footer";
import { Card } from "primereact/card";
import { useState } from "react";

function App() {
  const topNavHeight = 56;
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [sideNavCollapsed, setSideNavCollapsed] = useState(false);

  return (
    <div
      className={`h-screen transition-colors bg-sky-100${
        theme === "dark" ? " bg-slate-800" : ""
      }`}
      style={{ paddingTop: topNavHeight }}
    >
      <TopNavBar
        onToggleSideNav={() => setSideNavCollapsed((c) => !c)}
        theme={theme}
        setTheme={setTheme}
      />
      <div className="mt-3 flex flex-1 h-[calc(100vh-150px)] gap-2">
        <SideNav
          collapsed={sideNavCollapsed}
          setCollapsedSideNav={setSideNavCollapsed}
        />
        <Card className="!rounded-lg flex-1">
          {/* This is where nested routes render */}
          <Outlet />
        </Card>
      </div>
      <Footer />
    </div>
  );
}

export default App;
