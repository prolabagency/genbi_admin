// src/components/categoryManegment/CategoryCard.jsx
import { Pencil, Trash2, Save, X } from "lucide-react";

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
  const handleIconChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onIconChange(file);
    }
  };

  const handleSaveClick = () => {
    console.log("=== СОХРАНЕНИЕ КАТЕГОРИИ ===");
    console.log("Category ID:", category.id);
    console.log("Edit Name:", editName);
    console.log("Edit Icon:", editIcon);
    console.log("Original Name:", category.name);

    if (!editName || editName.trim() === "") {
      alert("Название не может быть пустым");
      return;
    }

    onSave();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-all">
      {isEditing ? (
        // Режим редактирования
        <div className="p-5">
          {/* Заголовок режима редактирования */}
          <div className="mb-4 pb-3 border-b border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Редактирование категории
            </h4>
          </div>

          {/* Превью иконки */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-600 uppercase mb-2">
              Иконка
            </label>
            <div className="flex items-center gap-4">
              {editIcon ? (
                <img
                  src={URL.createObjectURL(editIcon)}
                  alt="Preview"
                  className="w-16 h-16 rounded object-cover border border-gray-300"
                />
              ) : category.icon ? (
                <img
                  src={category.icon}
                  alt={category.name}
                  className="w-16 h-16 rounded object-cover border border-gray-300"
                />
              ) : (
                <div className="w-16 h-16 rounded bg-gray-100 flex items-center justify-center border border-gray-300">
                  <span className="text-gray-400 text-xs">Нет</span>
                </div>
              )}
            </div>
          </div>

          {/* Инпут для названия */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-600 uppercase mb-2">
              Название
            </label>
            <input
              type="text"
              value={editName}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Введите название категории"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              autoFocus
            />
          </div>

          {/* Загрузка новой иконки */}
          <div className="mb-5">
            <label className="block text-xs font-medium text-gray-600 uppercase mb-2">
              Изменить иконку
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleIconChange}
              className="block w-full text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border file:border-gray-300 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 cursor-pointer"
            />
            {editIcon && (
              <p className="text-xs text-green-600 mt-1.5">
                Новое изображение выбрано
              </p>
            )}
          </div>

          {/* Кнопки действий */}
          <div className="flex gap-2 pt-2 border-t border-gray-200">
            <button
              onClick={handleSaveClick}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors flex items-center justify-center gap-1.5"
            >
              <Save size={16} />
              Сохранить
            </button>
            <button
              onClick={onCancel}
              className="flex-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-3 py-2 rounded text-sm font-medium transition-colors flex items-center justify-center gap-1.5"
            >
              <X size={16} />
              Отмена
            </button>
          </div>
        </div>
      ) : (
        // Режим просмотра
        <div>
          {/* Верхняя часть с иконкой */}
          <div className="p-5 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center gap-3">
              {category.icon ? (
                <img
                  src={category.icon}
                  alt={category.name}
                  className="w-12 h-12 rounded object-cover border border-gray-300"
                />
              ) : (
                <div className="w-12 h-12 rounded bg-gray-200 flex items-center justify-center border border-gray-300">
                  <span className="text-gray-400 text-xs">Нет</span>
                </div>
              )}
              <h3 className="text-base font-semibold text-gray-800 flex-1">
                {category.name}
              </h3>
            </div>
          </div>

          {/* Кнопки действий */}
          <div className="p-3 flex gap-2 bg-white">
            <button
              onClick={onEditToggle}
              className="flex-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center justify-center gap-1.5"
            >
              <Pencil size={14} />
              Изменить
            </button>
            <button
              onClick={onDelete}
              className="flex-1 bg-white hover:bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center justify-center gap-1.5"
            >
              <Trash2 size={14} />
              Удалить
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
