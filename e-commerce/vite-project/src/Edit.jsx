import { useActionState } from "react";
import axios from "axios";
export default function EditModal({
  isOpen,
  setIsOpen,
  handleSnackbar,
  values,
}) {
  const editMode = values && Object.keys(values).length > 0;
  const handleSave = async (prevValues, formData) => {
    const title = formData.get("title");
    const description = formData.get("description");
    const price = formData.get("price");
    const url = formData.get("url");

    try {
      await axios.post(`http://localhost:8000/api/product`, {
        title,
        description,
        price,
        url,
      });
      setIsOpen(false);
      handleSnackbar("Item added successfully");
      return { title, description, price, url };
    } catch (error) {
      handleSnackbar("Error adding item");
      throw error;
    }
  };
  const handleUpdate = async (prevValues, formData) => {
    const title = formData.get("title");
    const description = formData.get("description");
    const price = formData.get("price");
    const url = formData.get("url");

    try {
      const response = await axios.put(
        `http://localhost:8000/api/product/${values._id}`,
        {
          title,
          description,
          price,
          url,
        },
      );
      setIsOpen(false);
      handleSnackbar("Item updated successfully");
      return { title, description, price, url };
    } catch (error) {
      handleSnackbar("Error updating item");
      throw error;
    }
  };
  const [state, formAction, isPending] = useActionState(
    editMode ? handleUpdate : handleSave,
    {
      title: values?.title || "",
      description: values?.description || "",
      price: values?.price || "",
      url: values?.url || "",
    },
  );
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold">
          {editMode ? "Edit Item" : "Add Item"}
        </h2>
        <form action={formAction} className="flex flex-col gap-4">
          <input
            type="text"
            name="title"
            defaultValue={state.title}
            className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter Name"
            required
          />
          <input
            type="text"
            name="description"
            defaultValue={state.description}
            className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter Description"
            required
          />
          <input
            type="number"
            name="price"
            defaultValue={state.price}
            className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="₹0.00"
            required
          />
          <input
            type="text"
            name="url"
            defaultValue={state.url}
            className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter URL"
            required
          />

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg border px-4 py-2"
              disabled={isPending}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
              disabled={isPending}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
