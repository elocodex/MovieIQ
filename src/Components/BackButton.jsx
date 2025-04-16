import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className='py-5 fixed top-28'>
        <button 
      onClick={goBack}
      className="flex items-center cursor-pointer ml-10 text-white px-4 py-2 transition-all duration-300 font-medium mb-4"
    >
      <i className="fa-solid fa-chevron-left mr-1"></i> Return    
    </button>
    </div>
  );
};

export default BackButton;