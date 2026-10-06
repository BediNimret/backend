import { useState, useEffect } from "react";
import Card from "./Card";
import { MdAdd } from "react-icons/md";
import { ImSpinner2 } from "react-icons/im";
import Edit from "./Edit";
import Login from "./Login";
import { FiLogIn } from "react-icons/fi";
import axios from "axios";
function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const handleEditClick = () => {
    setIsOpen(true);
  };
  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("http://localhost:8000/api/product", {
          withCredentials: true,
        });
        console.log("Products fetched:", data);
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error(
          "Error fetching products:",
          error.response?.data || error.message,
        );
        setLoading(false);
      }
    };

    getProducts();
  }, []);
  const [showSnackbar, setShowSnackbar] = useState({
    open: false,
    message: "",
    error: false,
  });
  const handleSnackbar = (message, isError = false) => {
    setShowSnackbar({ open: true, message, error: isError });
    setTimeout(() => {
      setShowSnackbar({ open: false, message: "", error: false });
    }, 5000);
  };
  const sessionId = localStorage.getItem("sessionId");
  const role = localStorage.getItem("role");

  const logout = async () => {
    setLoading(true);
    try {
      await axios.post(
        "http://localhost:8000/api/user/logout",
        {
          sessionId: sessionId,
        },
        {
          withCredentials: true,
        },
      );
      localStorage.removeItem("sessionId");
      handleSnackbar("Logged out successfully");
      setLoading(false);
    } catch (error) {
      handleSnackbar("Error logging out", true);
      setLoading(false);
    }
  };
  return (
    <>
      <div className="flex border-none w-full h-screen max-w-full flex-col overflow-x-hidden bg-gradient-to-r from-purple-200 to-pink-200">
        <div className="flex items-center justify-between px-4 py-2 bg-purple-700 text-white">
          <h1 className="text-2xl font-bold">My E-commerce App</h1>
          {sessionId && role === "ADMIN" && (
            <button
              onClick={handleEditClick}
              className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-purple-700 hover:bg-gray-100 focus:outline-none"
              disabled={loading}
            >
              {loading ? (
                <ImSpinner2
                  aria-hidden="true"
                  className="animate-spin text-xl"
                />
              ) : (
                <MdAdd className="text-xl " />
              )}
              Add Product
            </button>
          )}
          <button
            className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-purple-700 hover:bg-gray-100 focus:outline-none"
            onClick={() => (!sessionId ? setIsLoginOpen(true) : logout())}
            type="button"
          >
            <FiLogIn className="text-xl" />
            {sessionId ? "Logout" : "Login"}
          </button>
        </div>
        {showSnackbar.open && showSnackbar.error && (
          <div className="fixed z-100 bottom-4 left-0 h-12 bg-red-800 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300">
            {showSnackbar.message}
          </div>
        )}
        {showSnackbar.open && !showSnackbar.error && (
          <div className="fixed z-100 bottom-4 left-0 h-12 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300">
            ✅ {showSnackbar.message}
          </div>
        )}
        <div className="flex flex-col items-center justify-center gap-4 p-4">
          <div className="flex items-center justify-center gap-4 ">
            <h1 className="text-5xl text-purple-800 text-center font-bold  m-10 ">
              Products List
            </h1>
          </div>
          <Edit
            setIsOpen={setIsOpen}
            handleSnackbar={handleSnackbar}
            isOpen={isOpen}
          />
          <Login
            handleSnackbar={handleSnackbar}
            isOpen={isLoginOpen}
            setIsOpen={setIsLoginOpen}
          />
          <div className="mx-auto grid  max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <Card key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
