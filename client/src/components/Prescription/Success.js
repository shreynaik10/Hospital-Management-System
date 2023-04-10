import React, { useState, useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import Box from '@mui/material/Box';

const Success = () => {
  const [session, setSession] = useState({});
  const location = useLocation();
  const queryLocation = location.search;
  useEffect(() => {
    async function fetchSession() {
      const products = await fetch(
        process.env.REACT_APP_SERVER_URL + '/api/paypal/success' + queryLocation
      ).then((res) => res.json());
      setSession(products);
    }
    fetchSession();
  }, [queryLocation]);

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <div className="page-wrapper">
        <div className="content">
          {session.status === 'success' ? (
            <div className="row filter-row">
              <h1>Your payment succeeded</h1>
              <h4>View CheckoutSession response:</h4>
            </div>
          ) : session.message === 'Session already create ' ? (
            <div className="row filter-row hide">
              <h1>Your payment Already Validate </h1>
              <h4>View CheckoutSession response:</h4>
            </div>
          ) : (
            <div className="row filter-row hide">
              <h1>Your payment Failed</h1>
              <h4>View CheckoutSession response:</h4>
            </div>
          )}

          <div className="row filter-row">
            <div className="col-sm-4 col-md-4 mt-2">
              {Object.keys(session).length === 0 ? (
                <div></div>
              ) : (
                <Navigate to="/prescriptions" />
              )}
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default Success;
