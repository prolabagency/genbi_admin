import React, { useState } from "react";
import { $NavigateTo } from "../../db";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const location = useLocation(); // <-- текущий путь
  const navigate = useNavigate();

  return (
    <div
      className={`flex flex-col bg-slate-800 h-screen ${
        isCollapsed ? "w-20" : "w-64"
      } transition-all duration-300 border-r border-slate-700`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-700">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-white font-semibold">Admin Panel</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-slate-700 rounded-lg transition text-gray-400 hover:text-white"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {$NavigateTo.map((item, index) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={index}
              to={item.path || "#"}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition group ${
                isActive
                  ? "bg-slate-700 text-white"
                  : "text-gray-400 hover:bg-slate-700/50 hover:text-white"
              }`}
            >
              {item.icon && (
                <span className="flex-shrink-0">
                  {React.cloneElement(item.icon, {
                    className: "w-5 h-5",
                  })}
                </span>
              )}
              {!isCollapsed && (
                <span className="font-medium text-sm">{item.name}</span>
              )}
              {!isCollapsed && item.badge && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer/User Section */}
      {!isCollapsed && (
        <div
          onClick={() => navigate("/my-profile")}
          className="p-4 border-t border-slate-700"
        >
          <div className="flex items-center gap-3 px-4 py-3 hover:bg-slate-700 rounded-lg transition cursor-pointer">
            <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">US</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                User Name
              </p>
              <p className="text-xs text-gray-400 truncate">Admin</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
