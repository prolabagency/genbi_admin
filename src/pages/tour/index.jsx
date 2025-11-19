import React, { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  MoreVertical,
  Filter,
  ChevronDown,
  Mountain,
  Tent,
  Sailboat,
  ChessKnight,
  Heart,
  PersonStanding,
  Footprints,
  Trees,
  Users,
} from "lucide-react";
import $API from "../../axios";

// Маппинг типов путешествий → SVG-иконки из lucide-react
export const TRAVEL_TYPE_ICON_MAP = {
  // пешие / трекинг
  hiking: Footprints,
  trekking: Footprints,
  walking: Footprints,

  // горные / природа / кемпинг
  mountain: Mountain,
  nature: Trees,
  forest: Trees,
  camping: Tent,

  // конные туры
  horse: ChessKnight,

  // лодки / яхты / круизы
  boat: Sailboat,
  sailing: Sailboat,
  cruise: Sailboat,

  // для пар
  couple: Heart,
  romantic: Heart,

  // для одиночек
  solo: PersonStanding,

  // семейные
  family: Users,
};

// Универсальный компонент иконки по типу
export function TravelTypeIcon({ type, className }) {
  if (!type) return null;
  const Icon = TRAVEL_TYPE_ICON_MAP[type] || Mountain; // дефолтная иконка
  return <Icon className={className} />;
}

export default function ToursAdmin() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTours, setSelectedTours] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tourData, setTourData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [errorsForm, setErrorsForm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category_id: "",
    company_id: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorsForm("");

    try {
      await $API.post("catalog/tours/", formData);

      setIsModalOpen(false);
      setFormData({
        name: "",
        description: "",
        category_id: "",
        company_id: "",
      });
    } catch (error) {
      console.error(error);
      setErrorsForm("К сожалению, вы допустили какую-то ошибку в форме");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    $API.get("catalog/tours/").then((response) => {
      setTourData(response.data);
    });
  }, []);

  useEffect(() => {
    $API.get("catalog/categories/").then((response) => {
      setCategories(response.data);
    });
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return {
          text: "Активен",
          class: "bg-green-50 text-green-700 border-green-200",
        };
      case "draft":
        return {
          text: "Черновик",
          class: "bg-gray-50 text-gray-700 border-gray-200",
        };
      case "full":
        return {
          text: "Заполнен",
          class: "bg-blue-50 text-blue-700 border-blue-200",
        };
      case "archived":
        return {
          text: "Архив",
          class: "bg-red-50 text-red-700 border-red-200",
        };
      default:
        return {
          text: status,
          class: "bg-gray-50 text-gray-700 border-gray-200",
        };
    }
  };

  const filteredTours = tourData.filter((tour) => {
    const matchesSearch =
      (tour.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tour.destination || "")
        .toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || tour.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleSelectAll = () => {
    if (selectedTours.length === filteredTours.length) {
      setSelectedTours([]);
    } else {
      setSelectedTours(filteredTours.map((t) => t.id));
    }
  };

  const toggleSelect = (id) => {
    setSelectedTours((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectedCategory = categories.find(
    (cat) => String(cat.id) === String(formData.category_id)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Туры</h1>
              <p className="mt-1 text-sm text-gray-500">
                Управление турами и направлениями
              </p>
            </div>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus size={18} />
              Добавить тур
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Controls */}
        <div className="bg-white rounded border mb-6">
          <div className="p-4 flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Поиск..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white min-w-[150px]"
            >
              <option value="all">Все статусы</option>
              <option value="active">Активные</option>
              <option value="draft">Черновики</option>
              <option value="full">Заполненные</option>
              <option value="archived">Архив</option>
            </select>
            <button className="flex items-center gap-2 px-3 py-2 text-sm border rounded hover:bg-gray-50 transition-colors">
              <Filter size={18} />
              Фильтры
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="w-12 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={
                        selectedTours.length === filteredTours.length &&
                        filteredTours.length > 0
                      }
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Название
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Направление
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Длительность
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата старта
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Участники
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Цена
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="w-12 px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTours.map((tour) => {
                  const status = getStatusBadge(tour.status);
                  return (
                    <tr
                      key={tour.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedTours.includes(tour.id)}
                          onChange={() => toggleSelect(tour.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {/* Иконка тура по типу категории (если есть) */}
                          {tour.category?.icon && (
                            <TravelTypeIcon
                              type={tour.category.icon}
                              className="w-4 h-4 text-blue-600"
                            />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {tour.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              ID: {tour.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {tour.destination}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {tour.duration}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {tour.startDate
                          ? new Date(tour.startDate).toLocaleDateString("ru-RU")
                          : "-"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-900">
                          {tour.participants} / {tour.maxParticipants}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                          <div
                            className="bg-blue-600 h-1.5 rounded-full"
                            style={{
                              width: `${
                                (tour.participants / tour.maxParticipants) * 100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        ${tour.price}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium border ${status.class}`}
                        >
                          {status.text}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredTours.length === 0 && (
            <div className="text-center py-12">
              <p className="text-sm text-gray-500">Туры не найдены</p>
            </div>
          )}

          {/* Pagination */}
          <div className="px-4 py-3 border-t flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Показано{" "}
              <span className="font-medium">{filteredTours.length}</span> из{" "}
              <span className="font-medium">{tourData.length}</span> туров
            </div>
            <div className="flex gap-2">
              <button
                className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled
              >
                Назад
              </button>
              <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                1
              </button>
              <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50">
                2
              </button>
              <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50">
                Вперёд
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedTours.length > 0 && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-4">
            <span className="text-sm font-medium">
              Выбрано: {selectedTours.length}
            </span>
            <div className="h-4 w-px bg-gray-700"></div>
            <button className="text-sm hover:text-gray-300 transition-colors">
              Изменить статус
            </button>
            <button className="text-sm hover:text-gray-300 transition-colors">
              Экспортировать
            </button>
            <button className="text-sm text-red-400 hover:text-red-300 transition-colors">
              Удалить
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-xl font-semibold text-gray-900">
                Добавить новый тур
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="px-6 py-4">
              <div className="space-y-5">
                {errorsForm && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded px-3 py-2">
                    {errorsForm}
                  </div>
                )}

                {/* Company ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ID компании <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="company_id"
                    value={formData.company_id}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Введите ID компании"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Уникальный идентификатор компании
                  </p>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Название тура <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Например: Тур в Париж"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Описание <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Подробное описание тура, маршрут, особенности..."
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Минимум 20 символов
                  </p>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Категория <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="">Выберите категорию</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>

                  {selectedCategory && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                      <span className="text-gray-400">Иконка категории:</span>
                      <TravelTypeIcon
                        type={selectedCategory.icon}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-gray-500">
                        {selectedCategory.icon}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info Block */}
                <div className="bg-blue-50 border border-blue-200 rounded p-4">
                  <div className="flex gap-2">
                    <svg
                      className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Важная информация</p>
                      <ul className="list-disc list-inside space-y-1 text-blue-700">
                        <li>
                          После создания тур получит уникальный ID автоматически
                        </li>
                        <li>
                          Информация о категории и её иконке берётся из базы
                          данных
                        </li>
                        <li>Статус нового тура по умолчанию: "Черновик"</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="mt-6 pt-4 border-t flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
                >
                  Создать тур
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
