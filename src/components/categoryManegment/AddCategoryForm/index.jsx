import { useState } from "react";
import {
  Save,
  X,
  Mountain,
  Footprints,
  Sailboat,
  Heart,
  PersonStanding,
  Trees,
  Flame,
  Bike,
  ChessKnight,
  Users,
} from "lucide-react";

// Предустановленные типы туров + привязка к lucide-иконкам
const TRAVEL_ICON_TYPES = [
  {
    key: "hiking",
    label: "Пеший / трекинг",
    Icon: Footprints,
  },
  {
    key: "mountain",
    label: "Горный / природа",
    Icon: Mountain,
  },
  {
    key: "forest",
    label: "Лес / природа",
    Icon: Trees,
  },
  {
    key: "horse",
    label: "Конный тур",
    Icon: ChessKnight, // ← здесь БЫЛ Horse, заменили на ChessKnight
  },
  {
    key: "bike",
    label: "Велотур",
    Icon: Bike,
  },
  {
    key: "boat",
    label: "Лодка / круиз",
    Icon: Sailboat,
  },
  {
    key: "couple",
    label: "Для пар",
    Icon: Heart,
  },
  {
    key: "solo",
    label: "Для одиночек",
    Icon: PersonStanding,
  },
  {
    key: "family",
    label: "Семейный",
    Icon: Users,
  },
  {
    key: "extreme",
    label: "Экстрим",
    Icon: Flame,
  },
];

export default function AddCategoryForm({ onSubmit, onCancel }) {
  const [newName, setNewName] = useState("");
  const [newIconFile, setNewIconFile] = useState(null);
  const [iconMode, setIconMode] = useState("preset"); // 'preset' | 'upload'
  const [selectedIconType, setSelectedIconType] = useState("hiking");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const formData = new FormData();
    formData.append("name", newName.trim());

    if (selectedIconType) {
      formData.append("icon_type", selectedIconType);
    }

    if (iconMode === "upload" && newIconFile) {
      formData.append("icon", newIconFile);
    }

    onSubmit(formData);

    setNewName("");
    setNewIconFile(null);
    setSelectedIconType("hiking");
    setIconMode("preset");
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {/* Верхняя часть: название + кнопки сохранить/отмена */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Название новой категории"
              className="w-full text-lg font-semibold text-gray-900 border-b-2 border-gray-300 focus:border-blue-500 outline-none pb-2 pt-1 bg-transparent min-h-[2rem]"
              required
            />
          </div>

          <div className="flex items-center gap-2 ml-4">
            <button
              type="submit"
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
            >
              <Save className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Режим выбора иконки */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Левая колонка — пресеты (SVG lucide) */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700">
                Тип тура / SVG-иконка
              </h3>
              <span className="text-[11px] uppercase tracking-wide text-blue-600 font-semibold">
                Рекомендуется для мобилки
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {TRAVEL_ICON_TYPES.map(({ key, label, Icon }) => {
                const active = selectedIconType === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setSelectedIconType(key);
                      setIconMode("preset");
                    }}
                    className={`flex flex-col items-center justify-center border rounded-lg px-3 py-2 text-xs text-center transition ${
                      active
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 text-gray-700"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 mb-1 ${
                        active ? "text-blue-600" : "text-gray-500"
                      }`}
                    />
                    <span className="leading-tight">{label}</span>
                    <span className="mt-0.5 text-[10px] text-gray-400">
                      {key}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Правая колонка — загрузка файла (опционально) */}
          <div className="w-full lg:w-64 border-l border-gray-100 pl-0 lg:pl-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700">
                Доп. иконка (файл)
              </h3>
              <button
                type="button"
                onClick={() =>
                  setIconMode((prev) =>
                    prev === "upload" ? "preset" : "upload"
                  )
                }
                className="text-[11px] text-blue-600 underline underline-offset-2"
              >
                {iconMode === "upload"
                  ? "Использовать только SVG тип"
                  : "Добавить файл иконки"}
              </button>
            </div>

            <p className="text-xs text-gray-500 mb-3">
              Можно загрузить PNG/JPEG/SVG, но основное поле для мобилки —{" "}
              <span className="font-semibold">icon_type</span>.
            </p>

            <div className="flex flex-col items-start gap-2">
              <div className="flex items-center gap-3">
                {newIconFile ? (
                  <img
                    src={URL.createObjectURL(newIconFile)}
                    alt="Preview"
                    className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200 text-xs text-gray-400">
                    IMG
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files && e.target.files[0];
                      setNewIconFile(file || null);
                      if (file) {
                        setIconMode("upload");
                      }
                    }}
                    className="text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {newIconFile && (
                    <button
                      type="button"
                      onClick={() => setNewIconFile(null)}
                      className="text-[11px] text-red-500 hover:underline text-left"
                    >
                      Убрать файл
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-1 text-[11px] text-gray-400">
                Режим:{" "}
                <span className="font-semibold">
                  {iconMode === "preset"
                    ? "SVG по типу тура (icon_type)"
                    : "Файл + icon_type"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Подсказка для интеграции */}
        <div className="mt-2 text-[11px] text-gray-500 border-t pt-2">
          В API у категории будет поле <code>icon_type</code>, например{" "}
          <code>"hiking"</code>, <code>"horse"</code>, <code>"boat"</code>,{" "}
          <code>"couple"</code>. Мобильное приложение может по нему выбирать
          свою SVG-иконку.
        </div>
      </form>
    </div>
  );
}
