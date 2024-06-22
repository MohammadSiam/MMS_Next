"use client";
import { getToken, getUserIdFromToken } from "@/utils/session";
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

type MeetingInfo = {
  status: string;
  startTime: string;
};

const BookingSystem: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    startTime: "",
    endTime: "",
    date: getCurrentDate(),
    numberOfAttendees: 1,
    organization: "",
    designation: "",
    roomNumber: "101",
    userId: "",
  });
  const [error, setError] = useState("");
  const [bookedStartTime, setBookedStartTime] = useState<string[]>([]);
  const [pendingMeetings, setPendingMeetings] = useState<MeetingInfo[]>([]);
  const organizations = ["AFBL,IT", "Takaful IT", "Akij Electronics"];

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const selectedDate = formData.date;
        const roomNumber = formData.roomNumber;
        if (selectedDate) {
          const response = await axios.get(
            `https://ts-express-production.up.railway.app/book/getAllMeetingsByDateRoom/${selectedDate}/${roomNumber}`
          );
          const meetings: any[] = response.data;
          const meetingStatuses: MeetingInfo[] = meetings.map((meeting) => ({
            status: meeting.status,
            startTime: meeting.startTime,
          }));
          const pendingMeetings = meetingStatuses.filter(
            (meeting) => meeting.status === "pending"
          );

          setPendingMeetings(pendingMeetings);
          const bookedStartTimes = meetings
            .filter((meeting) => meeting.status != "rejected")
            .map((meeting) => meeting.startTime);

          const hoursArray = bookedStartTimes.map((time) => time.split(":")[0]);
          const uniqueHoursArray = Array.from(new Set(hoursArray));

          setBookedStartTime(uniqueHoursArray);
        }
      } catch (error) {
        console.error("Error fetching meetings:", error);
      }
    };
    fetchMeetings();
  }, [formData.date, formData.roomNumber]);

  useEffect(() => {
    const token = getToken();
    if (token) {
      try {
        const userId: any = getUserIdFromToken(token);
        setFormData({ ...formData, userId });
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
    if (!token) {
      router.push("/Login");
    }
  }, []);

  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleStartTimeChange = (e: any): void => {
    e.preventDefault();
    const newStartTime = e.currentTarget.value;
    const selectedHour = newStartTime.split(":")[0]; // Extract the hour part

    const startTimeWithHourOnly = `${String(selectedHour).padStart(2, "0")}:00`;
    console.log(startTimeWithHourOnly, newStartTime);

    setFormData({
      ...formData,
      startTime: newStartTime,
      // Automatically update end time after 1 hour
      endTime: calculateEndTime(startTimeWithHourOnly),
    });
  };
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
        "https://ts-express-production.up.railway.app/book/booking",
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
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Book a meeting
          </h2>
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
                  min={getCurrentDate()}
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
                  <option value="101">101</option>
                  <option value="102">102</option>
                  <option value="103">103</option>
                </select>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="startTime"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Meeting Start Time
                </label>
                <select
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleStartTimeChange}
                  disabled={!formData.date || !formData.roomNumber}
                  className="border-gray-300 border w-full rounded-md px-3 py-2"
                >
                  <option value="">Select Start Time</option>
                  {Array.from({ length: 10 }, (_, index) => {
                    const hour = index + 8; // Starting from 8:00
                    const formattedHour = hour.toString().padStart(2, "0");
                    const time = `${formattedHour}:00:00`;

                    // Check if the time is in bookedStartTime array
                    const isBooked = bookedStartTime.includes(formattedHour);
                    // Check if the time is in pendingMeetings array
                    const isPending = pendingMeetings.some(
                      (meeting) =>
                        meeting.startTime === time &&
                        meeting.status === "pending"
                    );

                    return (
                      <option
                        key={hour}
                        value={time}
                        disabled={isBooked || isPending} // Disable the option if the time is booked
                      >
                        {time.split(":").slice(0, 2).join(":")}{" "}
                        {isPending && " - Pending"}
                      </option>
                    );
                  })}
                </select>
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
                <select
                  id="numberOfAttendees"
                  name="numberOfAttendees"
                  value={formData.numberOfAttendees}
                  onChange={handleChange}
                  className="border-gray-300 border w-full rounded-md px-3 py-2"
                >
                  {[...Array(10)].map((_, index) => (
                    <option key={index + 1} value={index + 1}>
                      {index + 1}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="organization"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Organization
                </label>
                <select
                  id="organization"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  className="border-gray-300 border w-full rounded-md px-3 py-2"
                >
                  <option value="">Select Organization</option>
                  {organizations.map((org, index) => (
                    <option key={index} value={org}>
                      {org}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-2 mb-4">
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
