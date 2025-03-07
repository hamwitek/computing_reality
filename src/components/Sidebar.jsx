import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import authStore from "../store/authStore";
import Logo from "/short_logo_transparent.webp";

export default function Sidebar() {
  // Get authentication state and functions from your store
  const { token } = authStore();
  const logout = authStore((state) => state.logout);
  const userData = authStore((state) => state.userData);
  const fetchUser = authStore((state) => state.fetchUser);

  const navigate = useNavigate();

  function logoutUser() {
    logout();
    navigate("/");
  }

  // Check if user is logged in
  const isLoggedIn = !!token;
  // Fetch user data when component mounts
  useEffect(() => {
    // Only attempt to fetch if user is logged in and we don't already have user data
    if (isLoggedIn) {
      fetchUser();
    }
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="flex flex-col w-64 h-screen overflow-auto">
      <div className="flex flex-col px-6 overflow-y-auto bg-white border-r border-gray-200 shadow-lg grow gap-y-5">
        <div className="flex items-center my-2">
          <Link to="/">
            <img
              src={Logo}
              width={70}
              height={50}
              responsive="true"
              alt="Logo white"
            />
          </Link>
        </div>
        <nav className="flex flex-col flex-1">
          <ul role="list" className="flex flex-col flex-1 gap-y-7">
            <li>
              <Link to="/dashboard" className="underline">
                Dashboard
              </Link>
            </li>
            {/* Only show Courses link if user is a superuser */}
            {userData.is_superuser && (
              <li>
                <Link to="/dashboard/courses" className="underline">
                  Courses
                </Link>
              </li>
            )}
            {userData.is_superuser && (
              <li>
                <Link to="/dashboard/users" className="underline">
                  Users
                </Link>
              </li>
            )}
            <li>
              <Link to="/dashboard/settings" className="underline">
                Settings
              </Link>
            </li>
            {isLoggedIn && (
              <li className="mt-auto -mx-6">
                <div className="px-6 py-3">
                  <div className="flex flex-col">
                    {userData && (
                      <div className="flex items-center mb-2">
                        <span className="inline-block rounded-full bg-green-500 w-3 h-3 mr-2"></span>
                        <span className="truncate text-sm text-gray-700">
                          {userData.email}
                        </span>
                      </div>
                    )}
                    <button
                      className="px-4 py-2 my-2 text-sm text-white bg-black rounded cursor-pointer hover:bg-red-700"
                      onClick={() => logoutUser()}
                    >
                      Logga ut
                    </button>
                  </div>
                </div>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
}
