import React from 'react'
import { FaFacebook, FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'

const Footer = () => {
  return (
<footer className="relative bg-purple-heart-950 text-white px-10 py-12 overflow-hidden">
 <div className="absolute top-0 right-5 w-1/3 h-full opacity-10 pointer-events-none">
  <svg viewBox="0 0 100 120" preserveAspectRatio="none" className="w-full h-full opacity-30">
    <path d="M0 120 L35 -30 L100 120" stroke="white" strokeWidth="1" fill="none" />
    <path d="M20 120 L40 20 L80 120" stroke="white" strokeWidth="1" fill="none" />
    <path d="M40 120 L43 60 L60 120" stroke="white" strokeWidth="1" fill="none" />
  </svg>
</div>

  <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
    <div>
      <h2 className="text-lg font-bold">JobHunt</h2>
      <p className="mt-2 text-sm text-gray-300">
        Find your dream job with us. A good life with a good company. Start exploring thousands of jobs in one place.
      </p>
      <div className="flex gap-3 mt-4">
        <a href="#"><FaTwitter /></a>
        <a href="#"><FaLinkedin /></a>
        <a href="#"><FaGithub /></a>
        <a href="#"><FaFacebook /></a>
      </div>
      <button className="mt-6 px-4 py-2 border text-sm rounded hover:bg-white hover:text-black">
        BACK TO TOP
      </button>
    </div>

    <div>
      <h3 className="font-semibold mb-2">Site Map</h3>
      <ul className="text-sm space-y-1">
        <li><a href="#" className="hover:underline">Home</a></li>
        <li><a href="#">About us</a></li>
        <li><a href="#">Jobs</a></li>
      </ul>
    </div>

    <div>
      <h3 className="font-semibold mb-2">Legal</h3>
      <ul className="text-sm space-y-1">
        <li><a href="#">Privacy Policy</a></li>
        <li><a href="#">Terms of Service</a></li>
        <li><a href="#">Leaguer's Corner</a></li>
      </ul>
    </div>
  </div>
</footer>
  )
}

export default Footer