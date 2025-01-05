import React from 'react';
import { CustomButton } from '../components';

const RestrictedAccessBox = ({ handleConnect }) => {
  return (
    <div className="bg-[#1c1c24] p-6 rounded-lg text-center mt-6 flex flex-col items-center justify-center">
      <h2 className="text-white text-lg font-semibold mb-4">Access Restricted</h2>
      <p className="text-[#808191] mb-6">
        You need to connect your MetaMask wallet to access this page.
      </p>
      <CustomButton 
        btnType="button"
        title="Connect Wallet"
        styles="bg-[#8c6dfd] w-48"
        handleClick={handleConnect}
      />
    </div>
  );
};

export default RestrictedAccessBox;
