import React from "react";
import { LogOut, LogIn, Save, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
const SettingsSidebar = ({
  activeTab,
  setActiveTab,
  isLoggedIn,
  handleLogout,
  handleLogin,
  tabs,
  renderActiveTab,
}) => {
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1); // navigates to previous page
  };

  return (
    <>
      {" "}
      <button
        onClick={goBack}
        className="absolute top-2 left-66 flex items-center gap-2 text-sm px-4 py-2 bg-slate-800 text-white hover:bg-slate-700 rounded-lg transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>
      <div className="flex h-screen w-full bg-slate-900 text-white">
        {/* Sidebar */}
        <div className="w-64 bg-slate-900 border-r border-slate-700 flex flex-col text-white">
          {/* Logo */}
          <div className="p-5 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                N
              </div>
              <div className="text-white font-semibold">NEXUS AI</div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 p-5">
            {/* Settings Section */}
            <div className="mb-8">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Settings
              </div>
              <div className="space-y-1">
                {tabs.map((tab) => (
                  <div
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${
                      activeTab === tab.id
                        ? "bg-indigo-600 text-white"
                        : "text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    {tab.icon}
                    {tab.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Account Section */}
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Account
              </div>
              <div className="space-y-1">
                {isLoggedIn ? (
                  <div
                    onClick={handleLogout}
                    className="flex items-center gap-3 p-3 rounded-lg cursor-pointer text-slate-300 hover:bg-slate-700"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </div>
                ) : (
                  <div
                    onClick={handleLogin}
                    className="flex items-center gap-3 p-3 rounded-lg cursor-pointer text-slate-300 hover:bg-slate-700"
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold">
                  {tabs.find((tab) => tab.id === activeTab)?.name || "Settings"}
                </h2>
                <p className="text-slate-400">
                  Configure your Nexus AI experience
                </p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium">
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>

            {renderActiveTab()}
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsSidebar;
