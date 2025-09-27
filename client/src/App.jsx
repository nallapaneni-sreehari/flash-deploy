import TopNavBar from "./components/TopNavBar";
import SideNav from "./components/SideNav";
import { Button } from "primereact/button";
import Footer from "./components/Footer";
import { Card } from "primereact/card";
import { useState } from "react";

function App() {
  // Height of TopNavBar (Menubar) is about 56px by default
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
        />{" "}
        <Card className="!rounded-lg flex-1 p-6">
          {/* Jira Clone content goes here */}
          <h2 className="text-2xl font-bold">Dashboard 123</h2>
          <Button label="Click Me" />
        </Card>
      </div>
      <Footer />
    </div>
  );
}

export default App;
