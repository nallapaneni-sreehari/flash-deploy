import { useState, useRef, useEffect } from "react";
import { Menubar } from "primereact/menubar";
import { Avatar } from "primereact/avatar";
import { OverlayPanel } from "primereact/overlaypanel";
import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { Moon, Sun, Bell } from "lucide-react";
import { Menu } from "primereact/menu";
import { Dialog } from "primereact/dialog";
import Notifications from "./Notifications";

export default function TopNavBar({ setTheme: setThemeProp }) {
  const opNotifications = useRef(null);
  const opProfile = useRef(null);

  const menu = useRef(null);

    const [showLogout, setShowLogout] = useState(false);
  const items = [
    {
      label: "Profile",
      icon: "pi pi-user",
      command: () => console.log("Profile clicked"),
    },
    {
      label: "Settings",
      icon: "pi pi-cog",
      command: () => console.log("Settings clicked"),
    },
    { separator: true },
    {
      label: "Logout",
      icon: "pi pi-sign-out",
      command: () => setShowLogout(true),
      template: (item, options) => (
        <Button
          text
          outlined
          size="small"
          severity="danger"
          className="w-full flex items-center font-semibold"
        >
          <i className={`${item.icon} mr-2`} />
          {item.label}
        </Button>
      ),
    },
  ];

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    const existingLink = document.getElementById("theme-css");
    if (existingLink) {
      switch (theme) {
        case "light":
          document.documentElement.classList.remove("dark");
          existingLink.href = "/themes/nova-accent/theme.css";
          break;
        case "dark":
          document.documentElement.classList.add("dark");
          existingLink.href = "/themes/vela-blue/theme.css";
          break;
        default:
          existingLink.href = "/themes/nova-accent/theme.css";
      }
    }
    setThemeProp(theme);
  }, [theme]);

  const start = (
    <div className="flex items-center gap-2">
      <i className="pi pi-briefcase text-xl text-primary"></i>
      <span className="font-bold text-lg">FlashDeploy</span>
    </div>
  );

  const end = (
    <div className="flex items-center gap-5">
      {/* Theme Switcher */}
      <Button
        text={true}
        rounded={true}
        outlined
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        icon={
          theme === "light" ? (
            <Moon size={18} className="text-gray-700" />
          ) : (
            <Sun size={18} className="text-yellow-400" />
          )
        }
      />

      {/* Notifications */}
      <div className="relative">
        <Button
          text={true}
          rounded={true}
          onClick={(e) => opNotifications.current.toggle(e)}
          icon={<Bell size={18} />}
        />
        <OverlayPanel ref={opNotifications} className="w-lg !p-0">
          <style>{`.p-overlaypanel-content { padding: 0 !important; }`}</style>
          {/* Modern Notifications component */}
          <div className="">
            <Notifications />
          </div>
        </OverlayPanel>
      </div>

      {/* User Profile */}
      <div>
        <Avatar
          label="S"
          shape="circle"
          size="large"
          className="cursor-pointer"
          onClick={(e) => menu.current.toggle(e)}
        />
        <Menu model={items} popup ref={menu} />
      </div>
    </div>
  );

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100 }}>
      <Menubar start={start} end={end} className="shadow-md" />
        <Dialog
          header="Confirm Logout"
          visible={showLogout}
          style={{ width: "350px" }}
          onHide={() => setShowLogout(false)}
          footer={
            <div className="flex justify-end gap-2">
              <Button label="Cancel" icon="pi pi-times" onClick={() => setShowLogout(false)} className="p-button-text" />
              <Button label="Logout" icon="pi pi-sign-out" severity="danger" onClick={() => { setShowLogout(false); console.log("User logged out"); }} autoFocus />
            </div>
          }
        >
          <div className="flex items-center gap-3">
            <i className="pi pi-sign-out text-2xl text-red-500" />
            <span>Are you sure you want to logout?</span>
          </div>
        </Dialog>
    </div>
  );
}
