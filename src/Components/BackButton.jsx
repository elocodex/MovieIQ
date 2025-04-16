import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="py-4 px-5 fixed z-50 top-24 left-2 sm:top-28 sm:left-3 md:top-32 md:left-6  w-fit">
      <button 
        onClick={goBack}
        className="flex items-center gap-2 bg-dark-100/90 backdrop-blur-md shadow-lg shadow-light-100/10 rounded-2xl text-light-200 px-4 py-2 transition-all duration-300 text-sm font-medium cursor-pointer "
      >
        <i className="fa-solid fa-chevron-left text-[12px]"></i>
        Back
      </button>
  </div>
  );
};

export default BackButton;