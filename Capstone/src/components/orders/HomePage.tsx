import React, { useState } from 'react';
import OrderForm from './OrderForm';

const HomePage: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const handleLoginStatus = (status: boolean) => {
    setIsLoggedIn(status);
  };

  return (
    <div>
      <h1>Welcome to the Laundry Service</h1>
      {isLoggedIn ? <OrderForm /> : <p>Please <a href="/login">login</a> to place an order.</p>}
    </div>
  );
}

export default HomePage;
