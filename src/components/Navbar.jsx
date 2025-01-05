import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { useStateContext } from "../context";
import { CustomButton, FundCard } from "./";
import { logo, menu, search, thirdweb } from "../assets";
import { navlinks } from "../constants";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isActive, setIsActive] = useState("dashboard");
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const { connect, address, getCampaigns } = useStateContext();

  const [searchInput, setSearchInput] = useState("");
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef(null);

  // Fetch all campaigns on mount
  useEffect(() => {
    const fetchCampaigns = async () => {
      const allCampaigns = await getCampaigns();
      setCampaigns(allCampaigns);
    };
    fetchCampaigns();
  }, [getCampaigns]);

  // Filter campaigns based on search input
  useEffect(() => {
    if (searchInput.trim() === "") {
      setFilteredCampaigns([]);
    } else {
      const filtered = campaigns.filter((campaign) =>
        campaign.title.toLowerCase().includes(searchInput.toLowerCase())
      );
      setFilteredCampaigns(filtered);
    }
  }, [searchInput, campaigns]);

  // Handle outside clicks to hide dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setShowDropdown(false);
  }, [location]);

  return (
    <div className="flex md:flex-row flex-col-reverse justify-between mb-[35px] gap-6">
      <div
        className="lg:flex-1 flex flex-row max-w-[458px] py-2 pl-4 pr-2 h-[52px] bg-[#1c1c24] rounded-[100px] relative"
        ref={dropdownRef}
      >
        <input
          type="text"
          placeholder="Search for campaigns"
          className="flex w-full font-epilogue font-normal text-[14px] placeholder:text-[#4b5264] text-white bg-transparent outline-none"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onFocus={() => setShowDropdown(true)}
        />

        <div className="w-[72px] h-full rounded-[20px] bg-[#4acd8d] flex justify-center items-center cursor-pointer">
          <img
            src={search}
            alt="search"
            className="w-[15px] h-[15px] object-contain"
          />
        </div>

        {showDropdown && filteredCampaigns.length > 0 && (
          <div className="absolute top-[60px] left-0 w-[50vw] bg-[#1c1c29] z-10 rounded-[10px] shadow-lg max-h-[400px] overflow-y-auto p-4 flex flex-wrap gap-4 custom-scrollbar">
            {filteredCampaigns.map((campaign) => (
              <div
                key={campaign.pId}
                className="border border-[#ffffff1a] rounded-[15px]"
              >
                <FundCard
                  owner={campaign.owner}
                  title={campaign.title}
                  description={campaign.description}
                  target={campaign.target}
                  deadline={campaign.deadline}
                  amountCollected={campaign.amountCollected}
                  image={campaign.image}
                  handleClick={() =>
                    navigate(`/campaign-details/${campaign.pId}`, {
                      state: campaign,
                    })
                  }
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="sm:flex hidden flex-row justify-end gap-4">
        <CustomButton
          btnType="button"
          title={address ? "Create a campaign" : "Connect"}
          styles={address ? "bg-[#1dc071]" : "bg-[#8c6dfd]"}
          handleClick={() => {
            if (address) navigate("create-campaign");
            else connect();
          }}
        />

        {/* Conditionally render profile picture */}
        {address && (
          <Link to="/profile">
            <div className="w-[52px] h-[52px] rounded-full bg-[#2c2f32] flex justify-center items-center cursor-pointer">
              <img
                src={thirdweb}
                alt="user"
                className="w-[60%] h-[60%] object-contain"
              />
            </div>
          </Link>
        )}
      </div>

      {/* Small screen navigation */}
      <div className="sm:hidden flex justify-between items-center relative">
        <div className="w-[40px] h-[40px] rounded-[10px] bg-[#2c2f32] flex justify-center items-center cursor-pointer">
          <img
            src={logo}
            alt="user"
            className="w-[60%] h-[60%] object-contain"
          />
        </div>

        <img
          src={menu}
          alt="menu"
          className="w-[34px] h-[34px] object-contain cursor-pointer"
          onClick={() => setToggleDrawer((prev) => !prev)}
        />

        <div
          className={`absolute top-[60px] right-0 left-0 bg-[#1c1c24] z-10 shadow-secondary py-4 ${
            !toggleDrawer ? "-translate-y-[100vh]" : "translate-y-0"
          } transition-all duration-700`}
        >
          <ul className="mb-4">
            {navlinks.map((link) => (
              <li
                key={link.name}
                className={`flex p-4 ${
                  isActive === link.name && "bg-[#3a3a43]"
                }`}
                onClick={() => {
                  setIsActive(link.name);
                  setToggleDrawer(false);
                  navigate(link.link);
                }}
              >
                <img
                  src={link.imgUrl}
                  alt={link.name}
                  className={`w-[24px] h-[24px] object-contain ${
                    isActive === link.name ? "grayscale-0" : "grayscale"
                  }`}
                />
                <p
                  className={`ml-[20px] font-epilogue font-semibold text-[14px] ${
                    isActive === link.name ? "text-[#1dc071]" : "text-[#808191]"
                  }`}
                >
                  {link.name}
                </p>
              </li>
            ))}
          </ul>

          <div className="flex mx-4">
            <CustomButton
              btnType="button"
              title={address ? "Create a campaign" : "Connect"}
              styles={address ? "bg-[#1dc071]" : "bg-[#8c6dfd]"}
              handleClick={() => {
                if (address) navigate("create-campaign");
                else connect();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
