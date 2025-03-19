import React from 'react'

const Footer = () => {
  return (
    <nav className="w-full bg-black/60 border shadow-lg sticky top-0 z-50 flex flex-col md:flex-row justify-between items-center py-3">
      <div className="w-full md:w-1/2 font-serif py-3 px-4 md:px-20 lg:px-48 text-center md:text-left">
        <h3 className="text-white font-bold">Built by Elo.</h3>
      </div>
      <div className="w-full md:w-1/2 py-3 px-4 md:px-20 lg:px-48 flex justify-center md:justify-end gap-6 md:gap-11">
        <a href="https://github.com/elocodex">
          <i className="fa-brands fa-github text-gradient cursor-pointer"></i>
        </a>
        <a href="https://wa.link/6e6qrl">
          <i className="fa-brands fa-whatsapp text-gradient cursor-pointer"></i>
        </a>
        <a href="https://www.linkedin.com/in/elocodex-ilivieda/">
          <i className="fa-brands fa-linkedin text-gradient cursor-pointer"></i>
        </a>
      </div>
    </nav>
  )
}

export default Footer
