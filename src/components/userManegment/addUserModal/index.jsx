import { useState } from "react";
import { X, Save, User, Mail, Phone, MapPin, Upload, Lock } from "lucide-react";
import $APIFormData from "../../../axios";

export default function AddUserModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    email: "office@prolabagency.com",
    full_name: "Маткеримов Элдос",
    gender: "male",
    city_id: 1,
    phone_number: "+996700600600",
    is_active: true,
    image_url: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Проверка совпадения паролей
    if (formData.password !== formData.password_confirmation) {
      alert("Пароли не совпадают!");
      return;
    }

    try {
      setIsSubmitting(true);

      const submitData = new FormData();
      submitData.append("email", formData.email);
      submitData.append("full_name", formData.full_name);
      submitData.append("password", formData.password);
      submitData.append("gender", formData.gender);
      submitData.append("city_id", formData.city_id);
      submitData.append("phone_number", formData.phone_number);
      submitData.append("is_active", formData.is_active ? 1 : 0);

      if (imageFile) {
        submitData.append("image_url", imageFile);
      }

      await $APIFormData.post("/auth/users", submitData);

      // Очистка формы после успешного добавления
      setFormData({
        email: "",
        full_name: "",
        password: "",
        password_confirmation: "",
        gender: "male",
        city_id: 0,
        phone_number: "",
        is_active: true,
      });
      setImageFile(null);
      setImagePreview("");

      // Вызываем callback для обновления списка
      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (error) {
      console.error("Error adding user:", error);
      alert(
        `Ошибка создания пользователя: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

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
                  Добавить пользователя
                </h3>
                <p className="text-sm text-slate-300">
                  Создание нового аккаунта
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-300 hover:text-white transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="px-6 py-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Upload className="w-4 h-4 inline mr-2" />
                  Изображение профиля
                </label>

                <div className="flex items-center gap-4">
                  <div className="relative">
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="h-24 w-24 rounded-full object-cover border-4 border-gray-200"
                        />
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
                        {imageFile ? "Изменить файл" : "Загрузить изображение"}
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
                    <p className="text-xs text-gray-400 mt-1">
                      PNG, JPG, GIF до 5MB
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Полное имя <span className="text-red-500">*</span>
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
                  Email <span className="text-red-500">*</span>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Lock className="w-4 h-4 inline mr-2" />
                    Пароль <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none"
                    placeholder="Минимум 6 символов"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Lock className="w-4 h-4 inline mr-2" />
                    Подтверждение пароля <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none"
                    placeholder="Повторите пароль"
                  />
                </div>
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
                  id="is_active_add"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="h-4 w-4 text-slate-600 focus:ring-slate-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="is_active_add"
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
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Создание...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Создать
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
