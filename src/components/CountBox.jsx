import React, { useState } from 'react';

const CountBox = ({ title, value }) => {
  const [isHovered, setIsHovered] = useState(false);  // To manage tooltip visibility

  return (
    <div className="relative flex flex-col items-center w-[150px]">
      <h4 
        className="font-epilogue font-bold text-[30px] text-white p-3 bg-[#1c1c24] rounded-t-[10px] w-full text-center truncate"
        onMouseEnter={() => setIsHovered(true)}  // Show tooltip on hover
        onMouseLeave={() => setIsHovered(false)}  // Hide tooltip when hover ends
      >
        {value}
      </h4>

      {/* Custom Tooltip */}
      {isHovered && (
        <div className="absolute right-[110%] top-1/2 transform -translate-y-1/2 bg-[#333] text-white text-[14px] p-2 rounded-[6px] shadow-md z-10">
          {value}  {/* Full value in the tooltip */}
        </div>
      )}

      <p className="font-epilogue font-normal text-[16px] text-[#808191] bg-[#28282e] px-3 py-2 w-full rounded-b-[10px] text-center">{title}</p>
    </div>
  );
}

export default CountBox;
