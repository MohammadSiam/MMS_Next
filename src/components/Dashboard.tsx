import axios from "axios";
import { useEffect, useState } from "react";
import NavBar from "./Navbar";

export type Datatype = {
  meeting: MeetingType;
  username: string;
};

export type MeetingType = {
  startTime: string;
  endTime: string;
  date: string;
  numberOfAttendees: string;
  organization: string;
  designation: string;
  roomNumber: number;
  meetingId: number;
  accepted: boolean;
  rejected: boolean; // Added a new property to track rejection
  status: string;
};

const Dashboard = () => {
  const [meetings, setMeetings] = useState<Datatype[]>([]);

  const fetchMeetings = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/book/getAllMeetings"
      );
      setMeetings(response.data.data);
    } catch (error) {
      console.error("Error fetching meetings:", error);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const handleAccept = async (meetingId: any, index: number) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/book/${meetingId}/approve`
      );
      if (response.status === 200) {
        console.log("Meeting accepted successfully");
        // Update the status in the local state
        const updatedMeetings = [...meetings];
        updatedMeetings[index].meeting.status = "approved";
        setMeetings(updatedMeetings);
      } else {
        console.error("Failed to accept meeting:", response.data);
      }
    } catch (error) {
      console.error("Error accepting meeting:", error);
    }
  };

  const handleReject = async (meetingId: any, index: number) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/book/${meetingId}/reject`
      );
      if (response.status === 200) {
        console.log("Meeting rejected successfully");
        // Update the status in the local state
        const updatedMeetings = [...meetings];
        updatedMeetings[index].meeting.status = "rejected";
        setMeetings(updatedMeetings);
      } else {
        console.error("Failed to reject meeting:", response.data);
      }
    } catch (error) {
      console.error("Error rejecting meeting:", error);
    }
  };

  return (
    <>
      <NavBar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
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
              <th className="text-left py-2">User Name</th>
              <th className="text-left py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(meetings) &&
              meetings.map((data, index) => (
                <tr key={index}>
                  <td className="px-4 py-2">{data.meeting.startTime}</td>
                  <td className="px-4 py-2">{data.meeting.endTime}</td>
                  <td className="px-4 py-2">{data.meeting.date}</td>
                  <td className="px-4 py-2">
                    {data?.meeting?.numberOfAttendees}
                  </td>
                  <td className="px-4 py-2">{data.meeting.organization}</td>
                  <td className="px-4 py-2">{data.meeting.designation}</td>
                  <td className="px-4 py-2">{data.meeting.roomNumber}</td>
                  <td className="px-4 py-2">{data.username}</td>
                  <td className="px-4 py-2">
                    {data.meeting.status === "approved" ? (
                      <span className="text-green-500">Accepted</span>
                    ) : data.meeting.status === "rejected" ? (
                      <span className="text-red-500">Rejected</span>
                    ) : (
                      <>
                        <button
                          onClick={() =>
                            handleAccept(data.meeting.meetingId, index)
                          }
                          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() =>
                            handleReject(data.meeting.meetingId, index)
                          }
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Dashboard;
