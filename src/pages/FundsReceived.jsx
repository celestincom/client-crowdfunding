import React, { useEffect, useState } from 'react';
import { useStateContext } from '../context';
import { RestrictedAccessBox } from '../components';

const FundsReceived = () => {
    const { getCampaigns, address, getDonations, contract, connect } = useStateContext();
    const [funds, setFunds] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState(null);
    const fundsPerPage = 5;

    useEffect(() => {
        // Wait for contract and address to be available
        if (!contract || !address) {
            setIsLoading(true); // Ensure loading state while waiting
            return; // Don't fetch data until the contract and address are initialized
        }

        const fetchFunds = async () => {
            try {
                setIsLoading(true); // Start loading state
                const campaigns = await getCampaigns();
                const myCampaigns = campaigns.filter(campaign => campaign.owner === address);

                let allFunds = [];

                for (let campaign of myCampaigns) {
                    const campaignFunds = await getDonations(campaign.pId);
                    const formattedFunds = campaignFunds.map(fund => ({
                        ...fund,
                        title: campaign.title || "N/A",
                        createdAt: campaign.createdAt || "N/A"
                    }));
                    allFunds = [...allFunds, ...formattedFunds];
                }

                // TODO: update the contract to solve this as well - Sort funds by creation date (newest first)
                // allFunds.sort((a, b) => b.createdAt - a.createdAt);
                setFunds(allFunds); // Set fetched funds
            } catch (err) {
                setError("An error occurred while fetching your funds.");
                console.error("Error fetching funds:", err);
            } finally {
                setIsLoading(false); // Stop loading state when done
            }
        };

        fetchFunds();
    }, [address, contract, getCampaigns, getDonations]);

    // Pagination logic
    const indexOfLastFund = currentPage * fundsPerPage;
    const indexOfFirstFund = indexOfLastFund - fundsPerPage;
    const currentFunds = funds.slice(indexOfFirstFund, indexOfLastFund);

    const nextPage = () => {
        if (indexOfLastFund < funds.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="bg-[#1c1c24] p-10 rounded-lg">
            {/* If the user is not connected, show restricted access message */}
            {!address ? (
                <RestrictedAccessBox handleConnect={connect} />
            ) : isLoading ? (
                <div className="flex justify-center items-center">
                    {/* Spinner for loading */}
                    <div className="spinner-border animate-spin border-4 border-[#8c6dfd] border-t-transparent rounded-full w-10 h-10"></div>
                </div>
            ) : error ? (
                <div className="text-red-500 text-center font-epilogue">{error}</div>
            ) : (
                <>
                    <h1 className="text-3xl font-epilogue font-semibold text-white mb-6 text-center">
                        Funds Received
                    </h1>

                    {/* If no funds are available */}
                    {currentFunds.length === 0 ? (
                        <p className="text-white text-center font-epilogue">
                            No funds received yet.
                        </p>
                    ) : (
                        currentFunds.map((fund, index) => (
                            <div key={index} className="bg-[#3a3a43] p-5 rounded-lg mb-4">
                                <p className="text-white font-epilogue"><strong>Campaign:</strong> {fund.title}</p>
                                <p className="text-white font-epilogue"><strong>Amount:</strong> {fund.donation ? `${fund.donation} ETH` : "N/A"}</p>
                                {/* <p className="text-white font-epilogue"><strong>Date:</strong> {fund.createdAt !== "N/A" ? new Date(fund.createdAt * 1000).toLocaleDateString() : "N/A"}</p> */}
                            </div>
                        ))
                    )}

                    {/* Pagination buttons */}
                    <div className="flex justify-between mt-6">
                        <button
                            onClick={prevPage}
                            className="bg-[#8c6dfd] py-2 px-4 rounded text-white font-epilogue hover:bg-[#7a5dbf]"
                        >
                            Previous
                        </button>
                        <button
                            onClick={nextPage}
                            className="bg-[#8c6dfd] py-2 px-4 rounded text-white font-epilogue hover:bg-[#7a5dbf]"
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default FundsReceived;
