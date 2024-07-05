import React from 'react';
import { GrAnnounce } from "react-icons/gr";
import { Link } from 'react-router-dom';
import '../css/Announcement.css'; // Ensure you create this CSS file

const Announcement = () => {
  return (
    <div className="announcement-banner">
      <div className="announcement-content">
        <GrAnnounce className="mic-icon" />
        <div>⚠︎ Please verify your account.</div>
        <Link className="verify-button" to="/profile">Verify</Link>
      </div>
    </div>
  );
};

export default Announcement;
