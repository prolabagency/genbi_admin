import { useEffect, useState } from "react";
import { Search, Plus, Globe, Map, MapPin, Navigation } from "lucide-react";
import { TabButton } from "../../components/locationManegment/TabButton";
import { CountriesTable } from "../../components/locationManegment/countriesTable";
import { RegionsTable } from "../../components/locationManegment/regionTable";
import { CitiesTable } from "../../components/locationManegment/citiesTable";
import { LocationModal } from "../../components/locationManegment/locationModal";
import Location from "../../components/locationManegment/locationTable";
import $API from "../../axios";

const LocationsPage = () => {
  const [activeTab, setActiveTab] = useState("countries");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [selectedItem, setSelectedItem] = useState(null);

  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);
  const [locations, setLocations] = useState([]); // <- было setLocation

  useEffect(() => {
    Promise.all([
      $API.get("geo/countries/"),
      $API.get("geo/regions/"),
      $API.get("geo/cities/"),
      $API.get("geo/locations/"),
    ])
      .then(([countriesRes, regionsRes, citiesRes, locationsRes]) => {
        setCountries(countriesRes.data || []);
        setRegions(regionsRes.data || []);
        setCities(citiesRes.data || []);
        setLocations(locationsRes.data || []); // <- .data ОБЯЗАТЕЛЬНО
      })
      .catch((err) => {
        console.error("Ошибка загрузки локаций:", err);
        setCountries([]);
        setRegions([]);
        setCities([]);
        setLocations([]);
      });
  }, []);

  const openModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleEdit = (item) => {
    openModal("edit", item);
  };

  const handleDelete = (id, type) => {
    const userConfirmed = window.confirm("Вы уверены, что хотите удалить?");
    if (!userConfirmed) return;

    let endpoint = "";
    switch (type) {
      case "countries":
        endpoint = `geo/countries/${id}/`;
        setCountries((prev) => prev.filter((u) => String(u.id) !== String(id)));
        break;
      case "regions":
        endpoint = `geo/regions/${id}/`;
        setRegions((prev) => prev.filter((u) => String(u.id) !== String(id)));
        break;
      case "cities":
        endpoint = `geo/cities/${id}/`;
        setCities((prev) => prev.filter((u) => String(u.id) !== String(id)));
        break;
      case "location":
        endpoint = `geo/locations/${id}/`;
        setLocations((prev) => prev.filter((u) => String(u.id) !== String(id)));
        break;
      default:
        return;
    }

    $API
      .delete(endpoint)
      .then(() => {
        console.log("Удалено успешно");
      })
      .catch((error) => {
        console.error("Ошибка удаления:", error);
      });
  };

  const handleSuccess = (data, type) => {
    // type: "add" | "edit"
    if (type === "add") {
      switch (activeTab) {
        case "countries":
          setCountries((prev) => [...prev, data]);
          break;
        case "regions":
          setRegions((prev) => [...prev, data]);
          break;
        case "cities":
          setCities((prev) => [...prev, data]);
          break;
        case "location":
          setLocations((prev) => [...prev, data]);
          break;
        default:
          break;
      }
      setShowModal(false);
    } else {
      switch (activeTab) {
        case "countries":
          setCountries((prev) =>
            prev.map((item) => (item.id === data.id ? data : item))
          );
          break;
        case "regions":
          setRegions((prev) =>
            prev.map((item) => (item.id === data.id ? data : item))
          );
          break;
        case "cities":
          setCities((prev) =>
            prev.map((item) => (item.id === data.id ? data : item))
          );
          break;
        case "location":
          setLocations((prev) =>
            prev.map((item) => (item.id === data.id ? data : item))
          ); // <- здесь раньше не было return
          break;
        default:
          break;
      }
      setShowModal(false);
    }
  };

  // текст в поиске и кнопке под таб
  const currentEntityName =
    activeTab === "countries"
      ? "стран"
      : activeTab === "regions"
      ? "регионов"
      : activeTab === "cities"
      ? "городов"
      : "локаций";

  const currentEntitySingle =
    activeTab === "countries"
      ? "страну"
      : activeTab === "regions"
      ? "регион"
      : activeTab === "cities"
      ? "город"
      : "локацию";

  // фильтрация для таба location (по name / description)
  const filteredLocations =
    activeTab === "location"
      ? locations.filter((loc) => {
          const q = searchTerm.toLowerCase();
          return (
            (loc.name || "").toLowerCase().includes(q) ||
            (loc.description || "").toLowerCase().includes(q)
          );
        })
      : locations;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Управление локациями
          </h1>
          <p className="text-gray-600">
            Управляйте странами, регионами, городами и точечными локациями
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200 flex items-center justify-between px-6">
            <div className="flex">
              <TabButton
                id="countries"
                label="Страны"
                icon={Globe}
                activeTab={activeTab}
                onClick={setActiveTab}
              />
              <TabButton
                id="regions"
                label="Регионы"
                icon={Map}
                activeTab={activeTab}
                onClick={setActiveTab}
              />
              <TabButton
                id="cities"
                label="Города"
                icon={MapPin}
                activeTab={activeTab}
                onClick={setActiveTab}
              />
              <TabButton
                id="location"
                label="Локации"
                icon={Navigation}
                activeTab={activeTab}
                onClick={setActiveTab}
              />
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="relative flex-1 max-w-md">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder={`Поиск ${currentEntityName}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => openModal("add")}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Plus size={20} />
                Добавить {currentEntitySingle}
              </button>
            </div>

            {activeTab === "countries" && (
              <CountriesTable
                countries={countries}
                onEdit={handleEdit}
                onDelete={(id) => handleDelete(id, "countries")}
              />
            )}
            {activeTab === "regions" && (
              <RegionsTable
                regions={regions}
                onEdit={handleEdit}
                valueSelector={countries}
                onDelete={(id) => handleDelete(id, "regions")}
              />
            )}
            {activeTab === "cities" && (
              <CitiesTable
                cities={cities}
                onEdit={handleEdit}
                onDelete={(id) => handleDelete(id, "cities")}
              />
            )}

            {activeTab === "location" && (
              <Location
                locations={filteredLocations}
                cities={cities}
                onEdit={handleEdit}
                onDelete={(id) => handleDelete(id, "location")}
              />
            )}
          </div>
        </div>
      </div>

      <LocationModal
        show={showModal}
        type={modalType}
        activeTab={activeTab}
        selectedItem={selectedItem}
        onClose={() => setShowModal(false)}
        onSuccess={handleSuccess}
        cities={cities}
      />
    </div>
  );
};

export default LocationsPage;
