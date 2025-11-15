import {
  LayoutDashboard,
  Users,
  // Settings,
  BarChart3,
  // FileText,
  // Bell,
  Server,
  ChartColumnStacked,
  Group,
} from "lucide-react";

export const $NavigateTo = [
  {
    name: "Дашборд",
    path: "/dashboard",
    icon: <LayoutDashboard />,
  },
  {
    name: "Пользователи",
    path: "/users",
    icon: <Users />,
  },
  {
    name: "Создание локации",
    path: "/create-location",
    icon: <BarChart3 />,
  },
  // {
  //   name: "Отчеты",
  //   path: "/reports",
  //   icon: <FileText />,
  // },
  // {
  //   name: "Уведомления",
  //   path: "/notifications",
  //   icon: <Bell />,
  //   badge: "12",
  // },
  // {
  //   name: "Настройки",
  //   path: "/settings",
  //   icon: <Settings />,
  // },
  {
    name: "Категорий",
    path: "/category",
    icon: <ChartColumnStacked />,
  },
  {
    name: "Туры",
    path: "/tour-add",
    icon: <Group />,
  },
  {
    name: "Состояние сервера",
    path: "/health-server",
    icon: <Server />,
  },
];
