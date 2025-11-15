import { useState, useEffect } from "react";
import { X, Save, User, Mail, Phone, MapPin, Upload, Key } from "lucide-react";
import $API from "../../../axios";

export default function EditUserModal({ userId, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    gender: "male",
    city_id: 0,
    phone_number: "",
    is_active: true,
    password: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [originalImageUrl, setOriginalImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return "";

    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }

    const baseURL = $API.defaults.baseURL || window.location.origin;

    const cleanBaseURL = baseURL.replace(/\/api\/?$/, "");

    const fullPath = imagePath.startsWith("/")
      ? `${cleanBaseURL}${imagePath}`
      : `${cleanBaseURL}/${imagePath}`;

    return fullPath;
  };

  useEffect(() => {
    if (userId && isOpen) {
      const fetchUserData = async () => {
        try {
          setIsLoading(true);
          const response = await $API.get(`/auth/users/${userId}`);
          const userData = response.data;

          setFormData({
            email: userData.email || "",
            full_name:
              userData.full_name || userData.name || userData.username || "",
            gender: userData.gender || "male",
            city_id: userData.city_id || 0,
            phone_number: userData.phone_number || userData.phone || "",
            is_active: userData.is_active ?? userData.status ?? true,
            password: "", 
          });

          const imageUrl = getFullImageUrl(
            userData.image_url || userData.image || userData.avatar
          );

          setOriginalImageUrl(imageUrl);
          setImagePreview(""); 
          setImageFile(null);
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setIsLoading(false);
        }
      };

      fetchUserData();
    }
  }, [userId, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Файл слишком большой. Максимальный размер: 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        alert("Пожалуйста, выберите изображение");
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
    setOriginalImageUrl("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const submitData = { ...formData, id: userId, imageFile };

    if (!submitData.password || submitData.password.trim() === "") {
      delete submitData.password;
    }

    onSave(submitData);
  };

  if (!isOpen) return null;

  const displayImage = imagePreview || originalImageUrl;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-slate-700 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-slate-600 flex items-center justify-center text-white font-medium">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Редактировать пользователя
                </h3>
                <p className="text-sm text-slate-300">ID: {userId}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-300 hover:text-white transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-700"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="px-6 py-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Upload className="w-4 h-4 inline mr-2" />
                    Изображение профиля
                  </label>

                  <div className="flex items-center gap-4">
                    <div className="relative">
                      {displayImage ? (
                        <div className="relative">
                          <img
                            src={displayImage}
                            alt="Preview"
                            className="h-24 w-24 rounded-full object-cover border-4 border-gray-200"
                            onError={(e) => {
                              console.error(
                                "Image failed to load:",
                                displayImage
                              );
                              e.target.onerror = null; // Предотвращаем бесконечный цикл
                              e.target.style.display = "none";
                              const placeholder = e.target.nextElementSibling;
                              if (placeholder) {
                                placeholder.style.display = "flex";
                              }
                            }}
                          />
                          <div className="h-24 w-24 rounded-full bg-gray-200 items-center justify-center hidden">
                            <User className="w-12 h-12 text-gray-400" />
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition border border-slate-300">
                        <Upload className="w-4 h-4" />
                        <span>
                          {imageFile
                            ? "Изменить файл"
                            : "Загрузить изображение"}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                      {imageFile && (
                        <p className="text-xs text-gray-500 mt-2">
                          Выбран: {imageFile.name}
                        </p>
                      )}
                      {!imageFile && originalImageUrl && (
                        <p className="text-xs text-gray-500 mt-2">
                          Текущее изображение с сервера
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        PNG, JPG, GIF до 5MB
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Полное имя
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none"
                    placeholder="Введите полное имя"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none"
                    placeholder="user@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Номер телефона
                  </label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none"
                    placeholder="+996 XXX XXX XXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Key className="w-4 h-4 inline mr-2" />
                    Новый пароль (оставьте пустым, если не хотите менять)
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none"
                    placeholder="Введите новый пароль"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Пол
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none"
                    >
                      <option value="male">Мужской</option>
                      <option value="female">Женский</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      ID города
                    </label>
                    <input
                      type="number"
                      name="city_id"
                      value={formData.city_id}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_active"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    className="h-4 w-4 text-slate-600 focus:ring-slate-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="is_active"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Активный пользователь
                  </label>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition"
                >
                  <Save className="w-4 h-4" />
                  Сохранить
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
