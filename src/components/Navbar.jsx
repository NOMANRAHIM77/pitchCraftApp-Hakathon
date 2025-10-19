// Navbar.jsx
import React from "react";
import { UseAuthContext } from "../context/AuthProvider";

const Navbar = () => {
  const { userDetails } = UseAuthContext();

  return (
    <nav className="w-full bg-white shadow-sm flex items-center justify-between px-6 py-3">
      {/* Left: Project Name */}
      <h1 className="text-2xl font-semibold text-red-800">Pitch Craft</h1>

      {/* Right: User Name */}
      <div className="flex items-center space-x-2">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTq80-YDylX9NJ_Yt6noJ-1j-_TUbCnkky736WsD2H_aH5Kb8Dzu_o0eOg&s"
          alt="profile"
          className="w-20 h-15 rounded-full"
        />
        <span className="font-medium text-gray-700">
          {userDetails?.firstName} {userDetails?.surName}
        </span>
      </div>
    </nav>
  );
};

export default Navbar;
