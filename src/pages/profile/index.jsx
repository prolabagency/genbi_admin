import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Edit,
  Save,
  X,
  Camera,
  Lock,
  Bell,
  Globe,
  Eye,
  EyeOff,
} from "lucide-react";
import { $APIFORMS, $API } from "../../axios";

export default function AdminProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState({
    id: 1,
    full_name: "Иван Иванов",
    email: "admin@example.com",
    phone_number: "+996 555 123 456",
    gender: "male",
    city_id: 1,
    city_name: "Бишкек",
    role: "Администратор",
    is_active: true,
    image_url: "",
    created_at: "2024-01-15T10:00:00",
  });

  const [editData, setEditData] = useState({ ...userData });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await $API.get("/auth/profile");
      setUserData(response.data);
      setEditData(response.data);
      setImagePreview(response.data.image_url);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setEditData({ ...userData });
      setImageFile(null);
      setImagePreview(userData.image_url);
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const formData = new FormData();
      formData.append("full_name", editData.full_name);
      formData.append("email", editData.email);
      formData.append("phone_number", editData.phone_number);
      formData.append("gender", editData.gender);
      formData.append("city_id", editData.city_id);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      await $APIFORMS.put("/auth/profile", formData);
      await fetchUserProfile();
      setIsEditing(false);
      setImageFile(null);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Ошибка при обновлении профиля");
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      alert("Новые пароли не совпадают!");
      return;
    }

    try {
      await $API.post("/auth/change-password", {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
      });
      alert("Пароль успешно изменен");
      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (error) {
      console.error("Error changing password:", error);
      alert("Ошибка при смене пароля");
    }
  };

  const getInitials = (name) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-700"></div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">
              Мой профиль
            </h1>
            <p className="text-gray-600">Управление личной информацией</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sidebar Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                {/* Avatar Section */}
                <div className="flex flex-col items-center mb-6">
                  <div className="relative mb-4">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-4 border-slate-100"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-slate-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-slate-100">
                        {getInitials(userData.full_name)}
                      </div>
                    )}

                    {isEditing && (
                      <label className="absolute bottom-0 right-0 bg-slate-700 text-white p-2 rounded-full cursor-pointer hover:bg-slate-800 transition">
                        <Camera className="w-5 h-5" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  <h2 className="text-xl font-semibold text-gray-800 text-center">
                    {userData.full_name}
                  </h2>
                  <div className="flex items-center gap-2 mt-2">
                    <Shield className="w-4 h-4 text-slate-600" />
                    <span className="text-sm text-gray-600">
                      {userData.role}
                    </span>
                  </div>

                  <div className="mt-4 w-full">
                    <div className="flex items-center justify-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Активен
                    </div>
                  </div>
                </div>

                {/* Quick Info */}
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <div className="flex items-start gap-3 text-sm">
                    <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-gray-500 text-xs">Email</p>
                      <p className="text-gray-800 break-all">
                        {userData.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-sm">
                    <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-gray-500 text-xs">Телефон</p>
                      <p className="text-gray-800">{userData.phone_number}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-gray-500 text-xs">Город</p>
                      <p className="text-gray-800">
                        {userData.city_name || "Не указан"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-gray-500 text-xs">Дата регистрации</p>
                      <p className="text-gray-800">
                        {new Date(userData.created_at).toLocaleDateString(
                          "ru-RU"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Tabs */}
                <div className="border-b border-gray-200 px-6">
                  <div className="flex gap-6">
                    <button
                      onClick={() => setActiveTab("profile")}
                      className={`py-4 border-b-2 font-medium text-sm transition ${
                        activeTab === "profile"
                          ? "border-slate-700 text-slate-700"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <User className="w-4 h-4 inline mr-2" />
                      Личная информация
                    </button>
                    <button
                      onClick={() => setActiveTab("security")}
                      className={`py-4 border-b-2 font-medium text-sm transition ${
                        activeTab === "security"
                          ? "border-slate-700 text-slate-700"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <Lock className="w-4 h-4 inline mr-2" />
                      Безопасность
                    </button>
                    <button
                      onClick={() => setActiveTab("settings")}
                      className={`py-4 border-b-2 font-medium text-sm transition ${
                        activeTab === "settings"
                          ? "border-slate-700 text-slate-700"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <Bell className="w-4 h-4 inline mr-2" />
                      Настройки
                    </button>
                  </div>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {activeTab === "profile" && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-800">
                          Основная информация
                        </h3>
                        {!isEditing ? (
                          <button
                            onClick={handleEditToggle}
                            className="inline-flex items-center gap-2 px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition"
                          >
                            <Edit className="w-4 h-4" />
                            Редактировать
                          </button>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              onClick={handleEditToggle}
                              className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                            >
                              <X className="w-4 h-4" />
                              Отмена
                            </button>
                            <button
                              onClick={handleSaveProfile}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition"
                            >
                              <Save className="w-4 h-4" />
                              Сохранить
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Полное имя
                          </label>
                          <input
                            type="text"
                            name="full_name"
                            value={
                              isEditing
                                ? editData.full_name
                                : userData.full_name
                            }
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none disabled:bg-gray-50 disabled:text-gray-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={isEditing ? editData.email : userData.email}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none disabled:bg-gray-50 disabled:text-gray-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Номер телефона
                          </label>
                          <input
                            type="tel"
                            name="phone_number"
                            value={
                              isEditing
                                ? editData.phone_number
                                : userData.phone_number
                            }
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none disabled:bg-gray-50 disabled:text-gray-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Пол
                          </label>
                          <select
                            name="gender"
                            value={
                              isEditing ? editData.gender : userData.gender
                            }
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none disabled:bg-gray-50 disabled:text-gray-500"
                          >
                            <option value="male">Мужской</option>
                            <option value="female">Женский</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            ID города
                          </label>
                          <input
                            type="number"
                            name="city_id"
                            value={
                              isEditing ? editData.city_id : userData.city_id
                            }
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none disabled:bg-gray-50 disabled:text-gray-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "security" && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-6">
                        Изменить пароль
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Текущий пароль
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              name="current_password"
                              value={passwordData.current_password}
                              onChange={handlePasswordChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Новый пароль
                          </label>
                          <input
                            type="password"
                            name="new_password"
                            value={passwordData.new_password}
                            onChange={handlePasswordChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Подтвердите новый пароль
                          </label>
                          <input
                            type="password"
                            name="confirm_password"
                            value={passwordData.confirm_password}
                            onChange={handlePasswordChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none"
                          />
                        </div>

                        <button
                          onClick={handleChangePassword}
                          className="inline-flex items-center gap-2 px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition"
                        >
                          <Lock className="w-4 h-4" />
                          Изменить пароль
                        </button>
                      </div>

                      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">
                          Требования к паролю
                        </h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Минимум 8 символов</li>
                          <li>• Хотя бы одна заглавная буква</li>
                          <li>• Хотя бы одна цифра</li>
                          <li>• Хотя бы один специальный символ</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {activeTab === "settings" && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-6">
                        Настройки уведомлений
                      </h3>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-start gap-3">
                            <Bell className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-gray-800">
                                Email уведомления
                              </h4>
                              <p className="text-sm text-gray-500">
                                Получать уведомления на почту
                              </p>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-start gap-3">
                            <Globe className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-gray-800">
                                Язык интерфейса
                              </h4>
                              <p className="text-sm text-gray-500">
                                Выберите предпочитаемый язык
                              </p>
                            </div>
                          </div>
                          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none">
                            <option>Русский</option>
                            <option>English</option>
                            <option>Кыргызча</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
