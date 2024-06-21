import React from 'react';
import "../css/NotFound.css";
import { Link } from 'react-router-dom';

const NotFound = ({ darkMode }) => {
  return (
    <section className="page_404" style={{ background: darkMode ? 'rgb(28, 30, 39)' : 'white' }}>
      <div className="container_404">
        <h1 className="text-center h1" style={{ color: darkMode ? 'white' : 'black' }}>Page Not Found</h1>
        <div className="four_zero_four_bg"></div>
        <div className="contant_box_404">
          <h3 className="h2 " style={{ color: darkMode ? 'white' : 'black'}}>Looks like you're lost</h3>
          <Link to="/" className="link_404">Go to Home</Link>
        </div>
      </div>
    </section>
  );
}

export default NotFound;
