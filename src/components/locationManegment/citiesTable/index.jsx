import React from "react";
import { Edit2, Trash2, MapPin } from "lucide-react";

export const CitiesTable = ({ cities, onEdit, onDelete }) => (
  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
    <table className="w-full">
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Город
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Регион
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Страна
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Население
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
        {cities && cities.length > 0 ? (
          cities.map((city) => (
            <tr key={city.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white">
                    <MapPin size={20} />
                  </div>
                  <span className="font-medium text-gray-900">
                    {typeof city.name === "object"
                      ? city.name.name || "Неизвестно"
                      : city.name}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                {typeof city.region === "object"
                  ? city.region.name
                  : city.region}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                {typeof city.region === "object" && city.region.country
                  ? typeof city.region.country === "object"
                    ? city.region.country.name
                    : city.region.country
                  : typeof city.country === "object"
                  ? city.country.name
                  : city.country || "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                {city.population || "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                  Активен
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(city)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(city.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
              Нет данных для отображения
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);
