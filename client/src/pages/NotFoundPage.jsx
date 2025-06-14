import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './NotFoundPage.css'; // Import the CSS file
import Button from '../components/common/Button';

const NotFoundPage = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleGoHome = () => {
    navigate('/dashboard'); // Navigate to the dashboard route
  };

  return (
    <section className="page_404">
      <div className="container">
        <div className="row">
          <div className="col-sm-12 ">
            <div className="col-sm-10 col-sm-offset-1 text-center">
              <div className="four_zero_four_bg">
                <h1 className="text-center ">404</h1>
              </div>

              <div className="contant_box_404">
                <h3 className="h2">Look like you're lost</h3>
                <p>The page you are looking for is not available!</p> {/* Corrected typo: "avaible" to "available" */}

                {/* Replaced <a> tag with Button component */}
                <Button onClick={handleGoHome} className="link_404">
                  Go to Dashboard
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFoundPage;
