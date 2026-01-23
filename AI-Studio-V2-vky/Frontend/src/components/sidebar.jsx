import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (route) => location.pathname === route;

  const handleNavItemClick = (item) => {
    navigate(item.route);
  };

  const workspaceItems = [
    { name: "Chat", icon: "💬", route: "/chat" },
    { name: "Studio", icon: "🎨", route: "/studio" },
    { name: "Analytics", icon: "📊", route: "/analytics" },
  ];

  const toolsItems = [
    { name: "Plugins", icon: "🔌", route: "/plugins" },
    { name: "Knowledge", icon: "📚", route: "/knowledge" },
    { name: "Settings", icon: "⚙️", route: "/settings" },
    { name: "Security", icon: "🔒", route: "/security" },
  ];

  const scriptsItems = [
    { name: "Scripts", icon: "🧑‍💻", route: "/scripts" },
  ];

  const startupKits = [
    { name: "Startup Kits", icon: "👜", route: "/startupkits" },
  ];

  const testingMethodologies = [
    {name: "Testing Methodologies", icon:"🔎", route: "/testingmethods"},
  ]

  const finOps = [
    {name : "Fin Ops", icon:"🏦", route:"/finops"},
  ]

  const renderItems = (items) =>
    items.map((item) => (
      <div
        key={item.name}
        onClick={() => handleNavItemClick(item)}
        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${
          isActive(item.route)
            ? "bg-indigo-600 text-white"
            : "text-slate-300 hover:bg-slate-700"
        }`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ")
            handleNavItemClick(item);
        }}
      >
        <span>{item.icon}</span>
        <span>{item.name}</span>
      </div>
    ));

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-700 flex flex-col text-white h-screen sticky top-0">
      {/* Logo */}
      <div className="p-5 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center font-bold">
            N
          </div>
          <div className="font-semibold">NEXUS AI</div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-5">
        <div className="mb-8">
          <div className="text-xs font-semibold text-slate-400 uppercase mb-3">
            Workspace
          </div>
          <div className="space-y-1">{renderItems(workspaceItems)}</div>
        </div>

        <div>
          <div className="text-xs font-semibold text-slate-400 uppercase mb-3">
            Tools
          </div>
          <div className="space-y-1">{renderItems(toolsItems)}</div>

          <div className="mt-6">
            <div className="text-xs font-semibold text-slate-400 uppercase mb-3">
              Scripts Marketplace
            </div>
            <div className="space-y-1">{renderItems(scriptsItems)}</div>
          </div>

          <div className="mt-6">
            <div className="text-xs font-semibold text-slate-400 uppercase mb-3">
              Resources
            </div>
            <div className="space-y-1">{renderItems(startupKits)}</div>
          </div>

          <div className="mt-6">
            <div className="text-xs font-semibold text-slate-400 uppercase mb-3">
              Testing Methodologies
            </div>
            <div className="space-y-1">{renderItems(testingMethodologies)}</div>
          </div>

          <div className="mt-6">
            <div className="text-xs font-semibold text-slate-400 uppercase mb-3">
              Fin Ops
            </div>
            <div className="space-y-1">{renderItems(finOps)}</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;