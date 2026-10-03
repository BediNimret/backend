import { Card } from "flowbite-react";
import Edit from "./Edit";
import { useState } from "react";

export default function Component({ product }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState({
    open: false,
    message: "",
  });

  const sessionId = localStorage.getItem("sessionId");

  const handleEditClick = () => {
    setIsOpen(true);
  };

  const handleSnackbar = (message) => {
    setShowSnackbar({ open: true, message });
    setTimeout(() => {
      setShowSnackbar({ open: false, message: "" });
    }, 5000);
  };

  const handleDelete = () => {
    handleSnackbar("Item deleted successfully");
  };

  return (
    <>
      <Card
        className="max-w-sm border-none hover:shadow-xl transition-transform hover:scale-105 hover:z-10 duration-300 hover:translate-y-[-8px] bg-white dark:bg-gray-800 [&_img]:h-24 [&_img]:object-cover"
        imgAlt="Image"
        imgSrc={product.url}
      >
        <div className="flex flex-col gap-4">
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {product.title} {product.price && ` ₹${product.price}`}
          </h5>

          <p className="font-normal text-gray-700 dark:text-gray-400">
            {product.description}
          </p>

          {sessionId && (
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handleEditClick}
                className="rounded-lg bg-purple-700 px-4 py-2 text-lg font-medium text-white hover:bg-purple-800 focus:outline-none"
              >
                Edit
              </button>

              <button
                onClick={handleDelete}
                className="rounded-lg bg-red-700 px-4 py-2 text-lg font-medium text-white hover:bg-red-800 hover:bg-red-700 focus:outline-none"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </Card>

      <Edit
        setIsOpen={setIsOpen}
        handleSnackbar={handleSnackbar}
        isOpen={isOpen}
        values={product}
      />

      {showSnackbar.open && (
        <div className="fixed z-100 bottom-4 left-0 h-12 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300">
          ✅ {showSnackbar.message}
        </div>
      )}
    </>
  );
}
