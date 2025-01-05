import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { Sidebar, Navbar } from './components';
import { CampaignDetails, CreateCampaign, Home, Profile, FundsReceived } from './pages';

const App = () => {
  return (
    <div className="relative p-4 bg-[#13131a] min-h-screen flex sm:flex-row flex-col">
      {/* Sidebar for larger screens */}
      <div className="hidden sm:block mr-10 relative">
        <Sidebar />
      </div>

      {/* Main content section */}
      <div className="flex-1 max-w-[1280px] mx-auto sm:pr-5 w-full">
        {/* Navbar */}
        <Navbar />

        {/* Routing for pages */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-campaign" element={<CreateCampaign />} />
          <Route path="/campaign-details/:id" element={<CampaignDetails />} />
          <Route path="/payment" element={<FundsReceived />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
