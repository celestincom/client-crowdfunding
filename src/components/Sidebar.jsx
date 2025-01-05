import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDisconnect, useAddress } from "@thirdweb-dev/react"; // Added useAddress to check connection
import { logo, sun } from "../assets";
import { navlinks } from "../constants";

const Icon = ({ styles, name, imgUrl, isActive, disabled, handleClick }) => (
  <div
    className={`w-12 h-12 rounded-lg flex justify-center items-center 
      ${isActive === name ? "bg-[#2c2f32]" : "bg-transparent"} 
      ${!disabled ? "cursor-pointer" : "opacity-50"} ${styles}`}
    onClick={!disabled ? handleClick : undefined}
  >
    <img
      src={imgUrl}
      alt={`${name}_icon`}
      className={`w-6 h-6 ${isActive !== name && "grayscale"}`}
    />
  </div>
);

const Sidebar = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState("dashboard");
  const disconnect = useDisconnect(); // Metamask disconnect hook
  const address = useAddress(); // Check if the user is connected

  const handleLogout = () => {
    disconnect(); // Disconnect Metamask on logout
    navigate("/"); // Redirect to home page
  };

  // Filter navlinks based on connection status
  const visibleNavlinks = address
    ? navlinks // Show all links if connected
    : navlinks.filter((link) => link.name === "dashboard"); // Show only "dashboard" if not connected

  return (
    <div className="flex flex-col items-center justify-between h-[93vh] sticky top-5">
      <Link to="/">
        <Icon styles="w-13 h-13 bg-[#2c2f32]" imgUrl={logo} />
      </Link>

      <div className="flex-1 flex flex-col items-center justify-between bg-[#1c1c24] rounded-2xl w-[76px] py-4 mt-12">
        <div className="flex flex-col items-center gap-3">
          {visibleNavlinks.map((link) => (
            <Icon
              key={link.name}
              {...link}
              isActive={isActive}
              handleClick={() => {
                if (link.name === "logout") {
                  handleLogout(); // Call logout handler
                } else if (!link.disabled) {
                  setIsActive(link.name);
                  navigate(link.link);
                }
              }}
            />
          ))}
        </div>

        {/* <Icon styles="bg-[#1c1c24] shadow-lg" imgUrl={sun} /> */}
      </div>
    </div>
  );
};

export default Sidebar;
