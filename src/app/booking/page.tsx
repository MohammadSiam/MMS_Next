"use client";
import NavBar from "@/components/Navbar";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const BookingSystem: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    startTime: "",
    endTime: "",
    date: "",
    numberOfAttendees: "",
    organization: "",
    designation: "",
    roomNumber: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token);
    if (token) {
      try {
        // Split the token into its parts: header, payload, and signature
        const parts = token.split(".");

        // Decode the payload part (which is the second part)
        const payload = JSON.parse(atob(parts[1]));

        // Extract the userId from the payload
        const userId = payload.userId;

        console.log(payload);
        console.log(userId);

        // Update formData with userId
        setFormData({ ...formData, userId });
      } catch (error) {
        console.error("Error decoding token:", error);
        // Handle any decoding errors here
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const isValidTime = (time: string): boolean => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours >= 8 && hours < 18 && minutes >= 0 && minutes < 60;
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartTime = e.target.value;
    if (!isValidTime(newStartTime)) {
      setError("Start time must be between 8:00 am and 6:00 pm.");
    } else {
      setError("");
      setFormData({ ...formData, startTime: newStartTime });
    }
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndTime = e.target.value;
    if (!isValidTime(newEndTime)) {
      setError("End time must be between 8:00 am and 6:00 pm.");
    } else {
      setError("");
      setFormData({ ...formData, endTime: newEndTime });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Add booking logic here
    console.log(formData);

    try {
      const jsonData = JSON.stringify(formData);

      const response = await axios.post(
        "http://localhost:3000/book/booking",
        jsonData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
    // setFormData({
    //   startTime: "",
    //   endTime: "",
    //   date: "",
    //   numberOfAttendees: "",
    //   organization: "",
    //   designation: "",
    //   roomNumber: "",
    // });
    alert("Wait for admin approval");
    // router.push("/");
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">Book a meeting</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label
                  htmlFor="startTime"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Meeting Start Time
                </label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleStartTimeChange}
                  min="08:00"
                  max="18:00"
                  className="border-gray-300 border w-full rounded-md px-3 py-2"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="endTime"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Meeting End Time
                </label>
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleEndTimeChange}
                  min="08:00"
                  max="18:00"
                  className="border-gray-300 border w-full rounded-md px-3 py-2"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="date"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="border-gray-300 border w-full rounded-md px-3 py-2"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="numberOfAttendees"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Number of Attendees
                </label>
                <input
                  type="number"
                  id="numberOfAttendees"
                  name="numberOfAttendees"
                  value={formData.numberOfAttendees}
                  onChange={handleChange}
                  max={10}
                  className="border-gray-300 border w-full rounded-md px-3 py-2"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="organization"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Organization
                </label>
                <input
                  type="text"
                  id="organization"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  className="border-gray-300 border w-full rounded-md px-3 py-2"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="designation"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Designation
                </label>
                <input
                  type="text"
                  id="designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className="border-gray-300 border w-full rounded-md px-3 py-2"
                />
              </div>
              <div className="col-span-2 mb-4">
                <label
                  htmlFor="roomNumber"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Room Number
                </label>
                <select
                  id="roomNumber"
                  name="roomNumber"
                  value={formData.roomNumber}
                  onChange={handleChange}
                  className="border-gray-300 border w-full rounded-md px-3 py-2"
                >
                  <option value="">Select Room</option>
                  <option value="101">101</option>
                  <option value="102">102</option>
                  <option value="103">103</option>
                  {/* Add more options as needed */}
                </select>
              </div>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md"
            >
              Book
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default BookingSystem;
