
import { useState } from "react";
import { Save, X } from "lucide-react";

export default function AddCategoryForm({ onSubmit, onCancel }) {
  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const formData = new FormData();
    formData.append("name", newName);
    if (newIcon) formData.append("icon", newIcon);

    onSubmit(formData);
    setNewName("");
    setNewIcon(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
      <form onSubmit={handleSubmit} className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            {newIcon ? (
              <img
                src={URL.createObjectURL(newIcon)}
                alt="Preview"
                className="w-20 h-20 rounded-lg object-cover border border-gray-200"
              />
            ) : (
              <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                <span className="text-gray-400">IMG</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewIcon(e.target.files[0])}
              className="mt-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between">
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
          </div>
        </div>
      </form>
    </div>
  );
}
