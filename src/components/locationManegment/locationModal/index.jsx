import { useState, useEffect } from "react";
import $API from "../../../axios";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

function LocationPickerMap({ latitude, longitude, onChange, pickMode }) {
  const hasPoint = latitude !== "" && longitude !== "";
  const center = hasPoint ? [Number(latitude), Number(longitude)] : [20, 0]; // центр мира

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
        height: "450px",
        width: "100%",
        borderRadius: "0.75rem",
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
    // countries
    name: "",
    alpha2_code: "",
    // regions
    country_id: "",
    // cities
    region_id: "",
    population: "",
    // locations
    city_id: "",
    description: "",
    type: "mountain",
    latitude: "",
    longitude: "",
  });

  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pickMode, setPickMode] = useState(false);

  // 🔹 подгружаем страны для регионов
  useEffect(() => {
    if (show && activeTab === "regions") {
      $API
        .get("geo/countries/")
        .then((response) => {
          setCountries(response.data);
        })
        .catch((error) => {
          console.error("Ошибка загрузки стран:", error);
        });
    }
  }, [show, activeTab]);

  // 🔹 подгружаем регионы для городов
  useEffect(() => {
    if (show && activeTab === "cities") {
      $API
        .get("geo/regions/")
        .then((response) => {
          setRegions(response.data);
        })
        .catch((error) => {
          console.error("Ошибка загрузки регионов:", error);
        });
    }
  }, [show, activeTab]);

  // 🔹 подгружаем города для локаций
  useEffect(() => {
    if (show && activeTab === "location") {
      $API
        .get("geo/cities/")
        .then((response) => {
          setCities(response.data);
        })
        .catch((error) => {
          console.error("Ошибка загрузки городов:", error);
        });
    }
  }, [show, activeTab]);

  // 🔹 заполнение формы при edit / очистка при add
  useEffect(() => {
    if (show && type === "edit" && selectedItem) {
      setFormData((prev) => ({
        ...prev,
        name: selectedItem.name || "",
        alpha2_code: selectedItem.alpha2_code || "",
        country_id: selectedItem.country?.id || "",
        region_id: selectedItem.region?.id || "",
        population: selectedItem.population || "",
        // для location:
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
      });
    }
  }, [show, type, selectedItem]);

  if (!show) return null;

  const getEndpoint = () => {
    const endpoints = {
      countries: "geo/countries/",
      regions: "geo/regions/",
      cities: "geo/cities/",
      location: "geo/locations/",
    };
    return endpoints[activeTab];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let response;
      const endpoint = getEndpoint();

      let submitData = { ...formData };

      if (activeTab === "regions") {
        submitData = {
          name: formData.name,
          country_id: parseInt(formData.country_id, 10),
        };
      }

      if (activeTab === "cities") {
        submitData = {
          name: formData.name,
          region_id: parseInt(formData.region_id, 10),
          population: formData.population,
        };
      }

      if (activeTab === "countries") {
        submitData = {
          name: formData.name,
          alpha2_code: formData.alpha2_code.toUpperCase(),
        };
      }

      if (activeTab === "location") {
        submitData = {
          city_id: parseInt(formData.city_id, 10),
          name: formData.name,
          description: formData.description,
          type: formData.type,
          latitude: Number(formData.latitude),
          longitude: Number(formData.longitude),
        };
      }

      if (type === "add") {
        response = await $API.post(endpoint, submitData);
      } else {
        response = await $API.put(`${endpoint}${selectedItem.id}/`, submitData);
      }

      if (response.status === 200 || response.status === 201) {
        onSuccess(response.data, type);
        onClose();
      }
    } catch (err) {
      console.error("Ошибка:", err);

      if (err.response) {
        let serverError = "Произошла ошибка при сохранении";

        const data = err.response.data;

        if (Array.isArray(data.detail)) {
          serverError = data.detail[0]?.msg || serverError;
        } else if (typeof data.detail === "string") {
          serverError = data.detail;
        } else if (data.message) {
          serverError = data.message;
        }

        setError(serverError);
      } else {
        setError("Произошла ошибка при соединении с сервером");
      }
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
      : // 🔹 для локации
      type === "add"
      ? "Добавить локацию"
      : "Редактировать локацию";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl">
        <h2 className="text-xl font-bold mb-4">{title}</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 🔹 ОБЩЕЕ ПОЛЕ: Название */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Название
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Введите название"
            />
          </div>

          {/* ✅ БЛОКИ ДЛЯ РАЗНЫХ ТАБОВ */}

          {/* Countries */}
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
                required
                maxLength={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                placeholder="Например: KGZ"
              />
            </div>
          )}

          {/* Regions */}
          {activeTab === "regions" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Страна <span className="text-red-500">*</span>
              </label>
              <select
                name="country_id"
                value={formData.country_id}
                onChange={handleChange}
                required
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

          {/* Cities */}
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
                  required
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
                  Город (city_id) <span className="text-red-500">*</span>
                </label>
                <select
                  name="city_id"
                  value={formData.city_id}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                >
                  <option value="">Выберите город</option>
                  {cities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                  placeholder="Краткое описание локации..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Тип
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Широта (latitude)
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Долгота (longitude)
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500">
                    Режим выбора точки на карте
                  </span>
                  <button
                    type="button"
                    onClick={() => setPickMode((prev) => !prev)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium border ${
                      pickMode
                        ? "bg-blue-50 text-blue-700 border-blue-300"
                        : "bg-gray-50 text-gray-600 border-gray-300"
                    }`}
                  >
                    {pickMode
                      ? "Выбор включён"
                      : "Нажми, чтобы выбрать на карте"}
                  </button>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">
                  При включённом режиме выбора клик по карте обновит
                  latitude/longitude. В остальное время карта только для
                  навигации и зума.
                </p>
                <LocationPickerMap
                  latitude={formData.latitude}
                  longitude={formData.longitude}
                  pickMode={pickMode}
                  onChange={(lat, lng) =>
                    setFormData((prev) => ({
                      ...prev,
                      latitude: lat,
                      longitude: lng,
                    }))
                  }
                />
              </div>
            </>
          )}

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
