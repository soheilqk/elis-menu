"use client";

import { useState, useEffect } from "react";
import { supabase, type Category, type Item } from "@/lib/supabase";
import Link from "next/link";

// Add global styles for form inputs
const inputStyles =
  "w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500";
const selectStyles =
  "w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500";
const textareaStyles =
  "w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500";

export default function AdminPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"categories" | "items">(
    "categories"
  );

  // Fetch data from Supabase
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from("categories")
          .select("*")
          .order("id");

        if (categoriesError) throw categoriesError;
        setCategories(categoriesData || []);

        // Fetch items
        const { data: itemsData, error: itemsError } = await supabase
          .from("items")
          .select("*")
          .order("id");

        if (itemsError) throw itemsError;
        setItems(itemsData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to fetch data. Please check console for details.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
        <header className="mb-8">
          <div className="flex justify-between items-center mb-6 flex-col-reverse sm:flex-row gap-4 sm:gap-0 text-center sm:text-left">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                <span className="font-[var(--font-pacifico)] text-teal-700">
                  Eli's Coffee Shop
                </span>
                <span className="font-normal text-xl"> - Admin Panel</span>
              </h1>
            </div>
            <Link
              href="/"
              className="bg-teal-600 text-white text-center px-2 py-2 rounded-md hover:bg-teal-700 transition-colors text-xs sm:px-4"
            >
              Back to Website
            </Link>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px gap-4">
              <button
                onClick={() => setActiveTab("categories")}
                className={` py-4 px-1 ${
                  activeTab === "categories"
                    ? "border-b-2 border-teal-500 text-teal-800 font-medium"
                    : "text-gray-700 hover:text-gray-900 hover:border-gray-300"
                }`}
              >
                Categories
              </button>
              <button
                onClick={() => setActiveTab("items")}
                className={`py-4 px-1 ${
                  activeTab === "items"
                    ? "border-b-2 border-teal-500 text-teal-800 font-medium"
                    : "text-gray-700 hover:text-gray-900 hover:border-gray-300"
                }`}
              >
                Menu Items
              </button>
            </nav>
          </div>
        </header>

        {loading ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading data...</p>
          </div>
        ) : (
          <div>
            {activeTab === "categories" ? (
              <CategoriesManager
                categories={categories}
                setCategories={setCategories}
              />
            ) : (
              <ItemsManager
                items={items}
                setItems={setItems}
                categories={categories}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Categories Manager Component
function CategoriesManager({
  categories,
  setCategories,
}: {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
}) {
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      const { data, error } = await supabase
        .from("categories")
        .insert([{ title: newCategory.trim() }])
        .select();

      if (error) throw error;
      if (data) {
        setCategories([...categories, data[0]]);
        setNewCategory("");
      }
    } catch (error) {
      console.error("Error adding category:", error);
      alert("Failed to add category. Please check console for details.");
    }
  }

  async function handleUpdateCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!editingCategory || !editingCategory.title.trim()) return;

    try {
      const { error } = await supabase
        .from("categories")
        .update({ title: editingCategory.title.trim() })
        .eq("id", editingCategory.id);

      if (error) throw error;

      setCategories(
        categories.map((cat) =>
          cat.id === editingCategory.id ? editingCategory : cat
        )
      );
      setEditingCategory(null);
    } catch (error) {
      console.error("Error updating category:", error);
      alert("Failed to update category. Please check console for details.");
    }
  }

  async function handleDeleteCategory(id: number) {
    if (
      !confirm(
        "Are you sure you want to delete this category? This will affect all items in this category."
      )
    ) {
      return;
    }

    try {
      const { error } = await supabase.from("categories").delete().eq("id", id);

      if (error) throw error;

      setCategories(categories.filter((cat) => cat.id !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category. Please check console for details.");
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-900">
        Manage Categories
      </h2>

      {/* Add Category Form */}
      <form onSubmit={handleAddCategory} className="mb-8 flex gap-2">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category title"
          className={`flex-1 ${inputStyles}`}
          required
        />
        <button
          type="submit"
          className="bg-teal-600 text-white px-2 py-2 rounded-md hover:bg-teal-700 transition-colors text-xs sm:text-base sm:px-4"
        >
          Add Category
        </button>
      </form>

      {/* Edit Category Form */}
      {editingCategory && (
        <form
          onSubmit={handleUpdateCategory}
          className="mb-8 bg-gray-50 p-4 rounded-md"
        >
          <h3 className="text-lg font-medium mb-2 text-gray-900">
            Edit Category
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={editingCategory.title}
              onChange={(e) =>
                setEditingCategory({
                  ...editingCategory,
                  title: e.target.value,
                })
              }
              className={`flex-1 ${inputStyles}`}
              required
            />
            <button
              type="submit"
              className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors"
            >
              Update
            </button>
            <button
              type="button"
              onClick={() => setEditingCategory(null)}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Categories List */}
      <div className="bg-white rounded-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                ID
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                  No categories found. Add your first category above.
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right hidden sm:table-cell">
                    {category.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                    {category.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center justify-end space-x-4">
                      <button
                        onClick={() => setEditingCategory(category)}
                        className="text-teal-600 hover:text-teal-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Items Manager Component
function ItemsManager({
  items,
  setItems,
  categories,
}: {
  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
  categories: Category[];
}) {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState<Partial<Item>>({
    title: "",
    description: "",
    price: 0,
    image_path: "",
    category: 0,
  });

  function resetForm() {
    setFormData({
      title: "",
      description: "",
      price: 0,
      image_path: "",
      category: categories[0]?.id || 0,
    });
    setImageFile(null);
    setImagePreview(null);
    setShowForm(false);
    setEditingItem(null);
    setUploadProgress(0);
  }

  function handleEditItem(item: Item) {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      price: item.price,
      image_path: item.image_path,
      category: item.category,
    });
    setImagePreview(item.image_path);
    setShowForm(true);
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  async function uploadImage() {
    if (!imageFile) return null;

    try {
      setIsUploading(true);

      // Create a unique file name
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Math.random()
        .toString(36)
        .substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `menu-images/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from("items")
        .upload(filePath, imageFile, {
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Simulate upload progress since we can't use onUploadProgress
      setUploadProgress(100);

      // Get the public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("items").getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
      return null;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validate form
    if (!formData.title?.trim() || !formData.category) {
      alert("Title and category are required");
      return;
    }

    try {
      // Handle image upload if a new image was selected
      let imagePath = formData.image_path;
      if (imageFile) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) {
          imagePath = uploadedUrl;
        }
      }

      if (editingItem) {
        // Update existing item
        const { error } = await supabase
          .from("items")
          .update({
            title: formData.title,
            description: formData.description || "",
            price: formData.price || 0,
            image_path: imagePath,
            category: formData.category,
          })
          .eq("id", editingItem.id);

        if (error) throw error;

        setItems(
          items.map((item) =>
            item.id === editingItem.id
              ? {
                  ...item,
                  title: formData.title || "",
                  description: formData.description || "",
                  price: formData.price || 0,
                  image_path: imagePath || "",
                  category: formData.category || 0,
                }
              : item
          )
        );
      } else {
        // Add new item
        const { data, error } = await supabase
          .from("items")
          .insert([
            {
              title: formData.title,
              description: formData.description || "",
              price: formData.price || 0,
              image_path: imagePath,
              category: formData.category,
            },
          ])
          .select();

        if (error) throw error;
        if (data) {
          setItems([...items, data[0]]);
        }
      }

      resetForm();
    } catch (error) {
      console.error("Error saving item:", error);
      alert("Failed to save item. Please check console for details.");
    }
  }

  async function handleDeleteItem(id: number) {
    if (!confirm("Are you sure you want to delete this item?")) {
      return;
    }

    try {
      // Get the item to find its image path
      const itemToDelete = items.find((item) => item.id === id);

      // Delete from the database
      const { error } = await supabase.from("items").delete().eq("id", id);
      if (error) throw error;

      // Attempt to delete the image from storage if it exists
      if (
        itemToDelete?.image_path &&
        itemToDelete.image_path.includes("items/menu-images")
      ) {
        // Extract the path from the URL
        const path = itemToDelete.image_path.split("/").slice(-2).join("/");
        await supabase.storage.from("items").remove([path]);
      }

      setItems(items.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item. Please check console for details.");
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Manage Menu Items
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors text-xs sm:text-base"
        >
          {showForm ? "Cancel" : "Add New Item"}
        </button>
      </div>

      {/* Add/Edit Item Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 bg-gray-50 p-4 rounded-md"
        >
          <h3 className="text-lg font-medium mb-4 text-gray-900">
            {editingItem ? "Edit Item" : "Add New Item"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={formData.title || ""}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className={inputStyles}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={formData.category || ""}
                onChange={(e) =>
                  setFormData({ ...formData, category: Number(e.target.value) })
                }
                className={selectStyles}
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <input
                type="number"
                value={formData.price || 0}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
                min="0"
                step="1"
                className={inputStyles}
              />
            </div>

            {/* Image Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image
              </label>
              <div className="flex flex-col space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                             file:rounded-md file:border-0 file:text-sm file:font-semibold
                             file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                />
                {imagePreview && (
                  <div className="mt-2 relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-md border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setImageFile(null);
                        if (!editingItem) {
                          setFormData({ ...formData, image_path: "" });
                        }
                      }}
                      className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                    >
                      &times;
                    </button>
                  </div>
                )}

                {/* Show current path if exists and no new image */}
                {!imagePreview && formData.image_path && (
                  <div>
                    <p className="text-sm text-gray-500 truncate">
                      Current: {formData.image_path}
                    </p>
                    <img
                      src={formData.image_path}
                      alt="Current"
                      className="w-32 h-32 object-cover rounded-md border border-gray-300 mt-1"
                    />
                  </div>
                )}

                {/* Upload Progress Bar */}
                {isUploading && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div
                      className="bg-teal-600 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}

                <p className="text-xs text-gray-500 mt-1">
                  Or use an image URL path below
                </p>
              </div>
            </div>

            {/* Manual Image Path Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image Path (URL)
              </label>
              <input
                type="text"
                value={formData.image_path || ""}
                onChange={(e) =>
                  setFormData({ ...formData, image_path: e.target.value })
                }
                disabled={!!imageFile}
                placeholder="/images/..."
                className={`${inputStyles} ${
                  imageFile
                    ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                    : ""
                }`}
              />
              {imageFile && (
                <p className="text-xs text-gray-500 mt-1">
                  This field is disabled because you're uploading a new image
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className={textareaStyles}
              ></textarea>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className={`bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors ${
                isUploading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isUploading
                ? `Uploading (${uploadProgress}%)`
                : editingItem
                ? "Update Item"
                : "Add Item"}
            </button>
          </div>
        </form>
      )}

      {/* Items List */}
      <div className="bg-white rounded-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                ID
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                Image
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No items found. Add your first item above.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right hidden sm:table-cell">
                    {item.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right hidden sm:table-cell">
                    {item.image_path ? (
                      <div className="flex justify-start">
                        <img
                          src={item.image_path}
                          alt={item.title}
                          className="h-10 w-10 rounded-md object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/images/placeholder.jpg";
                          }}
                        />
                      </div>
                    ) : (
                      <div className="flex justify-start">
                        <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center text-gray-500">
                          <span className="text-xs">No img</span>
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                    {item.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    {categories.find((c) => c.id === item.category)?.title ||
                      "Unknown"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right hidden sm:table-cell">
                    {item.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-4">
                      <button
                        onClick={() => handleEditItem(item)}
                        className="text-teal-600 hover:text-teal-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
