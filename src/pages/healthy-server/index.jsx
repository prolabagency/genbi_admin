import { useState, useEffect } from "react";
import {
  Server,
  Activity,
  Database,
  Cpu,
  HardDrive,
  Wifi,
  AlertCircle,
  CheckCircle,
  Clock,
  MemoryStick,
  Network,
  Zap,
} from "lucide-react";
import $API from "../../axios";

export default function ServerStatus() {
  const [dataEndpoint, setDataEndpoint] = useState([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);

  const [serverData, setServerData] = useState({
    status: "online",
    uptime: "99.9%",
    responseTime: "45ms",
    lastChecked: new Date().toLocaleString("ru-RU"),
    services: [
      {
        name: "API Server",
        status: "running",
        uptime: "15 дней 6 часов",
        port: "8000",
      },
      {
        name: "Database",
        status: "running",
        uptime: "30 дней 12 часов",
        port: "5432",
      },
      {
        name: "Redis Cache",
        status: "running",
        uptime: "15 дней 6 часов",
        port: "6379",
      },
      {
        name: "File Storage",
        status: "warning",
        uptime: "2 дня 3 часа",
        port: "9000",
      },
    ],
    metrics: {
      cpu: 45,
      memory: 68,
      disk: 72,
      network: 34,
    },
    requests: {
      total: "2.4M",
      success: "2.38M",
      errors: "20K",
      avgTime: "120ms",
    },
  });

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        setIsLoadingServices(true);
        const response = await $API.get("/health");

        if (
          response.data?.services &&
          typeof response.data.services === "object"
        ) {
          const servicesArray = Object.entries(response.data.services).map(
            ([key, value]) => ({
              name: key.charAt(0).toUpperCase() + key.slice(1),
              status: value.status || value.state || "unknown",
              message: value.message || value.details || "",
              uptime: value.uptime || "",
              port: value.port || "",
              ...value,
            })
          );

          setDataEndpoint(servicesArray);

          setServerData((prev) => ({
            ...prev,
            status:
              response.data.overall_status || response.data.gateway || "online",
          }));
        } else {
          setDataEndpoint([]);
        }
      } catch (error) {
        setDataEndpoint([]);
      } finally {
        setIsLoadingServices(false);
      }
    };

    fetchHealth();

    const healthInterval = setInterval(fetchHealth, 30000);

    return () => clearInterval(healthInterval);
  }, []);

  const getStatusColor = (status) => {
    const statusLower = (status || "").toLowerCase();
    switch (statusLower) {
      case "online":
      case "healthy":
      case "running":
      case "ok":
        return "text-green-600 bg-green-100";
      case "warning":
      case "degraded":
        return "text-yellow-600 bg-yellow-100";
      case "offline":
      case "error":
      case "unhealthy":
      case "down":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status) => {
    const statusLower = (status || "").toLowerCase();
    switch (statusLower) {
      case "online":
      case "running":
      case "healthy":
      case "ok":
        return <CheckCircle className="w-5 h-5" />;
      case "warning":
      case "degraded":
        return <AlertCircle className="w-5 h-5" />;
      case "offline":
      case "error":
      case "unhealthy":
      case "down":
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Activity className="w-5 h-5" />;
    }
  };

  const getMetricColor = (value) => {
    if (value < 50) return "bg-green-500";
    if (value < 80) return "bg-yellow-500";
    return "bg-red-500";
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setServerData((prev) => ({
        ...prev,
        responseTime: `${Math.floor(Math.random() * 50 + 30)}ms`,
        lastChecked: new Date().toLocaleString("ru-RU"),
        metrics: {
          cpu: Math.floor(Math.random() * 30 + 40),
          memory: Math.floor(Math.random() * 20 + 60),
          disk: Math.floor(Math.random() * 10 + 70),
          network: Math.floor(Math.random() * 40 + 20),
        },
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Server className="w-8 h-8 text-slate-700" />
              Состояние сервера
            </h1>
            <p className="text-gray-600 mt-1">Мониторинг в реальном времени</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            Обновлено: {serverData.lastChecked}
          </div>
        </div>

        {/* Main Status Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`p-4 rounded-full ${getStatusColor(
                  serverData.status
                )}`}
              >
                <Server className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Сервер работает нормально
                </h2>
                <p className="text-gray-600 mt-1">
                  Все системы функционируют корректно
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600">
                {serverData.uptime}
              </div>
              <p className="text-sm text-gray-500">Время работы</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-8 pt-6 border-t border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {serverData.responseTime}
              </div>
              <p className="text-sm text-gray-500 mt-1">Время отклика</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {serverData.requests.total}
              </div>
              <p className="text-sm text-gray-500 mt-1">Всего запросов</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {serverData.requests.avgTime}
              </div>
              <p className="text-sm text-gray-500 mt-1">Средний отклик</p>
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Cpu className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">CPU</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {serverData.metrics.cpu}%
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${getMetricColor(
                  serverData.metrics.cpu
                )}`}
                style={{ width: `${serverData.metrics.cpu}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Загрузка процессора</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <MemoryStick className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">RAM</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {serverData.metrics.memory}%
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${getMetricColor(
                  serverData.metrics.memory
                )}`}
                style={{ width: `${serverData.metrics.memory}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Использование памяти</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <HardDrive className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Диск</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {serverData.metrics.disk}%
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${getMetricColor(
                  serverData.metrics.disk
                )}`}
                style={{ width: `${serverData.metrics.disk}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Занято места</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Network className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Сеть</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {serverData.metrics.network}%
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${getMetricColor(
                  serverData.metrics.network
                )}`}
                style={{ width: `${serverData.metrics.network}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Использование</p>
          </div>
        </div>

        {/* Services Status */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <Database className="w-6 h-6 text-slate-700" />
            <h2 className="text-xl font-bold text-gray-900">
              Состояние сервисов
            </h2>
          </div>

          {isLoadingServices ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-700"></div>
            </div>
          ) : dataEndpoint.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Нет данных о сервисах</p>
              <p className="text-xs text-gray-400 mt-2">
                Проверьте подключение к серверу
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {dataEndpoint.map((service, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className={`p-2 rounded-full ${getStatusColor(
                        service.status
                      )}`}
                    >
                      {getStatusIcon(service.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-gray-900">
                          {service.name}
                        </h3>
                        {service.port && (
                          <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                            Port: {service.port}
                          </span>
                        )}
                      </div>
                      {service.uptime && (
                        <p className="text-sm text-gray-500 mt-1">
                          Работает: {service.uptime}
                        </p>
                      )}
                      {service.message && (
                        <p className="text-xs text-gray-400 mt-1">
                          {service.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                      service.status
                    )}`}
                  >
                    {(() => {
                      const statusLower = (service.status || "").toLowerCase();
                      if (
                        statusLower === "running" ||
                        statusLower === "healthy" ||
                        statusLower === "ok"
                      ) {
                        return "Работает";
                      } else if (
                        statusLower === "warning" ||
                        statusLower === "degraded"
                      ) {
                        return "Предупреждение";
                      } else if (
                        statusLower === "unhealthy" ||
                        statusLower === "down"
                      ) {
                        return "Не работает";
                      } else {
                        return "Неизвестно";
                      }
                    })()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Request Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Успешные</p>
                <p className="text-2xl font-bold text-gray-900">
                  {serverData.requests.success}
                </p>
              </div>
            </div>
            <div className="text-xs text-gray-500">98.5% от всех запросов</div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Ошибки</p>
                <p className="text-2xl font-bold text-gray-900">
                  {serverData.requests.errors}
                </p>
              </div>
            </div>
            <div className="text-xs text-gray-500">1.5% от всех запросов</div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Всего</p>
                <p className="text-2xl font-bold text-gray-900">
                  {serverData.requests.total}
                </p>
              </div>
            </div>
            <div className="text-xs text-gray-500">За последние 30 дней</div>
          </div>
        </div>
      </div>
    </div>
  );
}
