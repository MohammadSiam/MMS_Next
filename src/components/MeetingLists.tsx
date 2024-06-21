"use client";

import {
  getToken,
  getUserIdFromToken,
  redirectToLoginIfNoToken,
} from "@/utils/session";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "../app/loading";

const MeetingList = () => {
  const [meetings, setMeetings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const getStatusColor = (status: any) => {
    switch (status) {
      case "pending":
        return "text-blue-500"; // Blue color for pending
      case "rejected":
        return "text-red-500"; // Red color for rejected
      case "approved":
        return "text-green-500"; // Green color for approved
      default:
        return ""; // Default color if status doesn't match any condition
    }
  };

  useEffect(() => {
    const fetchMeetings = async () => {
      if (!redirectToLoginIfNoToken(router)) {
        return;
      }

      const token = getToken();
      if (token) {
        const userId = getUserIdFromToken(token);
        if (userId) {
          try {
            const response = await axios.get(
              `https://ts-express-production.up.railway.app/book/getMeetingByUserId/${userId}`
            );
            setMeetings(response.data.data);
          } catch (error) {
            console.log(error);
          }
        }
      }
    };

    fetchMeetings();
  }, []);

  if (!isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="container mx-auto p-4 w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Your Meeting Lists
        </h1>
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-4 py-2">
                  Start Time
                </th>
                <th scope="col" className="py-2 px-4">
                  End Time
                </th>
                <th scope="col" className="py-2 px-14">
                  Date
                </th>
                <th scope="col" className="py-2 px-4">
                  Number of Attendees
                </th>
                <th scope="col" className="py-2 px-4">
                  Organization
                </th>
                <th scope="col" className="py-2 px-4">
                  Designation
                </th>
                <th scope="col" className="py-2 px-4">
                  Room Number
                </th>
                <th scope="col" className="py-2 px-4">
                  Status
                </th>
                {/* Add more headers as needed */}
              </tr>
            </thead>

            <tbody>
              {meetings.map((meeting: any, index: number) => (
                <tr
                  key={index}
                  className={`${index % 2 === 0 ? "bg-white" : "bg-gray-200"}`}
                >
                  <td className="text-center px-2 py-2">{meeting.startTime}</td>
                  <td className="text-center px-4 py-2">{meeting.endTime}</td>
                  <td className="text-center px-4 py-2">{meeting.date}</td>
                  <td className="text-center px-4 py-2">
                    {meeting.numberOfAttendees}
                  </td>
                  <td className="text-center px-4 py-2">
                    {meeting.organization}
                  </td>
                  <td className="text-center px-4 py-2">
                    {meeting.designation}
                  </td>
                  <td className="text-center px-4 py-2">
                    {meeting.roomNumber}
                  </td>
                  <td
                    className={`text-center px-4 py-2 ${getStatusColor(
                      meeting.status
                    )}`}
                  >
                    {meeting.status}
                  </td>
                  {/* Add more columns for other meeting data */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default MeetingList;
