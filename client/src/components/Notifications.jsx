import { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { ProgressSpinner } from "primereact/progressspinner";

import { notifications as mockNotifications } from '../mocks/notifications';

// Mock API fetch
function fetchNotifications() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockNotifications);
    }, 800);
  });
}

export default function Notifications({ onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchNotifications().then((data) => {
      setNotifications(data);
      setLoading(false);
    });
  }, [notifications]);

  const handleClose = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (onClose) onClose(id);
  };

  // Helper function for icon and color
  function getSeverityIcon(type) {
    let icon = "pi-info-circle";
    let color = "!text-blue-500 bg-blue-100 dark:bg-blue-900";
    if (type === "success") {
      icon = "pi-check-circle";
      color = "!text-green-500 bg-green-100 dark:bg-green-900";
    } else if (type === "warning") {
      icon = "pi-exclamation-triangle";
      color = "!text-yellow-500 bg-yellow-100 dark:bg-yellow-900";
    } else if (type === "error") {
      icon = "pi-times-circle";
      color = "!text-red-500 bg-red-100 dark:bg-red-900";
    }
    return (
      <span
        className={`pi ${icon} ${color} rounded-full text-2xl p-2 shadow-sm`}
        style={{
          minWidth: 40,
          minHeight: 40,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      />
    );
  }

  const notificationHeader = () => {
    return (
      <div className="flex items-center justify-between px-1 border-b border-sky-200">
        <span className="text-lg font-bold">Notifications</span>
        <Button
          size="small"
          severity="danger"
          icon="pi pi-times"
          className="p-button-text"
          onClick={onClose}
          label="Clear"
        />
      </div>
    );
  };

  return (
    <Card
      title={notificationHeader()}
      className="max-w-full shadow-2xl rounded-2xl border-0 bg-gradient-to-br !py-0"
    >
      <div className="space-y-5 overflow-y-auto h-[30rem] px-2 mt-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <ProgressSpinner
              style={{ width: 40, height: 40 }}
              strokeWidth={4}
            />
            <span className="mt-4 text-sm">Loading notifications...</span>
          </div>
        ) : notifications.length === 0 ? (
          <Message severity="info" text="No notifications" className="w-full" />
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`flex items-start gap-4 rounded-xl p-4 shadow-md border  relative transition-all duration-200 hover:scale-[1.02] hover:shadow-xl`}
              style={{ minHeight: 70 }}
            >
              <div className="pt-1 flex items-center justify-center">
                {getSeverityIcon(n.type)}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-base mb-1">{n.title}</div>
                <div className="text-sm leading-relaxed">{n.message}</div>
              </div>
              <Button
                icon="pi pi-times"
                severity="danger"
                className="p-button-rounded p-button-text absolute top-2 right-2"
                onClick={() => handleClose(n.id)}
                tooltipOptions={{ position: "left" }}
              />
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
