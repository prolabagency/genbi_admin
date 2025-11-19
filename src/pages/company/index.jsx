import React, { useState, useEffect } from "react";
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  Search,
  Users,
  MapPin,
  User,
} from "lucide-react";
import { $API } from "../../axios";

export default function CompanyManagement() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    owner_id: "",
    city_id: "",
    managers_ids: [],
  });

  // Загрузка компаний
  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await $API.get("/agencies/companies/");
      console.log("Companies response:", response.data);

      const companies = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];

      setCompanies(companies);
    } catch (error) {
      console.error("Ошибка загрузки компаний:", error);
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      owner_id: "",
      city_id: "",
      managers_ids: [],
    });
  };

  const handleAdd = async () => {
    if (!formData.name) {
      alert("Заполните обязательное поле: Название");
      return;
    }

    const payload = {
      name: formData.name,
      description: formData.description || "",
      owner_id: parseInt(formData.owner_id) || 0,
      city_id: parseInt(formData.city_id) || 0,
      managers_ids: formData.managers_ids,
    };

    try {
      const response = await $API.post("/agencies/companies/", payload);
      console.log("Company added:", response.data);

      setCompanies([response.data, ...companies]);
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error(
        "Ошибка добавления компании:",
        error.response?.data || error
      );
      alert("Ошибка при добавлении компании");
    }
  };

  // Открытие редактирования
  const handleEdit = (company) => {
    setEditingId(company.id);
    setFormData({
      name: company.name || "",
      description: company.description || "",
      owner_id: company.owner_id?.toString() || "",
      city_id: company.city_id?.toString() || "",
      managers_ids: company.managers_ids || [],
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
      description: formData.description || "",
      owner_id: parseInt(formData.owner_id) || 0,
      city_id: parseInt(formData.city_id) || 0,
      managers_ids: formData.managers_ids,
    };

    try {
      const response = await $API.put(
        `/agencies/companies/${editingId}`,
        payload
      );
      console.log("Company updated:", response.data);

      setCompanies(
        companies.map((company) =>
          company.id === editingId ? response.data : company
        )
      );
      setEditingId(null);
      resetForm();
    } catch (error) {
      console.error(
        "Ошибка обновления компании:",
        error.response?.data || error
      );
      alert("Ошибка при обновлении компании");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setShowAddModal(false);
    resetForm();
  };

  // Удаление компании
  const handleDelete = async (id) => {
    if (!window.confirm("Вы уверены, что хотите удалить компанию?")) {
      return;
    }

    try {
      await $API.delete(`/agencies/companies/${id}`);
      console.log("Company deleted:", id);

      setCompanies(companies.filter((company) => company.id !== id));
    } catch (error) {
      console.error("Ошибка удаления компании:", error.response?.data || error);
      alert("Ошибка при удалении компании");
    }
  };

  const filteredCompanies = companies.filter(
    (company) =>
      company.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Добавление/удаление менеджера
  const handleAddManager = () => {
    const managerId = prompt("Введите ID менеджера:");
    if (managerId && !isNaN(managerId)) {
      const id = parseInt(managerId);
      if (!formData.managers_ids.includes(id)) {
        setFormData((prev) => ({
          ...prev,
          managers_ids: [...prev.managers_ids, id],
        }));
      }
    }
  };

  const handleRemoveManager = (managerId) => {
    setFormData((prev) => ({
      ...prev,
      managers_ids: prev.managers_ids.filter((id) => id !== managerId),
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <div className="bg-blue-600 p-3 rounded-xl">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Управление компаниями
                </h1>
                <p className="text-gray-600 mt-1">
                  Полный контроль над компаниями агентств
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl text-lg font-medium"
          >
            <Plus className="w-6 h-6" />
            Добавить компанию
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск по названию или описанию..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-xl shadow-sm p-16 text-center">
            <p className="text-gray-500 text-lg">Загрузка компаний...</p>
          </div>
        )}

        {/* Table */}
        {!loading && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Название компании
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Описание
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Владелец
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Город
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Менеджеры
                  </th>
                  <th className="px-6 py-5 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCompanies.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-16 text-center">
                      <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">
                        {searchQuery
                          ? "Компании не найдены"
                          : "Компаний пока нет"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredCompanies.map((company) => (
                    <tr
                      key={company.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-5">
                        <span className="text-base font-mono text-gray-600">
                          #{company.id}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="bg-blue-100 p-3 rounded-lg">
                            <Building2 className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className="text-base font-semibold text-gray-900">
                            {company.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-sm text-gray-600 max-w-md line-clamp-2">
                          {company.description || "—"}
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User className="w-4 h-4 text-gray-400" />
                          <span>ID: {company.owner_id || "—"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>ID: {company.city_id || "—"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span>{company.managers_ids?.length || 0}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(company)}
                            className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Редактировать"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(company.id)}
                            className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Удалить"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-8">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 rounded-t-2xl">
              <h2 className="text-2xl font-bold text-gray-900">
                Добавить новую компанию
              </h2>
            </div>
            <div className="px-8 py-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Название компании <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Название компании"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Описание
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Описание компании..."
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ID владельца
                    </label>
                    <input
                      type="number"
                      value={formData.owner_id}
                      onChange={(e) =>
                        handleInputChange("owner_id", e.target.value)
                      }
                      placeholder="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ID города
                    </label>
                    <input
                      type="number"
                      value={formData.city_id}
                      onChange={(e) =>
                        handleInputChange("city_id", e.target.value)
                      }
                      placeholder="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Менеджеры
                  </label>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2 min-h-[50px] p-3 border border-gray-300 rounded-xl">
                      {formData.managers_ids.length === 0 ? (
                        <span className="text-gray-400 text-sm">
                          Менеджеры не добавлены
                        </span>
                      ) : (
                        formData.managers_ids.map((managerId) => (
                          <span
                            key={managerId}
                            className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm"
                          >
                            ID: {managerId}
                            <button
                              onClick={() => handleRemoveManager(managerId)}
                              className="hover:text-blue-900"
                            >
                              ×
                            </button>
                          </span>
                        ))
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleAddManager}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      + Добавить менеджера
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 bg-gray-50 px-8 py-6 flex gap-4 justify-end rounded-b-2xl border-t border-gray-200">
              <button
                onClick={handleCancel}
                className="px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-base font-medium"
              >
                Отмена
              </button>
              <button
                onClick={handleAdd}
                className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-base font-medium"
              >
                Создать компанию
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-8">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 rounded-t-2xl">
              <h2 className="text-2xl font-bold text-gray-900">
                Редактирование компании
              </h2>
            </div>
            <div className="px-8 py-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Название компании <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Описание
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ID владельца
                    </label>
                    <input
                      type="number"
                      value={formData.owner_id}
                      onChange={(e) =>
                        handleInputChange("owner_id", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ID города
                    </label>
                    <input
                      type="number"
                      value={formData.city_id}
                      onChange={(e) =>
                        handleInputChange("city_id", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Менеджеры
                  </label>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2 min-h-[50px] p-3 border border-gray-300 rounded-xl">
                      {formData.managers_ids.length === 0 ? (
                        <span className="text-gray-400 text-sm">
                          Менеджеры не добавлены
                        </span>
                      ) : (
                        formData.managers_ids.map((managerId) => (
                          <span
                            key={managerId}
                            className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm"
                          >
                            ID: {managerId}
                            <button
                              onClick={() => handleRemoveManager(managerId)}
                              className="hover:text-blue-900"
                            >
                              ×
                            </button>
                          </span>
                        ))
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleAddManager}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      + Добавить менеджера
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 bg-gray-50 px-8 py-6 flex gap-4 justify-end rounded-b-2xl border-t border-gray-200">
              <button
                onClick={handleCancel}
                className="px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-base font-medium"
              >
                Отмена
              </button>
              <button
                onClick={handleSave}
                className="px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-base font-medium"
              >
                Сохранить изменения
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
