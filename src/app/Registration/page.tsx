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
    image: null as File | null
  });
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    phone: "",
    department: "",
    password: "",
    form: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target;
    const file = fileInput.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
      });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phoneNumber: string) => {
    const phoneRegex = /^\d{11}$/;
    return phoneRegex.test(phoneNumber);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Reset individual field error when user modifies the input
    setErrors({ ...errors, [name]: "", form: "" });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let hasError = false;
    const newErrors = { ...errors };

    if (!validatePassword(formData.password)) {
      newErrors.password = "Password must be at least 8 characters long and contain at least 1 letter and 1 number";
      hasError = true;
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email address";
      hasError = true;
    }

    if (!validatePhoneNumber(formData.phone)) {
      newErrors.phone = "Invalid phone number";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    try {
      const jsonData = JSON.stringify(formData);

      const response = await axios.post(
        "https://ts-express-production.up.railway.app/api/register",
        jsonData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.message) {
        setErrors({ ...errors, form: response.data.message });
      } else {
        router.push("/Login");
      }
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrors({ ...errors, form: error.response.data.message });
      } else {
        setErrors({ ...errors, form: "An unexpected error occurred" });
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
                  htmlFor="username"
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
                {errors.username && (
                  <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                )}
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
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
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
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
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
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
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
              <div className="col-span-2 mb-4">
                <label
                  htmlFor="image"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Upload Image
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="border-gray-300 border w-full rounded-md px-3 py-2"
                />
              </div>
              {previewImage && (
                <div className="col-span-2 mb-4">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="rounded-md w-full"
                  />
                </div>
              )}
            </div>

            {errors.form && <p className="text-red-500 mb-4">{errors.form}</p>}

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
