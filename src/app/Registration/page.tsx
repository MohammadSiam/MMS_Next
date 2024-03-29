"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

const RegistrationPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    department: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isFormValid = () => {
    // Check if all form fields are valid
    return (
      isPasswordValid(formData.password) &&
      isEmailValid(formData.email) &&
      isPhoneNumberValid(formData.phone)
    );
  };
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const isPasswordValid = (password: any) => {
    // Password should be at least 8 characters long
    // and should contain at least one character and one digit
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  const isEmailValid = (email: any) => {
    // Regular expression to validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isPhoneNumberValid = (phoneNumber: any) => {
    // Regular expression for basic phone number validation
    // This regex allows for digits only and expects exactly 10 digits
    const phoneRegex = /^\d{11}$/;
    return phoneRegex.test(phoneNumber);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add registration logic here
    // Once registration is successful, navigate to login page
    try {
      if (isFormValid()) {
        const jsonData = JSON.stringify(formData);

        const response = await axios.post(
          "http://localhost:3000/api/register",
          jsonData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        // console.log(response.data.message);
        router.push("/Login");
      }
    } catch (error: any) {
      console.log(error);
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
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">Registration</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 mb-4">
                <label
                  htmlFor="firstName"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="border-gray-300 border w-full rounded-md px-3 py-2"
                />
              </div>

              <div className="col-span-2 mb-4">
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="border-gray-300 border w-full rounded-md px-3 py-2"
                />
                {!isEmailValid(formData.email) && (
                  <p className="text-red-500 text-xs mt-1">
                    Please enter a valid email address.
                  </p>
                )}
              </div>
              <div className="col-span-2 mb-4">
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
                {!isPasswordValid(formData.password) && (
                  <p className="text-red-500 text-xs mt-1">
                    Password must be at least 8 characters long and contain at
                    least one letter and one digit.
                  </p>
                )}
              </div>
              <div className="col-span-2 mb-4">
                <label
                  htmlFor="phone"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Phone Number
                </label>
                <input
                  type="phone"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="border-gray-300 border w-full rounded-md px-3 py-2"
                />
              </div>
              <div className="col-span-2 mb-4">
                <label
                  htmlFor="department"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Department
                </label>
                <input
                  type="department"
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="border-gray-300 border w-full rounded-md px-3 py-2"
                />
              </div>
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}

            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md"
            >
              Register
            </button>
          </form>
          <p className="mt-4 text-gray-600 text-sm">
            Already registered?{" "}
            <a href="/Login" className="text-blue-500 hover:underline">
              Login here
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default RegistrationPage;
