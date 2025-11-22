import {
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
  Pencil,
  Trash2,
  Save,
  X,
} from "lucide-react";

// Маппинг типов туров → lucide-иконки
const ICON_MAP = {
  hiking: Footprints,
  mountain: Mountain,
  forest: Trees,
  horse: ChessKnight,
  bike: Bike,
  boat: Sailboat,
  couple: Heart,
  solo: PersonStanding,
  family: Users,
  extreme: Flame,
};

// Угадываем тип тура по названию категории
function resolveIconTypeFromName(name) {
  const n = (name || "").toLowerCase();

  if (n.match(/пеш|трекинг|треккинг|прогул/)) return "hiking";
  if (n.match(/горн|гора|альп/)) return "mountain";
  if (n.match(/лес|природ/)) return "forest";
  if (n.match(/конн|лошад|лоша/)) return "horse";
  if (n.match(/вел|байк|велосип/)) return "bike";
  if (n.match(/лодк|яхт|круиз|кораб/)) return "boat";
  if (n.match(/пар|романтик|любов/)) return "couple";
  if (n.match(/семейн|family|дет/)) return "family";
  if (n.match(/экстрим|экстрем/)) return "extreme";
  if (n.match(/solo|одиноч|одинок/)) return "solo";

  return "mountain"; // дефолт
}

function CategoryIcon({ name }) {
  const type = resolveIconTypeFromName(name);
  const Icon = ICON_MAP[type] || Mountain;

  return (
    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
      <Icon className="w-6 h-6 text-blue-600" />
    </div>
  );
}

export default function CategoryCard({
  category,
  isEditing,
  editName,
  editIcon,
  onEditToggle,
  onSave,
  onCancel,
  onDelete,
  onNameChange,
  onIconChange,
}) {
  // если вдруг category не пришёл — просто ничего не рисуем
  if (!category) return null;

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    onIconChange(file || null);
  };

  const name = category.name || "";
  const id = category.id ?? "—";
  const backendIconUrl = category.icon || category.icon_url || null;
  const hasBackendIcon = !!backendIconUrl;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col gap-3">
      {/* Верхняя строка: иконка + название + кнопки */}
      <div className="flex items-start gap-3">
        <CategoryIcon name={name} />

        <div className="flex-1">
          {isEditing ? (
            <input
              type="text"
              value={editName}
              onChange={(e) => onNameChange(e.target.value)}
              className="w-full text-base font-semibold text-gray-900 border-b border-gray-300 focus:border-blue-500 outline-none pb-1 bg-transparent"
              placeholder="Название категории"
            />
          ) : (
            <>
              <h2 className="text-base font-semibold text-gray-900">{name}</h2>
              <p className="text-xs text-gray-400">ID: {id}</p>
            </>
          )}
        </div>

        <div className="flex items-center gap-1">
          {isEditing ? (
            <>
              <button
                onClick={onSave}
                className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition"
                title="Сохранить"
              >
                <Save className="w-4 h-4" />
              </button>
              <button
                onClick={onCancel}
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                title="Отмена"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onEditToggle}
                className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition"
                title="Редактировать"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={onDelete}
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                title="Удалить"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Нижний блок: превью иконки из бэка (если есть) + загрузка */}
      <div className="flex items-center justify-between gap-3 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          {hasBackendIcon ? (
            <>
              <img
                src={backendIconUrl}
                alt={name}
                className="w-10 h-10 rounded-lg object-cover border border-gray-200"
              />
              <span>Иконка из бэка</span>
            </>
          ) : (
            <span className="italic text-gray-400">
              Иконка с бэка отсутствует, используется SVG по названию
            </span>
          )}
        </div>

        {isEditing && (
          <div className="flex flex-col items-end gap-1">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {editIcon && (
              <span className="text-[11px] text-gray-400">
                Файл выбран: {editIcon.name}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
