import React from "react";

export const TabButton = ({ id, label, icon: Icon, activeTab, onClick }) => (
  <button
    onClick={() => onClick(id)}
    className={`flex items-center gap-2 px-6 py-3 font-medium transition-all ${
      activeTab === id
        ? "text-blue-600 border-b-2 border-blue-600"
        : "text-gray-500 hover:text-gray-700"
    }`}
  >
    <Icon size={20} />
    {label}
  </button>
);
