import React from "react";
import axios from "axios";
import ProductTable from "./ProductTable";
import Login from "./Login";
function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const logout = async () => {
  if (isLoggedIn) {
    try {
      await axios.post(
        "http://localhost:5001/api/logout",
        {},
        { withCredentials: true },
      );
      setIsLoggedIn(false);
      localStorage.removeItem("token");
    } catch (error) {
      console.error(
        "Failed to log out:",
        error.response?.data?.message ?? error.message,
      );
    }
  }
  };
  return (
    <>
      <div className="flex items-center justify-between px-4 py-2 bg-purple-700 text-white">
        <h1 className="text-2xl font-bold">Expense Manager Application</h1>

        <button
          onClick={logout}
          className="bg-white text-purple-700 px-4 py-2 rounded-md hover:bg-gray-200"
        >
          {!isLoggedIn ? "Login" : "Logout"}
        </button>
      </div>
      {!isLoggedIn && <Login setIsLoggedIn={setIsLoggedIn} />}
      {isLoggedIn && <ProductTable />}
    </>
  );
}
export default App;
