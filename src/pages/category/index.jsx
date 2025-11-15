// src/pages/category/index.jsx (главный компонент)
import { useState, useEffect } from "react";
import { $API, $APIFORMS } from "../../axios";

// Импорты подкомпонентов
import CategoryCard from "../../components/categoryManegment/CategoryCard";
import AddCategoryForm from "../../components/categoryManegment/AddCategoryForm";
import Filters from "../../components/categoryManegment/FilterCategory";

export default function Categories() {
  const [dataCategory, setDataCategory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [emptyData, setEmptyData] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editIcon, setEditIcon] = useState(null);

  // Fetch категорий
  const fetchCategories = () => {
    setLoading(true);
    $API
      .get("/catalog/categories/")
      .then((response) => {
        console.log("RAW response.data:", response.data);
        const categories = Array.isArray(response.data)
          ? response.data
          : response.data.results || [];

        // Исправляем URL иконок если они содержат tour_service
        const fixedCategories = categories.map((cat) => ({
          ...cat,
          icon: cat.icon
            ? cat.icon.replace(
                "http://tour_service:8000",
                "https://genbi-back.prolabagency.com"
              )
            : cat.icon,
        }));

        setDataCategory(fixedCategories);
        setEmptyData(fixedCategories.length === 0);
      })
      .catch((error) => {
        console.error("Ошибка fetch:", error);
        setDataCategory([]);
        setEmptyData(true);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Добавление новой категории
  const handleAddCategory = (formData) => {
    $APIFORMS
      .post("/catalog/categories/", formData)
      .then((response) => {
        // Исправляем URL иконки если содержит tour_service
        const fixedData = {
          ...response.data,
          icon: response.data.icon
            ? response.data.icon.replace(
                "http://tour_service:8000",
                "https://genbi-back.prolabagency.com"
              )
            : response.data.icon,
        };
        setDataCategory([fixedData, ...dataCategory]);
        setShowAddForm(false);
      })
      .catch((error) => {
        console.error(
          "Ошибка добавления:",
          error.response?.data || error.message
        );
        alert("Ошибка при добавлении категории");
      });
  };

  // Toggle редактирования
  const handleEditCategory = (category) => {
    if (editingId === category.id) {
      // Если уже редактируем эту категорию - закрываем
      setEditingId(null);
      setEditName("");
      setEditIcon(null);
    } else {
      // Открываем редактирование новой категории
      setEditingId(category.id);
      setEditName(category.name);
      setEditIcon(null);
    }
  };

  // Сохранение изменений
  const handleSaveEdit = (categoryId) => {
    console.log("=== handleSaveEdit вызван ===");
    console.log("categoryId:", categoryId);
    console.log("editName:", editName);
    console.log("editIcon:", editIcon);

    if (!editName || editName.trim() === "") {
      alert("Название категории не может быть пустым");
      return;
    }

    const formData = new FormData();
    formData.append("name", editName.trim());

    // Добавляем иконку только если она была изменена
    if (editIcon) {
      formData.append("icon", editIcon);
      console.log("Добавлена новая иконка в FormData");
    }

    console.log(
      "Отправка PUT запроса на:",
      `/catalog/categories/${categoryId}/`
    );

    $APIFORMS
      .put(`/catalog/categories/${categoryId}/`, formData)
      .then((response) => {
        console.log("Успешный ответ:", response.data);

        // Исправляем URL иконки если содержит tour_service
        const fixedData = {
          ...response.data,
          icon: response.data.icon
            ? response.data.icon.replace(
                "http://tour_service:8000",
                "https://genbi-back.prolabagency.com"
              )
            : response.data.icon,
        };

        setDataCategory(
          dataCategory.map((cat) => (cat.id === categoryId ? fixedData : cat))
        );
        setEditingId(null);
        setEditName("");
        setEditIcon(null);
      })
      .catch((error) => {
        console.error("=== ОШИБКА ОБНОВЛЕНИЯ ===");
        console.error("Full error:", error);
        console.error("Response data:", error.response?.data);
        console.error("Status:", error.response?.status);
        console.error("Headers:", error.response?.headers);

        const errorMsg =
          error.response?.data?.detail ||
          error.response?.data?.name?.[0] ||
          error.response?.data?.icon?.[0] ||
          "Неизвестная ошибка";

        alert(`Ошибка при обновлении категории: ${errorMsg}`);
      });
  };

  // Удаление
  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm("Удалить категорию?")) return;

    try {
      await $API.delete(`/catalog/categories/${categoryId}/`);
      setDataCategory(dataCategory.filter((cat) => cat.id !== categoryId));
    } catch (error) {
      console.error("Ошибка удаления:", error.response?.data || error.message);
      alert("Ошибка при удалении категории");
    }
  };

  // Отмена редактирования
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditIcon(null);
  };

  // Toggle формы добавления
  const toggleAddForm = () => setShowAddForm(!showAddForm);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Управление категориями
        </h1>
        <p className="text-gray-600">
          Создавайте и редактируйте категории товаров
        </p>
      </div>

      <Filters onAddClick={toggleAddForm} />

      {showAddForm && (
        <AddCategoryForm
          onSubmit={handleAddCategory}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">Загрузка категорий...</p>
        </div>
      )}

      {!loading && emptyData && !showAddForm && (
        <div className="text-center py-8">
          <p className="text-gray-500">Категорий пока нет</p>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dataCategory.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              isEditing={editingId === category.id}
              editName={editName}
              editIcon={editIcon}
              onEditToggle={() => handleEditCategory(category)}
              onSave={() => handleSaveEdit(category.id)}
              onCancel={handleCancelEdit}
              onDelete={() => handleDeleteCategory(category.id)}
              onNameChange={(value) => setEditName(value)}
              onIconChange={(file) => setEditIcon(file)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
