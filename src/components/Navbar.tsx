// NavBar.tsx
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const NavBar: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Access localStorage only on the client side
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

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
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link legacyBehavior href="/admin">
                  <a className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                    Admin
                  </a>
                </Link>
                <Link legacyBehavior href="/Registration">
                  <a className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                    Registration
                  </a>
                </Link>
                {token && (
                  <>
                    <Link legacyBehavior href="/booking">
                      <a className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                        Booking
                      </a>
                    </Link>
                    <Link legacyBehavior href="/meetingList">
                      <a className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                        Meetings
                      </a>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;