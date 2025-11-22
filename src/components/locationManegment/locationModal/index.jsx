import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Фикс для иконок маркеров Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function LocationPickerMap({ latitude, longitude, onChange, pickMode }) {
  const hasPoint = latitude !== "" && longitude !== "";
  const center = hasPoint ? [Number(latitude), Number(longitude)] : [20, 0];

  function ClickHandler() {
    useMapEvents({
      click(e) {
        if (!pickMode) return;
        onChange(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  }

  return (
    <MapContainer
      center={center}
      zoom={hasPoint ? 8 : 3}
      style={{
        height: "350px",
        width: "100%",
        borderRadius: "0.75rem",
        zIndex: 0,
      }}
      scrollWheelZoom={true}
      worldCopyJump={true}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickHandler />
      {hasPoint && <Marker position={[Number(latitude), Number(longitude)]} />}
    </MapContainer>
  );
}

export const LocationModal = ({
  show,
  type,
  activeTab,
  selectedItem,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    alpha2_code: "",
    country_id: "",
    region_id: "",
    population: "",
    city_id: "",
    description: "",
    type: "mountain",
    latitude: "",
    longitude: "",
    photos: [],
  });

  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pickMode, setPickMode] = useState(false);
  const [photoPreview, setPhotoPreview] = useState([]);

  useEffect(() => {
    if (show && activeTab === "regions") {
      fetch("/geo/countries/")
        .then((response) => response.json())
        .then((data) => {
          console.log("Страны загружены:", data);
          setCountries(data);
        })
        .catch((error) => console.error("Ошибка загрузки стран:", error));
    }
  }, [show, activeTab]);

  useEffect(() => {
    if (show && activeTab === "cities") {
      fetch("/geo/regions/")
        .then((response) => response.json())
        .then((data) => {
          console.log("Регионы загружены:", data);
          setRegions(data);
        })
        .catch((error) => console.error("Ошибка загрузки регионов:", error));
    }
  }, [show, activeTab]);

  useEffect(() => {
    if (show && activeTab === "location") {
      Promise.all([
        fetch("/geo/cities/").then((r) => r.json()),
        fetch("/catalog/companies/")
          .then((r) => r.json())
          .catch(() => []),
        fetch("/catalog/tours/")
          .then((r) => r.json())
          .catch(() => []),
      ])
        .then(([citiesData, companiesData, toursData]) => {
          console.log("Данные загружены:", {
            citiesData,
            companiesData,
            toursData,
          });
          setCities(citiesData || []);
          setCompanies(companiesData || []);
          setTours(toursData || []);
        })
        .catch((error) => console.error("Ошибка загрузки данных:", error));
    }
  }, [show, activeTab]);

  useEffect(() => {
    if (show && type === "edit" && selectedItem) {
      setFormData((prev) => ({
        ...prev,
        name: selectedItem.name || "",
        alpha2_code: selectedItem.alpha2_code || "",
        country_id: selectedItem.country?.id || "",
        region_id: selectedItem.region?.id || "",
        population: selectedItem.population || "",
        city_id: selectedItem.city_id || selectedItem.city?.id || "",
        description: selectedItem.description || "",
        type: selectedItem.type || "mountain",
        latitude:
          selectedItem.latitude !== undefined && selectedItem.latitude !== null
            ? selectedItem.latitude
            : "",
        longitude:
          selectedItem.longitude !== undefined &&
          selectedItem.longitude !== null
            ? selectedItem.longitude
            : "",
      }));
    } else if (show && type === "add") {
      setFormData({
        name: "",
        alpha2_code: "",
        country_id: "",
        region_id: "",
        population: "",
        city_id: "",
        description: "",
        type: "mountain",
        latitude: "",
        longitude: "",
        photos: [],
      });
      setPhotoPreview([]);
    }
  }, [show, type, selectedItem]);

  if (!show) return null;

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, photos: files }));

    const previews = files.map((file) => URL.createObjectURL(file));
    setPhotoPreview(previews);
  };

  const removePhoto = (index) => {
    const newPhotos = [...formData.photos];
    newPhotos.splice(index, 1);
    setFormData((prev) => ({ ...prev, photos: newPhotos }));

    const newPreviews = [...photoPreview];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setPhotoPreview(newPreviews);
  };

  const getEndpoint = () => {
    const endpoints = {
      countries: "/geo/countries/",
      regions: "/geo/regions/",
      cities: "/geo/cities/",
      location: "/catalog/tour/locations/", 
    };
    return endpoints[activeTab];
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      let endpoint = "";
      let submitData = {};

      // Подготовка данных в зависимости от типа
      if (activeTab === "countries") {
        endpoint =
          type === "add"
            ? "/geo/countries/"
            : `/geo/countries/${selectedItem.id}/`;
        submitData = {
          name: formData.name,
          alpha2_code: formData.alpha2_code.toUpperCase(),
        };
      } else if (activeTab === "regions") {
        endpoint =
          type === "add" ? "/geo/regions/" : `/geo/regions/${selectedItem.id}/`;
        submitData = {
          name: formData.name,
          country_id: parseInt(formData.country_id, 10),
        };
      } else if (activeTab === "cities") {
        endpoint =
          type === "add" ? "/geo/cities/" : `/geo/cities/${selectedItem.id}/`;
        submitData = {
          name: formData.name,
          region_id: parseInt(formData.region_id, 10),
          population: formData.population,
        };
      } else if (activeTab === "location") {
        // Для локации ВСЕГДА используем POST на /catalog/tour/locations/
        endpoint = "/catalog/tour/locations/";

        const formDataToSend = new FormData();
        formDataToSend.append("city_id", parseInt(formData.city_id, 10));
        formDataToSend.append("name", formData.name);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("type", formData.type);
        formDataToSend.append("latitude", parseFloat(formData.latitude));
        formDataToSend.append("longitude", parseFloat(formData.longitude));

        // Добавляем фотографии
        formData.photos.forEach((photo) => {
          formDataToSend.append("photos", photo);
        });

        console.log("Отправка на:", endpoint);
        console.log("Данные:", {
          city_id: parseInt(formData.city_id, 10),
          name: formData.name,
          description: formData.description,
          type: formData.type,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
          photos: formData.photos.length,
        });

        const response = await fetch(endpoint, {
          method: "POST",
          body: formDataToSend,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.detail ||
              `Ошибка ${response.status}: ${response.statusText}`
          );
        }

        const data = await response.json();
        onSuccess(data, type);
        onClose();
        setLoading(false);
        return;
      }

      // Для остальных типов (без файлов) - обычный JSON
      const response = await fetch(endpoint, {
        method: type === "add" ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      console.log("Ответ сервера:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail ||
            `Ошибка ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();
      onSuccess(data, type);
      onClose();
    } catch (err) {
      console.error("Ошибка:", err);
      setError(err.message || "Произошла ошибка при сохранении");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const title =
    activeTab === "countries"
      ? type === "add"
        ? "Добавить страну"
        : "Редактировать страну"
      : activeTab === "regions"
      ? type === "add"
        ? "Добавить регион"
        : "Редактировать регион"
      : activeTab === "cities"
      ? type === "add"
        ? "Добавить город"
        : "Редактировать город"
      : type === "add"
      ? "Добавить локацию"
      : "Редактировать локацию";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold">{title}</h2>
        </div>

        <div className="overflow-y-auto flex-1 p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Название
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Введите название"
              />
            </div>

            {activeTab === "countries" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Код страны
                </label>
                <input
                  type="text"
                  name="alpha2_code"
                  value={formData.alpha2_code}
                  onChange={handleChange}
                  maxLength={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                  placeholder="Например: KGZ"
                />
              </div>
            )}

            {activeTab === "regions" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Страна <span className="text-red-500">*</span>
                </label>
                <select
                  name="country_id"
                  value={formData.country_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Выберите страну</option>
                  {countries.map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.name} ({country.alpha2_code})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {activeTab === "cities" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Регион <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="region_id"
                    value={formData.region_id}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Выберите регион</option>
                    {regions.map((region) => (
                      <option key={region.id} value={region.id}>
                        {region.name} ({region.country?.name})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Население
                  </label>
                  <input
                    type="text"
                    name="population"
                    value={formData.population}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Например: 1.1M"
                  />
                </div>
              </>
            )}

            {activeTab === "location" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Город <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="city_id"
                    value={formData.city_id}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Выберите город</option>
                    {cities.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {cities.length === 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      Загрузка городов...
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Компания (опционально)
                  </label>
                  <select
                    name="company_id"
                    value={formData.company_id || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Не выбрано</option>
                    {companies.map((comp) => (
                      <option key={comp.id} value={comp.id}>
                        {comp.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Тур (опционально)
                  </label>
                  <select
                    name="tour_id"
                    value={formData.tour_id || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Не выбрано</option>
                    {tours.map((tour) => (
                      <option key={tour.id} value={tour.id}>
                        {tour.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Описание
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Краткое описание локации..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Тип локации
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="mountain">Горы</option>
                    <option value="lake">Озеро</option>
                    <option value="sea">Море</option>
                    <option value="desert">Пустыня</option>
                    <option value="nature">Природа</option>
                    <option value="cultural">Культурный объект</option>
                    <option value="city">В городе</option>
                    <option value="other">Другое</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Фотографии
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {photoPreview.length > 0 && (
                    <div className="mt-3 grid grid-cols-3 gap-3">
                      {photoPreview.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Широта
                    </label>
                    <input
                      type="number"
                      step="0.000001"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Долгота
                    </label>
                    <input
                      type="number"
                      step="0.000001"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => setPickMode((prev) => !prev)}
                      className={`w-full px-3 py-2 rounded-lg font-medium border transition-colors ${
                        pickMode
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {pickMode ? "✓ Выбор включён" : "Выбрать на карте"}
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-2">
                    {pickMode
                      ? "Кликните на карту, чтобы установить координаты"
                      : "Включите режим выбора, чтобы установить точку на карте"}
                  </p>
                  <LocationPickerMap
                    latitude={formData.latitude}
                    longitude={formData.longitude}
                    pickMode={pickMode}
                    onChange={(lat, lng) =>
                      setFormData((prev) => ({
                        ...prev,
                        latitude: lat.toFixed(6),
                        longitude: lng.toFixed(6),
                      }))
                    }
                  />
                </div>
              </>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              Отмена
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
