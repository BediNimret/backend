import { useActionState, useState } from "react";
import axios from "axios";
export default function Login({ isOpen, setIsOpen, handleSnackbar }) {
  const [isRegistering, setIsRegistering] = useState(false);
  async function handleSubmit(previousState, formData) {
    if (isRegistering) {
      if (formData.get("password") !== formData.get("confirmPassword")) {
        handleSnackbar("Passwords do not match.");
        return previousState;
      }
      try {
        const response = await axios.post(
          "http://localhost:8000/api/user/register",
          {
            email: formData.get("email"),
            password: formData.get("password"),
          },
          {
            withCredentials: true,
          },
        );
        localStorage.setItem("sessionId", response.data.data.uid);
        handleSnackbar(
          response.data.message || "Registration successful.",
          false,
        );
      } catch (error) {
        handleSnackbar("Registration failed.", true);
      }
      return previousState;
    } else {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/user/login",
          {
            email: formData.get("email"),
            password: formData.get("password"),
          },
          {
            withCredentials: true,
          },
        );
        localStorage.setItem("sessionId", response.data.data.uid);
        handleSnackbar(response.data.message || "Login successful.");
      } catch (error) {
        handleSnackbar("Invalid email or password.", true);
      }
    }
    setIsOpen(false);
    return previousState;
  }

  const [, actionState, isPending] = useActionState(handleSubmit, null);

  if (!isOpen) return null;
  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) setIsOpen(false);
        }}
      >
        <section
          aria-labelledby="login-title"
          aria-modal="true"
          className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
          role="dialog"
        >
          <form action={actionState} className="flex flex-col gap-4">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900" id="login-title">
                Login
              </h2>
              <button
                aria-label="Close login dialog"
                className="rounded px-2 py-1 text-2xl text-gray-500 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
                type="button"
              >
                &times;
              </button>
            </div>
            <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
              Email
              <input
                autoComplete="email"
                className="w-full rounded-md border px-4 py-3 outline-indigo-400"
                name="email"
                placeholder="Enter your email"
                required
                type="email"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
              Password
              <input
                autoComplete="current-password"
                className="w-full rounded-md border px-4 py-3 outline-indigo-400"
                name="password"
                placeholder="Enter your password"
                required
                type="password"
              />
            </label>
            {isRegistering && (
              <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
                Confirm password
                <input
                  autoComplete="current-password"
                  className="w-full rounded-md border px-4 py-3 outline-indigo-400"
                  name="confirmPassword"
                  placeholder="Re-enter your password"
                  required
                  type="password"
                />
              </label>
            )}
            <button
              className="mt-2 w-full rounded-md bg-indigo-500 py-3 font-bold text-white hover:bg-indigo-600"
              disabled={isPending}
              type="submit"
            >
              {isRegistering ? "Register" : "Login"}
            </button>
            <button
              className="mt-2 w-full rounded-md border border-indigo-500 py-3 font-bold text-indigo-600 hover:bg-indigo-50"
              onClick={() => setIsRegistering((registering) => !registering)}
              type="button"
            >
              {isRegistering ? "Login" : "Register"}
            </button>
          </form>
        </section>
      </div>
    </>
  );
}
