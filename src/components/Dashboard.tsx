"use client";
import Loading from "@/app/loading";
import { getRoleFromToken, getToken } from "@/utils/session";
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
  const [superAdmins, setSuperAdmins] = useState<any[]>([]);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null); // State to store user role


  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();

        if (!token) {
          router.push("/Login");
          return;
        }

        const response = await axios.get(
          "https://ts-express-production.up.railway.app/book/getAllMeetings"
        );
        setMeetings(response.data.data);
      } catch (error) {
        console.error("Error fetching meetings:", error);
      }
    };

    fetchData(); // Call the asynchronous function immediately
  }, []);

  useEffect(() => {
    // Fetch admin status for the logged-in user
    const fetchSuperAdmins = async () => {
      try {
        const response = await axios.get(
          "https://ts-express-production.up.railway.app/api/findSuperAdmin"
        );

        setSuperAdmins(response.data);
      } catch (error) {
        console.error("Error fetching admin status:", error);
      }
    };

    fetchSuperAdmins(); // Call the async function to fetch admins
  }, []);

  useEffect(() => {
    // Fetch admin status for the logged-in user
    const fetchAdmins = async () => {
      try {
        const response = await axios.get(
          "https://ts-express-production.up.railway.app/api/findAllAdmin"
        );

        setAdmins(response.data);
      } catch (error) {
        console.error("Error fetching admin status:", error);
      }
    };

    fetchAdmins(); // Call the async function to fetch admins
  }, []);

  useEffect(() => {
    const token: any = getToken();
    const role = getRoleFromToken(token);
    // console.log(role);
    setUserRole(role);
  }, []);



  const handleAction = async (
    meetingId: any,
    action: string,
    index: number
  ) => {
    try {
      const response = await axios.put(
        `https://ts-express-production.up.railway.app/book/${meetingId}/${action}`
      );
      if (response.status === 200) {
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
        `https://ts-express-production.up.railway.app/api/updateAdminRole/${email}`
      );
      setButtonClicked(true);
    } catch (error) {
      console.error("Error changing role:", error);
    }
  };



  return (
    <>
      <div className="container mx-auto p-4 w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Admin Dashboard</h1>
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className=" px-4 py-2">Start Time</th>
                <th className="px-4 py-2">End Time</th>
                <th className="px-14 py-2">Date</th>
                <th className="px-4 py-2">Number of Attendees</th>
                <th className="px-4 py-2">Organization</th>
                <th className="px-4 py-2">Designation</th>
                <th className="px-4 py-2">Room Number</th>
                <th className="px-4 py-2">User Name</th>
                {userRole !== "user" && (
                  <>
                    <th className="px-14 py-2">Action</th>
                    {userRole === "super admin" && <th className="px-8 py-2">Change Role</th>}
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {Array.isArray(meetings) && meetings.map((data, index) => (
                <tr key={index} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-200"}`}>
                  <td className="px-4 py-2">{data.meeting.startTime}</td>
                  <td className="px-4 py-2">{data.meeting.endTime}</td>
                  <td className="text-center py-2">{data.meeting.date}</td>
                  <td className="text-center py-2">{data.meeting.numberOfAttendees}</td>
                  <td className="text-center py-2">{data.meeting.organization}</td>
                  <td className="text-center py-2">{data.meeting.designation}</td>
                  <td className="text-center py-2">{data.meeting.roomNumber}</td>
                  <td className="px-4 py-2">{data.username}</td>
                  <td className="text-center py-2 md:mb-1">
                    {(userRole === "super admin" || userRole === "admin") && (
                      data.meeting.status === "approved" ? (
                        <span className="text-green-500">Accepted</span>
                      ) : data.meeting.status === "rejected" ? (
                        <span className="text-red-500">Rejected</span>
                      ) : (
                        <>
                          <button
                            onClick={() => handleAction(data.meeting.meetingId, "approve", index)}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleAction(data.meeting.meetingId, "reject", index)}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                          >
                            Reject
                          </button>
                        </>
                      )
                    )}
                  </td>
                  {userRole === "super admin" && (
                    <td className="text-center py-2">
                      {!superAdmins.some((admin) => admin.email === data.email) &&
                        !admins.some((admin) => admin.email === data.email) && (
                          <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 rounded"
                            onClick={() => handleChangeRole(data.email)}
                            disabled={buttonClicked}
                          >
                            {buttonClicked ? "Admin Done" : "Make admin"}
                          </button>
                        )}
                    </td>
                  )}
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
