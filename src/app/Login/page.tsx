// pages/LoginPage.tsx
"use client";
import { AuthContext } from "@/context/AuthContext";
import {
  getRoleFromToken,
  getUserIdFromToken,
  redirectUserBasedOnRole,
  setToken,
} from "@/utils/session";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { setIsLoggedIn } = authContext;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const jsonData = JSON.stringify(formData);

      const response = await axios.post(
        "https://ts-express-production.up.railway.app/api/login",
        jsonData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setToken(response.data.token);

      const userId: any = getUserIdFromToken(response.data.token);
      if (userId) {
        sessionStorage.setItem("userId", userId);
      }

      const role = getRoleFromToken(response.data.token);
      if (role) {
        redirectUserBasedOnRole(role, router);
      }
      setIsLoggedIn(true);
      setFormData({
        email: "",
        password: "",
      });
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };
  return (
    <div>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-semibold mb-2"
              >
                Email
              </label>
              <input
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="border-gray-300 border w-full rounded-md px-3 py-2"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-gray-700 font-semibold mb-2"
              >
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="border-gray-300 border w-full rounded-md px-3 py-2"
                />
                {formData.password && (
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 px-4 py-2"
                    onClick={toggleShowPassword}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                )}
              </div>
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md"
            >
              Login
            </button>
          </form>
          <p className="mt-4 text-gray-600 text-sm">
            New User?{" "}
            <a href="/Registration" className="text-blue-500 hover:underline">
              Registration here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
