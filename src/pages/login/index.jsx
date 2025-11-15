import { useState } from "react";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import $API, { startTokenRefresh } from "../../axios";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const onClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const extractTokens = (response) => {
    const data = response.data;

    const possiblePaths = [
      { token: data.token, refresh: data.refreshToken },
      { token: data.access_token, refresh: data.refresh_token },
      { token: data.acces_token, refresh: data.refresh_token },
      { token: data.accessToken, refresh: data.refreshToken },
      { token: data.data?.token, refresh: data.data?.refreshToken },
      { token: data.data?.access_token, refresh: data.data?.refresh_token },
      { token: data.data?.acces_token, refresh: data.data?.refresh_token },
      { token: data.tokens?.token, refresh: data.tokens?.refreshToken },
      { token: data.tokens?.access_token, refresh: data.tokens?.refresh_token },
      { token: data.tokens?.acces_token, refresh: data.tokens?.refresh_token },
    ];

    for (const path of possiblePaths) {
      if (path.token) {
        return { token: path.token, refreshToken: path.refresh };
      }
    }

    console.error("Токен не найден. Структура ответа:", data);
    return { token: null, refreshToken: null };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    $API
      .post("/auth/login", formData)
      .then((response) => {
        const { token, refreshToken } = extractTokens(response);

        if (token) {
          localStorage.setItem("token", token);

          if (refreshToken) {
            localStorage.setItem("refreshToken", refreshToken);
          }

          startTokenRefresh();

          window.location.href = "/dashboard";
        } else {
          setError("Токен не получен от сервера");
          console.error("Структура ответа:", response.data);
        }
      })
      .catch((error) => {
        console.error("Login error:", error);

        if (error.response?.status === 401) {
          setError("Неверный логин или пароль");
        } else {
          setError(
            error.response?.data?.message || "Произошла ошибка при входе"
          );
        }
      });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-700 rounded-lg mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-800">Админ-панель</h1>
          <p className="text-gray-500 mt-1">Войдите для продолжения</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Почта
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Введите почту"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition outline-none text-gray-900"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Пароль
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Введите пароль"
                  className="block w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition outline-none text-gray-900"
                  required
                />
                <button
                  type="button"
                  onClick={onClickShowPassword}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-slate-600 border-gray-300 rounded focus:ring-slate-500"
                />
                <span className="ml-2 text-sm text-gray-600">
                  Запомнить меня
                </span>
              </label>
              <a
                href="#"
                className="text-sm text-slate-600 hover:text-slate-800 font-medium"
              >
                Забыли пароль?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-slate-700 hover:bg-slate-800 text-white py-2.5 rounded-md font-medium transition duration-150 shadow-sm"
            >
              Войти
            </button>
          </form>
        </div>
        <p className="text-center text-xs text-gray-500 mt-6">
          © PROlab Agency 2025 Все права защищены
        </p>
      </div>
    </div>
  );
}
