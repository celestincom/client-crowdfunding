import React, { useState, useEffect } from "react";
import { DisplayCampaigns, RestrictedAccessBox} from "../components";
import { useStateContext } from "../context";
import { ethers } from "ethers";

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [totalRaised, setTotalRaised] = useState(0);
  const [totalDonated, setTotalDonated] = useState(0);

  const { address, contract, getUserCampaigns, getCampaigns, getDonations, connect } =
    useStateContext();

  const fetchCampaigns = async () => {
    if (!address) return; // Prevent execution if not connected

    setIsLoading(true);

    try {
      const allCampaigns = await getCampaigns(); // Get all campaigns
      const userCampaigns = await getUserCampaigns(); // Get campaigns created by the current user

      setCampaigns(userCampaigns);

      // Calculate total raised for your campaigns
      const raisedSum = userCampaigns.reduce(
        (sum, campaign) => sum + parseFloat(campaign.amountCollected),
        0
      );
      setTotalRaised(raisedSum);

      let donatedSum = 0;
      for (const campaign of allCampaigns) {
        const donations = await getDonations(campaign.pId);

        // Only filter if address exists
        const userDonations = address
          ? donations.filter(
              (donation) => donation.donator.toLowerCase() === address.toLowerCase()
            )
          : [];

        const userTotalDonations = userDonations.reduce(
          (sum, donation) => sum + parseFloat(donation.donation),
          0
        );
        donatedSum += userTotalDonations;
      }
      setTotalDonated(donatedSum);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch campaigns if address and contract exist
    if (contract && address) fetchCampaigns();
  }, [address, contract]);

  const formatValue = (value) => {
    if (value < 0.0000001) {
      let formattedValue = ethers.utils.formatUnits(value, 18);
      formattedValue = parseFloat(formattedValue).toString();
      return formattedValue;
    } else {
      let formattedValue = parseFloat(value).toFixed(8);

      if (formattedValue.endsWith("0")) {
        formattedValue = parseFloat(value).toFixed(7);
        if (formattedValue.endsWith("0")) {
          formattedValue = parseFloat(value).toFixed(6);
          if (formattedValue.endsWith("0")) {
            formattedValue = parseFloat(value).toFixed(5);
            if (formattedValue.endsWith("0")) {
              formattedValue = parseFloat(value).toFixed(4);
            }
          }
        }
      }
      return formattedValue;
    }
  };

  return (
    <div>
      {address ? (
        <>
          <div className="summary-container bg-[#1c1c24] p-6 rounded-lg mb-6">
            <h2 className="text-white text-lg font-semibold mb-4">
              Profile Transactions Summary
            </h2>
            <div className="flex justify-between">
              <p className="text-[#808191]">Total Raised (Your Campaigns):</p>
              <p className="text-white">{formatValue(totalRaised)} ETH</p>
            </div>
            <div className="flex justify-between mt-2">
              <p className="text-[#808191]">Total Donated (All Campaigns):</p>
              <p className="text-white">{formatValue(totalDonated)} ETH</p>
            </div>
          </div>

          <DisplayCampaigns
            title="My Campaigns"
            isLoading={isLoading}
            campaigns={campaigns}
          />
        </>
      ) : (
        <RestrictedAccessBox handleConnect={connect} />
      )}
    </div>
  );
};

export default Profile;
