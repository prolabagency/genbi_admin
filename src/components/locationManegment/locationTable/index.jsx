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
  Upload,
  XCircle,
  Camera,
  MousePointer,
} from "lucide-react";
import { $API } from "../../../axios";

// Моковые данные для демонстрации (замените на реальные данные из props)
const mockLocations = [
  {
    id: 1,
    name: "Центральный парк",
    region_id: 5,
    city_id: 12,
    latitude: 43.238949,
    longitude: 76.889709,
    address: "ул. Абая 150, Алматы",
    photos: [
      "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=400",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
    ],
  },
  {
    id: 2,
    name: "Горный курорт Шымбулак",
    region_id: 5,
    city_id: 12,
    latitude: 43.129444,
    longitude: 77.066667,
    address: "Медеу, Алматы",
    photos: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
    ],
  },
];

export default function LocationsTab({
  locations: propsLocations,
  setLocations: propsSetLocations,
}) {
  const [locations, setLocations] = useState(propsLocations || mockLocations);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [viewPhotos, setViewPhotos] = useState(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [pickMode, setPickMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    region_id: "",
    city_id: "",
    latitude: "",
    longitude: "",
    address: "",
    photos: [],
  });

  const updateLocations = propsSetLocations || setLocations;

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);

    // В реальном приложении здесь должна быть загрузка на сервер
    // Пока используем локальные URL для превью
    const photoUrls = files.map((file) => URL.createObjectURL(file));

    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, ...photoUrls],
    }));
  };

  const removePhoto = (index) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      region_id: "",
      city_id: "",
      latitude: "",
      longitude: "",
      address: "",
      photos: [],
    });
    setPickMode(false);
  };

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
      photos: formData.photos || [],
    };

    try {
      const response = await $API.post("geo/locations/", payload);
      updateLocations([response.data, ...locations]);
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

  const handleEdit = (location) => {
    setEditingId(location.id);
    setFormData({
      name: location.name || "",
      region_id: location.region_id?.toString() || "",
      city_id: location.city_id?.toString() || "",
      latitude: location.latitude?.toString() || "",
      longitude: location.longitude?.toString() || "",
      address: location.address || "",
      photos: location.photos || [],
    });
    setSelectedLocation(location);
  };

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
      photos: formData.photos || [],
    };

    try {
      const response = await $API.put(`geo/locations/${editingId}/`, payload);
      updateLocations(
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

  const handleDelete = async (id) => {
    if (!window.confirm("Вы уверены, что хотите удалить локацию?")) {
      return;
    }

    try {
      await $API.delete(`geo/locations/${id}/`);
      updateLocations(locations.filter((location) => location.id !== id));
    } catch (error) {
      console.error("Ошибка удаления локации:", error.response?.data || error);
      alert("Ошибка при удалении локации");
    }
  };

  const handleMapClick = (e) => {
    if (!pickMode) return;

    // Получаем координаты клика на iframe (примерная реализация)
    // В реальности нужно использовать Leaflet или другую библиотеку карт
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Это примерная формула, в реальности нужно точное преобразование
    const width = rect.width;
    const height = rect.height;

    if (selectedLocation?.latitude && selectedLocation?.longitude) {
      const latDelta = 0.02;
      const lngDelta = 0.02;

      const lat = selectedLocation.latitude + (0.5 - y / height) * latDelta;
      const lng = selectedLocation.longitude + (x / width - 0.5) * lngDelta;

      setFormData((prev) => ({
        ...prev,
        latitude: lat.toFixed(6),
        longitude: lng.toFixed(6),
      }));
    }
  };

  const filteredLocations = locations.filter(
    (location) =>
      location.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.address?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Основной контент */}
      <div className="flex-1 flex overflow-hidden">
        {/* Левая панель - Список локаций */}
        <div className="w-1/2 overflow-y-auto p-6 space-y-4">
          {/* Форма добавления */}
          {showAddForm && (
            <div className="bg-white rounded-lg shadow-md p-6 border-2 border-green-500">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Новая локация
              </h3>
              <div className="space-y-4">
                <div>
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ID региона
                    </label>
                    <input
                      type="number"
                      value={formData.region_id}
                      onChange={(e) =>
                        handleInputChange("region_id", e.target.value)
                      }
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
                      onChange={(e) =>
                        handleInputChange("city_id", e.target.value)
                      }
                      placeholder="Город"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Широта
                    </label>
                    <input
                      type="number"
                      step="0.000001"
                      value={formData.latitude}
                      onChange={(e) =>
                        handleInputChange("latitude", e.target.value)
                      }
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
                      onChange={(e) =>
                        handleInputChange("longitude", e.target.value)
                      }
                      placeholder="76.889709"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Адрес
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    placeholder="Полный адрес локации"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Загрузка фото */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Фотографии
                  </label>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">
                      <Upload className="w-4 h-4" />
                      Загрузить фото
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                    <span className="text-sm text-gray-500">
                      {formData.photos.length} фото
                    </span>
                  </div>
                  {formData.photos.length > 0 && (
                    <div className="mt-3 grid grid-cols-4 gap-2">
                      {formData.photos.map((photo, idx) => (
                        <div key={idx} className="relative group">
                          <img
                            src={photo}
                            alt={`Photo ${idx + 1}`}
                            className="w-full h-20 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => removePhoto(idx)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-3 mt-6">
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

          {/* Список карточек локаций */}
          {filteredLocations.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">
                {searchQuery ? "Локации не найдены" : "Локаций пока нет"}
              </p>
            </div>
          ) : (
            filteredLocations.map((location) => (
              <div
                key={location.id}
                className={`bg-white rounded-lg shadow-sm p-6 cursor-pointer transition-all hover:shadow-md ${
                  selectedLocation?.id === location.id
                    ? "ring-2 ring-green-500"
                    : ""
                }`}
                onClick={() => setSelectedLocation(location)}
              >
                {editingId === location.id ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="Название"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        value={formData.region_id}
                        onChange={(e) =>
                          handleInputChange("region_id", e.target.value)
                        }
                        placeholder="ID региона"
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      <input
                        type="number"
                        value={formData.city_id}
                        onChange={(e) =>
                          handleInputChange("city_id", e.target.value)
                        }
                        placeholder="ID города"
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      <input
                        type="number"
                        step="0.000001"
                        value={formData.longitude}
                        onChange={(e) =>
                          handleInputChange("longitude", e.target.value)
                        }
                        placeholder="Долгота"
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      placeholder="Адрес"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />

                    {/* Загрузка фото в режиме редактирования */}
                    <div>
                      <label className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer w-fit">
                        <Upload className="w-4 h-4" />
                        Добавить фото
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                      {formData.photos.length > 0 && (
                        <div className="mt-3 grid grid-cols-4 gap-2">
                          {formData.photos.map((photo, idx) => (
                            <div key={idx} className="relative group">
                              <img
                                src={photo}
                                alt={`Photo ${idx + 1}`}
                                className="w-full h-20 object-cover rounded-lg"
                              />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removePhoto(idx);
                                }}
                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSave();
                        }}
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        Сохранить
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancel();
                        }}
                        className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Отмена
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-3 rounded-lg">
                          <MapPin className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {location.name}
                          </h3>
                          <span className="text-xs font-mono text-gray-500">
                            ID: {location.id}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(location);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Редактировать"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(location.id);
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Удалить"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-400" />
                        {location.latitude && location.longitude ? (
                          <span className="font-mono">
                            {location.latitude.toFixed(6)},{" "}
                            {location.longitude.toFixed(6)}
                          </span>
                        ) : (
                          <span className="text-gray-400">
                            Координаты не указаны
                          </span>
                        )}
                      </div>
                      <div className="text-gray-600">
                        Регион: {location.region_id || "—"} | Город:{" "}
                        {location.city_id || "—"}
                      </div>
                      {location.address && (
                        <div className="text-gray-600">{location.address}</div>
                      )}
                      {location.photos && location.photos.length > 0 && (
                        <div className="pt-3 border-t border-gray-100">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewPhotos(location.photos);
                              setSelectedPhotoIndex(0);
                            }}
                            className="flex items-center gap-2 text-green-600 hover:text-green-700"
                          >
                            <Camera className="w-4 h-4" />
                            Просмотреть фото ({location.photos.length})
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>

        {/* Правая панель - Карта */}
        <div className="w-1/2 bg-gray-100 p-6">
          <div className="bg-white rounded-lg shadow-md h-full flex flex-col overflow-hidden">
            {/* Контролы карты */}
            {(editingId || showAddForm) && (
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <button
                  onClick={() => setPickMode(!pickMode)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pickMode
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  <MousePointer className="w-4 h-4" />
                  {pickMode ? "Режим выбора включён" : "Выбрать на карте"}
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  {pickMode
                    ? "Кликните по карте, чтобы установить координаты"
                    : "Включите режим выбора для установки координат"}
                </p>
              </div>
            )}

            {/* Карта */}
            <div className="flex-1 relative">
              {selectedLocation?.latitude && selectedLocation?.longitude ? (
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ border: 0 }}
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                    selectedLocation.longitude - 0.01
                  },${selectedLocation.latitude - 0.01},${
                    selectedLocation.longitude + 0.01
                  },${selectedLocation.latitude + 0.01}&layer=mapnik&marker=${
                    selectedLocation.latitude
                  },${selectedLocation.longitude}`}
                  allowFullScreen
                  onClick={handleMapClick}
                ></iframe>
              ) : formData.latitude && formData.longitude ? (
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ border: 0 }}
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                    parseFloat(formData.longitude) - 0.01
                  },${parseFloat(formData.latitude) - 0.01},${
                    parseFloat(formData.longitude) + 0.01
                  },${
                    parseFloat(formData.latitude) + 0.01
                  }&layer=mapnik&marker=${formData.latitude},${
                    formData.longitude
                  }`}
                  allowFullScreen
                  onClick={handleMapClick}
                ></iframe>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">
                      Выберите локацию или введите координаты
                    </p>
                    <p className="text-sm mt-2">Карта появится здесь</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Модальное окно просмотра фотографий */}
      {viewPhotos && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Фотографии ({selectedPhotoIndex + 1} / {viewPhotos.length})
              </h3>
              <button
                onClick={() => {
                  setViewPhotos(null);
                  setSelectedPhotoIndex(0);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <img
                src={viewPhotos[selectedPhotoIndex]}
                alt={`Photo ${selectedPhotoIndex + 1}`}
                className="w-full h-96 object-contain rounded-lg mb-4"
              />
              <div className="flex gap-2 overflow-x-auto pb-2">
                {viewPhotos.map((photo, idx) => (
                  <img
                    key={idx}
                    src={photo}
                    alt={`Thumbnail ${idx + 1}`}
                    onClick={() => setSelectedPhotoIndex(idx)}
                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer transition-all ${
                      selectedPhotoIndex === idx
                        ? "ring-2 ring-green-500 scale-105"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
