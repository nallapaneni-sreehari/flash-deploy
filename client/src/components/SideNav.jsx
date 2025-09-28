import { useState } from "react";
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

export default function SideNav({ sideNavCollapsed, setCollapsedSideNav }) {
  const [collapsed, setCollapsed] = useState(sideNavCollapsed);
  const navigate = useNavigate();

  const items = [
    {
      label: "Collapse",
      // icon: `pi ${collapsed ? "pi-bars" : "pi-arrow-left"}`,
      command: () => {
        setCollapsed((c) => !c);
        setCollapsedSideNav(!collapsed);
      },

      template: (item, options) => (
        <Button
          text
          outlined
          icon={`pi ${collapsed ? "pi-bars" : "pi-arrow-left"}`}
          // size="small"
          severity="danger"
          className="p-3 w-full flex items-center"
        >
          <i className={`${item.icon} mr-2`} />
          {item.label}
        </Button>
      ),
    },
    {
      label: "Dashboard",
      // icon: "pi pi-desktop",
      command: () => console.log("Dashboard clicked"),
      template: (item, options) => (
        <Button
          text
          outlined
          icon="pi pi-desktop"
          // size="small"
          // severity="danger"
          className="p-3 w-full flex items-center font-semibold"
        >
          <i className={`${item.icon} mr-2`} />
          {item.label}
        </Button>
      ),
    },
    {
      label: "Deployments",
      // icon: "pi pi-wave-pulse",
      command: () => {
        navigate("/deployments");
      },
      template: (item, options) => (
        <Button
          text
          outlined
          icon="pi pi-wave-pulse"
          // size="small"
          // severity="danger"
          className="p-3 w-full flex items-center font-semibold"
        >
          <i className={`${item.icon} mr-2`} />
          {item.label}
        </Button>
      ),
    },
    {
      label: "Log Management",
      // icon: "pi pi-warehouse",
      command: () => console.log("Projects clicked"),
      template: (item, options) => (
        <Button
          text
          outlined
          icon="pi pi-warehouse"
          // size="small"
          // severity="danger"
          className="p-3 w-full flex items-center font-semibold"
        >
          <i className={`${item.icon} mr-2`} />
          {item.label}
        </Button>
      ),
    },
    {
      label: "Reports",
      // icon: "pi pi-chart-bar",
      command: () => console.log("Reports clicked"),
      template: (item, options) => (
        <Button
          text
          outlined
          icon="pi pi-chart-bar"
          // size="small"
          // severity="danger"
          className="p-3 w-full flex items-center font-semibold"
        >
          <i className={`${item.icon} mr-2`} />
          {item.label}
        </Button>
      ),
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
