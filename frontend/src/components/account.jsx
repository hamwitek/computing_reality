import React, { useState, useEffect } from 'react';

const Account = () => {
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    email: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Retrieve user data from local storage
    const storedUserData = localStorage.getItem('userData');
    
    if (storedUserData) {
      try {
        const parsedUserData = JSON.parse(storedUserData);
        setUserData(parsedUserData);
      } catch (error) {
        console.error('Error parsing user data from local storage:', error);
      }
    }
    
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="account-container">
      <h1>My Account</h1>
      
      <div className="account-info flex flex-col">
        <div className="info-item flex items-center">
          <label className="mr-2">First Name:</label>
          <p>{userData.first_name || 'Not provided'}</p>
        </div>
        
        <div className="info-item flex items-center">
          <label className="mr-2">Last Name:</label>
          <p>{userData.last_name || 'Not provided'}</p>
        </div>
        
        <div className="info-item flex items-center">
          <label className="mr-2">Email:</label>
          <p>{userData.email || 'Not provided'}</p>
        </div>
      </div>
    </div>
  );
};

export default Account;