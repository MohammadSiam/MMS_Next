"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import NavBar from "./Navbar";

const MeetingList = () => {
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        // Retrieve the JWT token from localStorage
        const token = localStorage.getItem("token");

        if (token) {
          // Split the token into its parts: header, payload, and signature
          const parts = token.split(".");

          // Decode the payload part (which is the second part)
          const payload = JSON.parse(atob(parts[1]));

          // Extract the userId from the payload
          const userId = payload.userId;

          // Fetch meetings using the userId
          const response = await axios.get(
            `http://localhost:3000/book/getMeetingByUserId/${userId}`
          );

          // Set meetings state with fetched data
          setMeetings(response.data.data);
        } else {
          console.error("JWT token not found in localStorage");
        }
      } catch (error) {
        console.error("Error fetching meetings:", error);
      }
    };

    fetchMeetings();
  }, []);

  return (
    <>
      <NavBar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Your Meetings</h1>
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="text-left py-2">Start Time</th>
              <th className="text-left py-2">End Time</th>
              <th className="text-left py-2">Date</th>
              <th className="text-left py-2">Number of Attendees</th>
              <th className="text-left py-2">Organization</th>
              <th className="text-left py-2">Designation</th>
              <th className="text-left py-2">Room Number</th>
              <th className="text-left py-2">Status</th>
              {/* Add more headers as needed */}
            </tr>
          </thead>
          <tbody>
            {meetings.map((meeting: any, index: number) => (
              <tr key={index}>
                <td className="px-4 py-2">{meeting.startTime}</td>
                <td className="px-4 py-2">{meeting.endTime}</td>
                <td className="px-4 py-2">{meeting.date}</td>
                <td className="px-4 py-2">{meeting.numberOfAttendees}</td>
                <td className="px-4 py-2">{meeting.organization}</td>
                <td className="px-4 py-2">{meeting.designation}</td>
                <td className="px-4 py-2">{meeting.roomNumber}</td>
                <td className="px-4 py-2">{meeting.status}</td>
                {/* Add more columns for other meeting data */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default MeetingList;
