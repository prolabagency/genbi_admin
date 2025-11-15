import { useState, useEffect } from "react";
import { $API, $APIFORMS } from "../../axios";

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

  const fixIconUrl = (url) => {
    if (!url) return url;
    return url.replace(
      "http://tour_service:8000",
      "https://genbi-back.prolabagency.com"
    );
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await $API.get("/catalog/categories/");
      console.log("Categories response:", response.data);

      const categories = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];

      const fixedCategories = categories.map((cat) => ({
        ...cat,
        icon: fixIconUrl(cat.icon),
      }));

      setDataCategory(fixedCategories);
      setEmptyData(fixedCategories.length === 0);
    } catch (error) {
      console.error("Ошибка загрузки категорий:", error);
      setDataCategory([]);
      setEmptyData(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (formData) => {
    try {
      const response = await $APIFORMS.post("/catalog/categories/", formData);
      console.log("Category added:", response.data);

      const newCategory = {
        ...response.data,
        icon: fixIconUrl(response.data.icon),
      };

      setDataCategory([newCategory, ...dataCategory]);
      setShowAddForm(false);
      setEmptyData(false);
    } catch (error) {
      console.error(
        "Ошибка добавления категории:",
        error.response?.data || error
      );
      alert("Ошибка при добавлении категории");
    }
  };

  const handleEditCategory = (category) => {
    if (editingId === category.id) {
      setEditingId(null);
      setEditName("");
      setEditIcon(null);
    } else {
      setEditingId(category.id);
      setEditName(category.name);
      setEditIcon(null);
    }
  };

  const handleSaveEdit = async (categoryId) => {
    console.log("Saving category:", categoryId);
    console.log("Name:", editName);
    console.log("Icon:", editIcon);

    if (!editName || editName.trim() === "") {
      alert("Название категории не может быть пустым");
      return;
    }

    const formData = new FormData();
    formData.append("name", editName.trim());

    if (editIcon) {
      formData.append("icon", editIcon);
    }

    try {
      const response = await $APIFORMS.put(
        `/catalog/categories/${categoryId}`,
        formData
      );
      console.log("Category updated:", response.data);

      const updatedCategory = {
        ...response.data,
        icon: fixIconUrl(response.data.icon),
      };

      setDataCategory(
        dataCategory.map((cat) =>
          cat.id === categoryId ? updatedCategory : cat
        )
      );

      setEditingId(null);
      setEditName("");
      setEditIcon(null);
    } catch (error) {
      console.error(
        "Ошибка обновления категории:",
        error.response?.data || error
      );

      const errorMsg =
        error.response?.data?.detail ||
        error.response?.data?.name?.[0] ||
        error.response?.data?.icon?.[0] ||
        "Неизвестная ошибка";

      alert(`Ошибка при обновлении: ${errorMsg}`);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditIcon(null);
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm("Вы уверены, что хотите удалить эту категорию?")) {
      return;
    }

    try {
      await $API.delete(`/catalog/categories/${categoryId}`);
      console.log("Category deleted:", categoryId);

      setDataCategory(dataCategory.filter((cat) => cat.id !== categoryId));

      if (dataCategory.length === 1) {
        setEmptyData(true);
      }
    } catch (error) {
      console.error(
        "Ошибка удаления категории:",
        error.response?.data || error
      );
      alert("Ошибка при удалении категории");
    }
  };

  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
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

      {!loading && !emptyData && (
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
