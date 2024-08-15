import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './OrderHistory.css';

interface Service {
  id: number;
  service_type: string;
  big_item: boolean;
  delivery: boolean;
  pickup: boolean;
  location: string;
  pickup_date: string;
  delivery_date: string;
  timestamp: string;
}

const OrderHistory: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchServices = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:5000/services', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setServices(response.data.services);
        } catch (error) {
          console.error('Error fetching services:', error);
        }
      } else {
        alert('You need to log in first');
      }
      setLoading(false);
    };

    fetchServices();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="order-history-container">
      <h2>Your Order History</h2>
      <ul>
        {services.map(service => (
          <li key={service.id} className="order-card">
            <p><span>Service Type:</span> {service.service_type}</p>
            <p><span>Big Item:</span> {service.big_item ? 'Yes' : 'No'}</p>
            <p><span>Delivery:</span> {service.delivery ? 'Yes' : 'No'}</p>
            <p><span>Pickup:</span> {service.pickup ? 'Yes' : 'No'}</p>
            <p><span>Location:</span> {service.location}</p>
            <p><span>Pickup Date:</span> {new Date(service.pickup_date).toLocaleDateString()}</p>
            <p><span>Delivery Date:</span> {new Date(service.delivery_date).toLocaleDateString()}</p>
            <p><span>Order Placed:</span> {new Date(service.timestamp).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderHistory;
