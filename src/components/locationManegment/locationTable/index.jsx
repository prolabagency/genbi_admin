import React, { useState } from "react";
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Search,
  Globe,
} from "lucide-react";
import { $API } from "../../../axios";

export default function LocationsTab({ locations, setLocations }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    region_id: "",
    city_id: "",
    latitude: "",
    longitude: "",
    address: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      region_id: "",
      city_id: "",
      latitude: "",
      longitude: "",
      address: "",
    });
  };

  // Добавление локации
  const handleAdd = async () => {
    if (!formData.name) {
      alert("Заполните обязательное поле: Название");
      return;
    }

    const payload = {
      name: formData.name,
      region_id: parseInt(formData.region_id) || null,
      city_id: parseInt(formData.city_id) || null,
      latitude: formData.latitude ? parseFloat(formData.latitude) : null,
      longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      address: formData.address || "",
    };

    try {
      const response = await $API.post("geo/locations/", payload);
      console.log("Location added:", response.data);

      setLocations([response.data, ...locations]);
      setShowAddForm(false);
      resetForm();
    } catch (error) {
      console.error(
        "Ошибка добавления локации:",
        error.response?.data || error
      );
      alert("Ошибка при добавлении локации");
    }
  };

  // Открытие редактирования
  const handleEdit = (location) => {
    setEditingId(location.id);
    setFormData({
      name: location.name || "",
      region_id: location.region_id?.toString() || "",
      city_id: location.city_id?.toString() || "",
      latitude: location.latitude?.toString() || "",
      longitude: location.longitude?.toString() || "",
      address: location.address || "",
    });
  };

  // Сохранение изменений
  const handleSave = async () => {
    if (!formData.name) {
      alert("Заполните обязательное поле: Название");
      return;
    }

    const payload = {
      name: formData.name,
      region_id: parseInt(formData.region_id) || null,
      city_id: parseInt(formData.city_id) || null,
      latitude: formData.latitude ? parseFloat(formData.latitude) : null,
      longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      address: formData.address || "",
    };

    try {
      const response = await $API.put(`geo/locations/${editingId}/`, payload);
      console.log("Location updated:", response.data);

      setLocations(
        locations.map((location) =>
          location.id === editingId ? response.data : location
        )
      );
      setEditingId(null);
      resetForm();
    } catch (error) {
      console.error(
        "Ошибка обновления локации:",
        error.response?.data || error
      );
      alert("Ошибка при обновлении локации");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setShowAddForm(false);
    resetForm();
  };

  // Удаление локации
  const handleDelete = async (id) => {
    if (!window.confirm("Вы уверены, что хотите удалить локацию?")) {
      return;
    }

    try {
      await $API.delete(`geo/locations/${id}/`);
      console.log("Location deleted:", id);

      setLocations(locations.filter((location) => location.id !== id));
    } catch (error) {
      console.error("Ошибка удаления локации:", error.response?.data || error);
      alert("Ошибка при удалении локации");
    }
  };

  const filteredLocations = locations.filter(
    (location) =>
      location.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.address?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      {/* <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Локации</h2>
          <p className="text-gray-600 mt-1">Управление локациями</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors shadow-md"
        >
          <Plus className="w-5 h-5" />
          Добавить локацию
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск по названию или адресу..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div> */}

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-2 border-green-500">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Новая локация
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Название <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Название локации"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID региона
              </label>
              <input
                type="number"
                value={formData.region_id}
                onChange={(e) => handleInputChange("region_id", e.target.value)}
                placeholder="Регион"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID города
              </label>
              <input
                type="number"
                value={formData.city_id}
                onChange={(e) => handleInputChange("city_id", e.target.value)}
                placeholder="Город"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Широта
              </label>
              <input
                type="number"
                step="0.000001"
                value={formData.latitude}
                onChange={(e) => handleInputChange("latitude", e.target.value)}
                placeholder="43.238949"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Долгота
              </label>
              <input
                type="number"
                step="0.000001"
                value={formData.longitude}
                onChange={(e) => handleInputChange("longitude", e.target.value)}
                placeholder="76.889709"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Адрес
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Полный адрес локации"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Сохранить
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
              Отмена
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Название
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Регион / Город
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Координаты
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Адрес
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredLocations.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center">
                  <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">
                    {searchQuery ? "Локации не найдены" : "Локаций пока нет"}
                  </p>
                </td>
              </tr>
            ) : (
              filteredLocations.map((location) => (
                <tr
                  key={location.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {editingId === location.id ? (
                    <>
                      <td className="px-6 py-4">
                        <span className="text-sm font-mono text-gray-600">
                          #{location.id}
                        </span>
                      </td>
                      <td className="px-6 py-4" colSpan="4">
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) =>
                              handleInputChange("name", e.target.value)
                            }
                            placeholder="Название"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="number"
                              value={formData.region_id}
                              onChange={(e) =>
                                handleInputChange("region_id", e.target.value)
                              }
                              placeholder="ID региона"
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                            />
                            <input
                              type="number"
                              value={formData.city_id}
                              onChange={(e) =>
                                handleInputChange("city_id", e.target.value)
                              }
                              placeholder="ID города"
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="number"
                              step="0.000001"
                              value={formData.latitude}
                              onChange={(e) =>
                                handleInputChange("latitude", e.target.value)
                              }
                              placeholder="Широта"
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                            />
                            <input
                              type="number"
                              step="0.000001"
                              value={formData.longitude}
                              onChange={(e) =>
                                handleInputChange("longitude", e.target.value)
                              }
                              placeholder="Долгота"
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                            />
                          </div>
                          <input
                            type="text"
                            value={formData.address}
                            onChange={(e) =>
                              handleInputChange("address", e.target.value)
                            }
                            placeholder="Адрес"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={handleSave}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Сохранить"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                            title="Отмена"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4">
                        <span className="text-sm font-mono text-gray-600">
                          #{location.id}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-green-100 p-2 rounded-lg">
                            <MapPin className="w-4 h-4 text-green-600" />
                          </div>
                          <span className="text-sm font-semibold text-gray-900">
                            {location.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-gray-600 space-y-1">
                          <div>Регион: {location.region_id || "—"}</div>
                          <div>Город: {location.city_id || "—"}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {location.latitude && location.longitude ? (
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Globe className="w-4 h-4 text-gray-400" />
                            <span className="font-mono">
                              {location.latitude?.toFixed(6)},{" "}
                              {location.longitude?.toFixed(6)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-gray-600 line-clamp-2">
                          {location.address || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(location)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Редактировать"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(location.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Удалить"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
