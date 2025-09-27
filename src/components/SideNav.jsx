import { useState } from "react";
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";

export default function SideNav({ sideNavCollapsed, setCollapsedSideNav }) {
  const [collapsed, setCollapsed] = useState(sideNavCollapsed);

  const items = [
    {
      label: "Collapse",
      icon: `pi ${collapsed ? "pi-bars" : "pi-arrow-left"}`,
      command: () => {
        setCollapsed((c) => !c);
        setCollapsedSideNav(!collapsed);
      },
    },
    {
      label: "Dashboard",
      icon: "pi pi-home",
      command: () => console.log("Dashboard clicked"),
    },
    {
      label: "Tickets",
      icon: "pi pi-ticket",
      command: () => console.log("Tickets clicked"),
    },
    {
      label: "Projects",
      icon: "pi pi-briefcase",
      command: () => console.log("Projects clicked"),
    },
    {
      label: "Reports",
      icon: "pi pi-chart-bar",
      command: () => console.log("Reports clicked"),
    },
  ];

  // Custom template for Menu items to show only icon when collapsed
  const itemTemplate = (item) => (
    <div className="flex items-center">
      <i className={`${item.icon} text-xl`} />
      {!collapsed && <span className="ml-3">{item.label}</span>}
    </div>
  );

  // When collapsed, use items with empty label
  const menuItems = collapsed
    ? items.map((item) => ({ ...item, label: "" }))
    : items;

  return (
    <aside
      style={{
        width: collapsed ? "4rem" : "16rem",
        boxShadow: "2px 0 12px 0 rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Menu
        model={menuItems}
        className="w-full"
        template={itemTemplate}
        style={{ flex: 1, minHeight: 0 }}
      />
    </aside>
  );
}
