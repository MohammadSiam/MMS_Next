"use client";
import NavBar from "@/components/Navbar";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export type FormData = {
  startTime: string;
  endTime: string;
  date: string;
  numberOfAttendees: string;
  organization: string;
  designation: string;
  roomNumber: string;
  userId: string; // Add userId property to FormData type
};

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
    userId: "",
  });
  const [error, setError] = useState("");

  const [bookedStartTime, setBookedStartTime] = useState<string[]>([]);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const selectedDate = formData.date;
        if (selectedDate) {
          const response = await axios.get(
            `http://localhost:3000/book/getAllMeetingsByDate/${selectedDate}`
          );
          const meetings: any[] = response.data;
          const bookedStartTimes = meetings.map((meeting) => meeting.startTime);
          const hoursArray = bookedStartTimes.map((time) => time.split(":")[0]);
          const uniqueHoursArray = Array.from(new Set(hoursArray));

          setBookedStartTime(uniqueHoursArray);
        }
      } catch (error) {
        console.error("Error fetching meetings:", error);
      }
    };
    fetchMeetings();
  }, [formData.date]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // Split the token into its parts: header, payload, and signature
        const parts = token.split(".");

        // Decode the payload part (which is the second part)
        const payload = JSON.parse(atob(parts[1]));

        // Extract the userId from the payload
        const userId = payload.userId;

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
    return hours >= 8 && hours < 18 && minutes >= 0 && minutes <= 60;
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const newStartTime = e.currentTarget.value;
    const selectedHour = newStartTime.split(":")[0]; // Extract the hour part

    const startTimeWithHourOnly = `${String(selectedHour).padStart(2, "0")}:00`;

    if (!isValidTime(startTimeWithHourOnly)) {
      setError("Start time must be between 8:00 am and 6:00 pm.");
    } else if (bookedStartTime.includes(selectedHour)) {
      setError("This time is already booked.");
    } else {
      setError("");
      // Update formData with new start time
      setFormData({
        ...formData,
        startTime: startTimeWithHourOnly,
        // Automatically update end time after 1 hour
        endTime: calculateEndTime(startTimeWithHourOnly),
      });
    }
  };

  // Function to calculate end time after 1 hour from start time
  const calculateEndTime = (startTime: string): string => {
    const start = new Date(`2000-01-01T${startTime}`);
    start.setHours(start.getHours() + 1);
    return `${String(start.getHours()).padStart(2, "0")}:${String(
      start.getMinutes()
    ).padStart(2, "0")}`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
    router.push("/meetingList");
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">Book a meeting</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2 mb-4">
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
                  // onChange={handleEndTimeChange}
                  min="08:00"
                  max="18:00"
                  disabled
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
              <div className=" mb-4">
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
