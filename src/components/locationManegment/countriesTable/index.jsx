import React from "react";
import { Edit2, Trash2 } from "lucide-react";

export const CountriesTable = ({ countries, onEdit, onDelete }) => (
  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
    <table className="w-full">
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Страна
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Код
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Регионов
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Городов
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Статус
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Действия
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {countries.map((country) => (
          <tr key={country.id} className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {country.alpha2_code}
                </div>
                <span className="font-medium text-gray-900">
                  {country.name}
                </span>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-gray-600">
              {country.code}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-gray-600">
              {country.regions}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-gray-600">
              {country.cities}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                Активна
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEdit(country)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => onDelete(country.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
