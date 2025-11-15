import { useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  MapPin,
  TrendingUp,
  DollarSign,
  Globe,
  Plane,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Star,
} from "lucide-react";

const TourismDashboard = () => {
  const [timeRange, setTimeRange] = useState("month");

  // Статистика
  const stats = [
    {
      title: "Всего туристов",
      value: "27,543",
      change: "+15.3%",
      trend: "up",
      icon: Users,
      color: "blue",
      description: "За текущий период",
    },
    {
      title: "Активные бронирования",
      value: "3,842",
      change: "+22.1%",
      trend: "up",
      icon: Calendar,
      color: "green",
      description: "Подтвержденные туры",
    },
    {
      title: "Выручка",
      value: "$3.29M",
      change: "+18.7%",
      trend: "up",
      icon: DollarSign,
      color: "yellow",
      description: "За последние 30 дней",
    },
    {
      title: "Направления",
      value: "45",
      change: "+3",
      trend: "up",
      icon: Globe,
      color: "purple",
      description: "Активных маршрутов",
    },
  ];

  // Данные по пользователям по месяцам
  const usersData = [
    { month: "Янв", tourists: 1200, bookings: 890, revenue: 145 },
    { month: "Фев", tourists: 1500, bookings: 1100, revenue: 178 },
    { month: "Мар", tourists: 1800, bookings: 1350, revenue: 215 },
    { month: "Апр", tourists: 2300, bookings: 1700, revenue: 298 },
    { month: "Май", tourists: 3100, bookings: 2400, revenue: 385 },
    { month: "Июн", tourists: 3800, bookings: 3000, revenue: 450 },
    { month: "Июл", tourists: 4200, bookings: 3500, revenue: 520 },
    { month: "Авг", tourists: 4000, bookings: 3300, revenue: 495 },
    { month: "Сен", tourists: 2800, bookings: 2100, revenue: 340 },
    { month: "Окт", tourists: 2200, bookings: 1600, revenue: 265 },
  ];

  // Топ направлений
  const topDestinations = [
    {
      name: "Париж",
      country: "Франция",
      bookings: 2845,
      revenue: 428000,
      rating: 4.8,
      trend: "up",
    },
    {
      name: "Рим",
      country: "Италия",
      bookings: 2234,
      revenue: 356000,
      rating: 4.7,
      trend: "up",
    },
    {
      name: "Барселона",
      country: "Испания",
      bookings: 1923,
      revenue: 298000,
      rating: 4.6,
      trend: "up",
    },
    {
      name: "Лондон",
      country: "Великобритания",
      bookings: 1678,
      revenue: 267000,
      rating: 4.5,
      trend: "down",
    },
    {
      name: "Дубай",
      country: "ОАЭ",
      bookings: 1456,
      revenue: 445000,
      rating: 4.9,
      trend: "up",
    },
  ];

  // Данные по локациям для графика
  const locationsData = [
    { name: "Европа", value: 45, color: "#3b82f6" },
    { name: "Азия", value: 28, color: "#10b981" },
    { name: "Америка", value: 15, color: "#f59e0b" },
    { name: "Африка", value: 8, color: "#ef4444" },
    { name: "Океания", value: 4, color: "#8b5cf6" },
  ];

  // Типы туров
  const tourTypesData = [
    { name: "Пляжный отдых", value: 35, bookings: 7200 },
    { name: "Экскурсии", value: 28, bookings: 5760 },
    { name: "Приключения", value: 18, bookings: 3700 },
    { name: "Бизнес-туры", value: 12, bookings: 2470 },
    { name: "Круизы", value: 7, bookings: 1440 },
  ];

  // Активность по дням недели
  const weeklyActivity = [
    { day: "Пн", bookings: 245, views: 1850 },
    { day: "Вт", bookings: 312, views: 2100 },
    { day: "Ср", bookings: 289, views: 1950 },
    { day: "Чт", bookings: 356, views: 2400 },
    { day: "Пт", bookings: 398, views: 2650 },
    { day: "Сб", bookings: 423, views: 3100 },
    { day: "Вс", bookings: 367, views: 2800 },
  ];

  // const COLORS = [
  //   "#3b82f6",
  //   "#10b981",
  //   "#f59e0b",
  //   "#ef4444",
  //   "#8b5cf6",
  //   "#ec4899",
  // ];

  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-50 text-blue-600",
      green: "bg-green-50 text-green-600",
      red: "bg-red-50 text-red-600",
      yellow: "bg-yellow-50 text-yellow-600",
      purple: "bg-purple-50 text-purple-600",
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Туристическая аналитика
          </h1>
          <p className="text-gray-600">
            Обзор показателей и статистики туристического бизнеса
          </p>
        </div>
        <div className="flex items-center gap-4">
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="week">Неделя</option>
            <option value="month">Месяц</option>
            <option value="year">Год</option>
          </select>
          <button className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Экспорт отчета
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`p-3 rounded-lg ${getColorClasses(stat.color)}`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div
                  className={`flex items-center gap-1 text-sm font-medium ${
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  {stat.change}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-gray-600">{stat.title}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
            </div>
          );
        })}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Туристы и бронирования */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Динамика туристов и бронирований
              </h2>
              <p className="text-sm text-gray-600">
                Помесячная статистика за 2024 год
              </p>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition">
              <MoreVertical className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={usersData}>
              <defs>
                <linearGradient id="colorTourists" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="tourists"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorTourists)"
                name="Туристы"
              />
              <Area
                type="monotone"
                dataKey="bookings"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorBookings)"
                name="Бронирования"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Распределение по регионам */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                География туризма
              </h2>
              <p className="text-sm text-gray-600">По регионам мира (%)</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={locationsData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {locationsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {locationsData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-700">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-gray-800">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Активность по дням недели */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Недельная активность
              </h2>
              <p className="text-sm text-gray-600">Бронирования и просмотры</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={weeklyActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar
                dataKey="bookings"
                fill="#475569"
                name="Бронирования"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="views"
                fill="#cbd5e1"
                name="Просмотры"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Типы туров */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Популярные типы туров
              </h2>
              <p className="text-sm text-gray-600">
                Распределение бронирований
              </p>
            </div>
          </div>
          <div className="space-y-4">
            {tourTypesData.map((tour, index) => {
              const maxValue = Math.max(...tourTypesData.map((t) => t.value));
              const percentage = (tour.value / maxValue) * 100;
              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Plane className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">
                        {tour.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-gray-800">
                        {tour.value}%
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        ({tour.bookings})
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-slate-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Destinations Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Топ направлений
              </h2>
              <p className="text-sm text-gray-600">
                Самые популярные туристические маршруты
              </p>
            </div>
            <button className="text-sm text-slate-700 hover:text-slate-900 font-medium flex items-center gap-1">
              Все направления
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Направление
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Страна
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Бронирования
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Выручка
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Рейтинг
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Тренд
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topDestinations.map((dest, index) => (
                <tr key={index} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-slate-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {dest.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">{dest.country}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {dest.bookings.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      ${(dest.revenue / 1000).toFixed(0)}k
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {dest.rating}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {dest.trend === "up" ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <ArrowUpRight className="w-3 h-3 mr-1" />
                        Растет
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <ArrowDownRight className="w-3 h-3 mr-1" />
                        Падает
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TourismDashboard;
