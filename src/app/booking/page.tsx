"use client";
import Popup from "@/components/Popup";
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
    roomNumber: "",
    userId: "",
    userInfoId: "",
  });
  const [error, setError] = useState("");
  const [pendingMeetings, setPendingMeetings] = useState<MeetingInfo[]>([]);
  const [disabledTimes, setDisabledTimes] = useState<any[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const organizations = ["AFBL,IT", "Takaful IT", "Akij Electronics"];
  const timeArray = [
    "08:00:00",
    "09:00:00",
    "10:00:00",
    "11:00:00",
    "12:00:00",
    "13:00:00",
    "14:00:00",
    "15:00:00",
    "16:00:00",
    "17:00:00",
  ];
  const attendees = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const selectedDate = formData.date;
        const roomNumber = formData.roomNumber;
        if (selectedDate && roomNumber) {
          const response = await axios.get(
            `https://ts-express-production.up.railway.app/book/getAllMeetingsByDateRoom/${selectedDate}/${roomNumber}`
          );
          const meetings: any[] = response.data;

          const meetingStatuses: MeetingInfo[] = meetings.map((meeting) => ({
            status: meeting.status,
            startTime: meeting.startTime,
            endTime: meeting.endTime,
          }));
          const pendingMeetings = meetingStatuses.filter(
            (meeting) => meeting.status === "pending"
          );

          setPendingMeetings(pendingMeetings);

          const bookedTimes = meetings
            .filter((meeting) => meeting.status !== "rejected")
            .map((meeting) => ({
              start: meeting.startTime,
              end: meeting.endTime,
            }));

          calculateDisabledTimes(bookedTimes);
        }
      } catch (error) {
        console.error("Error fetching meetings:", error);
      }
    };
    fetchMeetings();
  }, [formData.date, formData.roomNumber]);

  const calculateDisabledTimes = (bookedTimes: any) => {
    const disabledTimesSet = new Set();

    bookedTimes.forEach(({ start, end }: { start: string; end: string }) => {
      let startHour = parseInt(start.split(":")[0]);
      let endHour = parseInt(end.split(":")[0]);

      for (let hour = startHour; hour < endHour; hour++) {
        const formattedHour = hour.toString().padStart(2, "0");
        disabledTimesSet.add(`${formattedHour}:00:00`);
      }
    });

    setDisabledTimes(Array.from(disabledTimesSet));
  };

  useEffect(() => {
    const token = getToken();
    if (token) {
      try {
        const userId: any = getUserIdFromToken(token);
        setFormData({ ...formData, userId, userInfoId: userId });
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
    setError("");
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const { name, value } = e.target;

    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().split("T")[0]; // YYYY-MM-DD format
    const currentTimeString = currentDate.toTimeString().split(" ")[0]; // HH:MM:SS format

    const selectedDate = formData.date;
    const selectedTime = value;

    let isDisabled = false;

    if (selectedDate < currentDateString) {
      isDisabled = true;
    } else if (selectedDate === currentDateString) {
      if (selectedTime <= currentTimeString) {
        isDisabled = selectedTime <= currentTimeString;
        setError("Time is over in your local time zone");
      } else {
        setError("");
      }
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: isDisabled ? "" : value,
      endTime: "",
    }));
  };

  const handleEndTimeChange = (e: any) => {
    const newEndTime = e.currentTarget.value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      endTime: newEndTime,
    }));
  };

  const getEndTimeOptions = () => {
    if (!formData.startTime) return [];

    const startHour = parseInt(formData.startTime.split(":")[0]);
    const endHourOptions = [];

    for (let hour = startHour + 1; hour <= 18; hour++) {
      const formattedHour = hour.toString().padStart(2, "0");
      const time = `${formattedHour}:00:00`;

      endHourOptions.push(time);
    }

    return endHourOptions;
  };

  useEffect(() => {
    const endOptions = getEndTimeOptions();
    if (endOptions.length > 0 && formData.endTime !== endOptions[0]) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        endTime: endOptions[0],
      }));
    }
  }, [formData.startTime]);

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
      if (response.data.data.message) {
        setError(response.data.data.message);
        return;
      }
      setShowPopup(true);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.log("Response error:", error.response.data);
          setError("An error occurred. Please try again.");
        } else {
          console.log("Error:", error.message);
          setError(error.message);
        }
      } else {
        console.log("Error:", error);
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Book a meeting
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 sm:grid-cols-1 gap-4">
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
                  <option>Select Room</option>
                  <option value="101">101</option>
                  <option value="102">102</option>
                  <option value="103">103</option>
                </select>
              </div>
              <div className="mb-4 col-span-2 md:col-span-1 lg:col-span-1">
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
                  onChange={handleTimeChange}
                  disabled={!formData.date || !formData.roomNumber}
                  className="border-gray-300 border w-full rounded-md px-3 py-2"
                >
                  <option value="">Select Start Time</option>
                  {timeArray.map((time, index) => {
                    const isPending = pendingMeetings.some(
                      (meeting) =>
                        meeting.startTime === time &&
                        meeting.status === "pending"
                    );

                    return (
                      <option
                        key={index}
                        value={time}
                        disabled={disabledTimes.includes(time)}
                      >
                        {time.slice(0, 5)} {isPending && " - Pending"}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="mb-4 col-span-2 md:col-span-1 lg:col-span-1">
                <label
                  htmlFor="endTime"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Meeting End Time
                </label>
                <select
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleEndTimeChange}
                  className="border-gray-300 border w-full rounded-md px-3 py-2"
                  disabled={!formData.startTime}
                >
                  <option>Select End Time</option>
                  {getEndTimeOptions().map((time, index) => (
                    <option key={index} value={time}>
                      {time.split(":").slice(0, 2).join(":")}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4 col-span-2 md:col-span-1 lg:col-span-1">
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
                  {attendees.map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4 col-span-2 md:col-span-1 lg:col-span-1">
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
              <div className="mb-4 col-span-2">
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
            {showPopup && <Popup setShowPopup={setShowPopup} />}
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
