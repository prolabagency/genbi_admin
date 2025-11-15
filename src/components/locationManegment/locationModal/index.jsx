import { useState, useEffect } from "react";
import $API from "../../../axios";

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
  });

  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  useEffect(() => {
    if (show && type === "edit" && selectedItem) {
      setFormData({
        name: selectedItem.name || "",
        alpha2_code: selectedItem.alpha2_code || "",
        country_id: selectedItem.country?.id || "",
        region_id: selectedItem.region?.id || "",
        population: selectedItem.population || "",
      });
    } else if (show && type === "add") {
      setFormData({
        name: "",
        alpha2_code: "",
        country_id: "",
        region_id: "",
        population: "",
      });
    }
  }, [show, type, selectedItem]);

  if (!show) return null;

  const getEndpoint = () => {
    const endpoints = {
      countries: "geo/countries/",
      regions: "geo/regions/",
      cities: "geo/cities/",
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
          country_id: parseInt(formData.country_id),
        };
      }

      if (activeTab === "cities") {
        submitData = {
          name: formData.name,
          region_id: parseInt(formData.region_id),
          population: formData.population,
        };
      }

      if (activeTab === "countries") {
        submitData = {
          name: formData.name,
          alpha2_code: formData.alpha2_code.toUpperCase(),
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {type === "add" ? "Добавить" : "Редактировать"}{" "}
          {activeTab === "countries"
            ? "страну"
            : activeTab === "regions"
            ? "регион"
            : "город"}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
