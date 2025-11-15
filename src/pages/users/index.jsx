import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Mail,
  Phone,
  Download,
  UserCheck,
  UserX,
} from "lucide-react";
import { $API, $APIFORMS } from "../../axios";
import EditUserModal from "../../components/userManegment/updateUserModal";
import AddUserModal from "../../components/userManegment/addUserModal";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [originalUserData, setOriginalUserData] = useState(null);

  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return "";

    // Если путь уже полный URL
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }

    // Базовый URL вашего сервера
    const baseURL = "https://genbi-back.prolabagency.com/";

    // Убираем слэш в конце baseURL если есть
    const cleanBaseURL = baseURL.replace(/\/$/, "");

    // Формируем полный путь
    const fullPath = imagePath.startsWith("/")
      ? `${cleanBaseURL}${imagePath}`
      : `${cleanBaseURL}/${imagePath}`;

    return fullPath;
  };

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await $API.get("/auth/users");

      let userData = response.data;

      if (response.data.data && Array.isArray(response.data.data)) {
        userData = response.data.data;
      } else if (response.data.users && Array.isArray(response.data.users)) {
        userData = response.data.users;
      } else if (Array.isArray(response.data)) {
        userData = response.data;
      }
      setUsers(userData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditUser = (userId) => {
    const user = users.find((u) => u.id === userId);
    setOriginalUserData(user);
    setSelectedUserId(userId);
    setEditModalOpen(true);
  };

  const handleSaveUser = async (updatedData) => {
    try {
      const finalData = {
        email: updatedData.email || originalUserData.email,
        full_name: updatedData.full_name || originalUserData.full_name,
        gender: updatedData.gender || originalUserData.gender,
        city_id: updatedData.city_id ?? originalUserData.city_id,
        phone_number: updatedData.phone_number || originalUserData.phone_number,
        is_active: updatedData.is_active,
        password: updatedData.password || "",
      };

      const jsonData = {
        email: finalData.email,
        full_name: finalData.full_name,
        gender: finalData.gender,
        city_id: finalData.city_id,
        phone_number: finalData.phone_number,
        is_active: finalData.is_active,
      };

      if (finalData.password !== "") {
        jsonData.password = finalData.password;
      }

      await $API.patch(`/auth/users/${updatedData.id}`, jsonData);

      if (updatedData.imageFile instanceof File) {
        const imgData = new FormData();
        imgData.append("image", updatedData.imageFile);

        await $APIFORMS.put(`/auth/profile/image/change`, imgData);
      }

      setEditModalOpen(false);
      fetchUsers();
      alert("Пользователь успешно обновлён!");
    } catch (error) {
      console.error("Update error:", error);

      const err =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.response?.data ||
        error.message;

      alert(typeof err === "string" ? err : JSON.stringify(err, null, 2));
    }
  };

  const handleDeleteUser = async (id) => {
    const confirmed = window.confirm(
      "Вы уверены, что хотите удалить пользователя? Это действие нельзя отменить."
    );
    if (!confirmed) return;

    try {
      await $API.delete(`/auth/users/${id}`);
      setUsers((prev) => prev.filter((u) => String(u.id) !== String(id)));
    } catch (error) {
      console.error("Error deleting user:", error);
      alert(
        "Не удалось удалить пользователя. Проверьте консоль для подробностей."
      );
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      (user.name ?? user.username ?? user.login ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (user.email ?? "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    if (status === "active" || status === true || status === 1) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <UserCheck className="w-3 h-3 mr-1" />
          Активен
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        <UserX className="w-3 h-3 mr-1" />
        Неактивен
      </span>
    );
  };

  return (
    <>
      <EditUserModal
        userId={selectedUserId}
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedUserId(null);
        }}
        onSave={handleSaveUser}
      />

      <AddUserModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={fetchUsers}
      />

      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            Пользователи
          </h1>
          <p className="text-gray-600">Управление пользователями системы</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Поиск по имени или email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none"
              />
            </div>

            <div className="flex items-center gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none"
              >
                <option value="all">Все статусы</option>
                <option value="active">Активные</option>
                <option value="inactive">Неактивные</option>
              </select>

              <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Экспорт</span>
              </button>

              <button
                onClick={() => setAddModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Добавить</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-700"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {users.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Нет данных от сервера</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Проверьте консоль для отладки
                  </p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Пользователь
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Контакты
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Роль
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Статус
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Дата регистрации
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Действия
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-slate-600 flex items-center justify-center text-white font-medium overflow-hidden">
                                {user.image_url ? (
                                  <img
                                    src={getFullImageUrl(user.image_url)}
                                    alt={user.username || "avatar"}
                                    className="h-full w-full object-cover"
                                    onError={(e) => {
                                      console.error(
                                        "Image failed to load:",
                                        getFullImageUrl(user.image_url)
                                      );
                                      e.target.style.display = "none";
                                      const parent = e.target.parentElement;
                                      if (
                                        parent &&
                                        !parent.querySelector("span")
                                      ) {
                                        const initials = (
                                          user.full_name ||
                                          user.username ||
                                          user.login ||
                                          "—"
                                        )
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")
                                          .slice(0, 2)
                                          .toUpperCase();

                                        const span =
                                          document.createElement("span");
                                        span.className = "uppercase";
                                        span.textContent = initials;
                                        parent.appendChild(span);
                                      }
                                    }}
                                  />
                                ) : (
                                  <span className="uppercase">
                                    {(
                                      user.full_name ||
                                      user.username ||
                                      user.login ||
                                      "—"
                                    )
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")
                                      .slice(0, 2)}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.full_name ||
                                  user.username ||
                                  user.login ||
                                  "Без имени"}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {user.id}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center text-sm text-gray-900">
                              <Mail className="w-4 h-4 mr-2 text-gray-400" />
                              {user.email || "Не указан"}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <Phone className="w-4 h-4 mr-2 text-gray-400" />
                              {user.phone || user.phone_number || "Не указан"}
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {user.role || user.role_name || "Пользователь"}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(user.status || user.is_active)}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.createdAt || user.created_at
                            ? new Date(
                                user.createdAt || user.created_at
                              ).toLocaleDateString("ru-RU")
                            : "—"}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditUser(user.id)}
                              className="p-2 text-gray-400 hover:text-slate-600 hover:bg-gray-100 rounded-lg transition"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-slate-600 hover:bg-gray-100 rounded-lg transition">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {filteredUsers.length === 0 && users.length > 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    Пользователи не найдены по заданным критериям
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Показано {filteredUsers.length} из {users.length} пользователей
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed">
              Назад
            </button>
            <button className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition">
              Далее
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
