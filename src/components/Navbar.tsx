// NavBar.tsx
"use client";
import { getRoleFromToken, getToken, removeToken } from "@/utils/session";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const NavBar: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null); // Change type to string
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    // Fetch user role when component mounts
    const fetchUserRole = async () => {
      const sessionToken = getToken();
      setToken(sessionToken);
      if (sessionToken) {
        const userRole = getRoleFromToken(sessionToken);
        setRole(userRole);
      } else {
        setToken(null);
        setRole(null);
      }
    };
    fetchUserRole();
  }, []);

  const handleLogout = () => {
    removeToken();
    // Update token and role state
    setToken(null);
    setRole(null);
    // Redirect to login page
    router.push("/Login");
  };

  return (
    <nav className="bg-gray-800 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center w-full justify-between">
            <div className="flex-shrink-0">
              <Link legacyBehavior href="/">
                <a className="text-white font-bold">Home</a>
              </Link>
            </div>
            <div className="hidden md:block ml-4">
              <div className="flex items-baseline space-x-4">
                {role && ( // Check if role exists
                  <>
                    {(role === "admin" || role === "super admin") && (
                      <Link legacyBehavior href="/admin/dashboard">
                        <a className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                          Admin Dashboard
                        </a>
                      </Link>
                    )}
                    <Link legacyBehavior href="/booking">
                      <a className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                        Meeting Booking
                      </a>
                    </Link>
                    <Link legacyBehavior href="/meetingList">
                      <a className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                        Meetings List
                      </a>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Logout
                    </button>
                  </>
                )}
                {!role && ( // Check if role does not exist
                  <>
                    <Link legacyBehavior href="/Registration">
                      <a className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                        Registration
                      </a>
                    </Link>
                    <Link legacyBehavior href="/Login">
                      <a className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                        Login
                      </a>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="block md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              {isOpen ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {role && ( // Check if role exists
              <>
                {(role === "admin" || role === "super admin") && (
                  <Link legacyBehavior href="/admin/dashboard">
                    <a className="text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium">
                      Admin Dashboard
                    </a>
                  </Link>
                )}
                <Link legacyBehavior href="/booking">
                  <a className="text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium">
                    Booking
                  </a>
                </Link>
                <Link legacyBehavior href="/meetingList">
                  <a className="text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium">
                    Meetings
                  </a>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Logout
                </button>
              </>
            )}
            {!role && ( // Check if role does not exist
              <>
                <Link legacyBehavior href="/Registration">
                  <a className="text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium">
                    Registration
                  </a>
                </Link>
                <Link legacyBehavior href="/Login">
                  <a className="text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium">
                    Login
                  </a>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
