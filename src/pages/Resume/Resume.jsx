import React, { useState } from 'react';
import ReactPDF from 'react-pdf-js';
import { Link } from 'react-router-dom'; // To handle page redirection
import { FaHome } from 'react-icons/fa'; // Home icon from react-icons
import Utkarsh_Raj_Resume from '../../assets/Resume.pdf'; // Local PDF file

export const Resume = () => {
  const [page, setPage] = useState(1);

  return (
    <div className='flex flex-col justify-center items-center pt-24'>
      {/* Download Button */}
      <div style={{ marginTop: '20px' }}>
        <a
          href={Utkarsh_Raj_Resume}
          download="Utkarsh_Raj_Resume.pdf"
          className='flex text-center bg-[#A11143] text-white text-xl shadow-md rounded-md px-4 py-2 m-2'
        >
          Download Resume
        </a>
      </div>

      <ReactPDF
        file={Utkarsh_Raj_Resume}
        page={page}
      />

      <div className='absolute top-28 right-10 animate-spin-slow bg-white p-4 rounded-full border-4 border-dotted border-[#A11143] hover:bg-[#A11143] hover:text-white transition-colors'>
        <Link to="/" className='text-xl'>
          <FaHome />
        </Link>
      </div>
    </div>
  );
};
