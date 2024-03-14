import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export type Datatype = {
  meeting: MeetingType;
  username: string;
  email: string;
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
  const router = useRouter();
  const [meetings, setMeetings] = useState<Datatype[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [buttonClicked, setButtonClicked] = useState(false); // State to track if button is clicked

  const fetchMeetings = async () => {
    try {
      const token = sessionStorage.getItem("token");

      if (!token) {
        router.push("/Login");
      }
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

  useEffect(() => {
    // Fetch admin status for the logged-in user
    const fetchAdmins = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/findAllAdmin`
        );

        setAdmins(response.data);
      } catch (error) {
        console.error("Error fetching admin status:", error);
      }
    };

    fetchAdmins(); // Call the async function to fetch admins
  }, []);

  const handleAction = async (
    meetingId: any,
    action: string,
    index: number
  ) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/book/${meetingId}/${action}`
      );
      if (response.status === 200) {
        console.log(`Meeting ${action}ed successfully`);
        // Update the status in the local state
        const updatedMeetings = [...meetings];
        updatedMeetings[index].meeting.status =
          action === "approve" ? "approved" : "rejected";
        setMeetings(updatedMeetings);
      } else {
        console.error(`Failed to ${action} meeting:`, response.data);
      }
    } catch (error) {
      console.error(`Error ${action}ing meeting:`, error);
    }
  };

  const handleChangeRole = async (email: string) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/updateAdminRole/${email}`
      );
      console.log(response.data);
      if (response.status === 200) {
        console.log("Role changed successfully");
      } else {
        console.error("Failed to change role:", response.data);
      }
      setButtonClicked(true);
    } catch (error) {
      console.error("Error changing role:", error);
    }
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            <thead className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
              <tr>
                <th className="py-2">Start Time</th>
                <th className="py-2">End Time</th>
                <th className="py-2">Date</th>
                <th className="py-2">Number of Attendees</th>
                <th className="py-2">Organization</th>
                <th className="py-2">Designation</th>
                <th className="py-2">Room Number</th>
                <th className="py-2">User Name</th>
                <th className="py-2">Action</th>
                <th className="py-2">Change Role</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(meetings) &&
                meetings.map((data, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-200"
                    }`}
                  >
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
                              handleAction(
                                data.meeting.meetingId,
                                "approve",
                                index
                              )
                            }
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() =>
                              handleAction(
                                data.meeting.meetingId,
                                "reject",
                                index
                              )
                            }
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {Array.isArray(admins) ? (
                        admins.some(
                          (admin) =>
                            admin.email === data.email && admin.role === "admin"
                        ) ? (
                          <button
                            className="bg-green-500 text-white font-bold py-2 px-4 rounded cursor-not-allowed"
                            disabled
                          >
                            Admin
                          </button>
                        ) : (
                          <button
                            onClick={() => handleChangeRole(data.email)}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            disabled={buttonClicked}
                          >
                            {buttonClicked ? "Admin" : "Make Admin"}
                          </button>
                        )
                      ) : null}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
