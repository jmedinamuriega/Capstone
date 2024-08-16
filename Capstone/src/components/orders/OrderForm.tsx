import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LocationAutocomplete from '../services/LocationsAutocomplete';
import './OrderForm.css';

const OrderForm: React.FC = () => {
  const [serviceType, setServiceType] = useState<string>('Washing');
  const [bigItem, setBigItem] = useState<boolean>(false);
  const [delivery, setDelivery] = useState<boolean>(false);
  const [pickup, setPickup] = useState<boolean>(false);
  const [location, setLocation] = useState<string>('');
  const [pickupDate, setPickupDate] = useState<string>('');
  const [deliveryDate, setDeliveryDate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [summary, setSummary] = useState<string>('');
  const [showSummary, setShowSummary] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  const basePrices: { [key: string]: number } = {
    Washing: 10,
    Drying: 8,
    'Dry Cleaning': 15,
    'Padded Items': 20,
  };

  const additionalCharges = {
    bigItem: 5,
    delivery: 3,
    pickup: 3,
  };

  useEffect(() => {
    let total = basePrices[serviceType];
    if (bigItem) total += additionalCharges.bigItem;
    if (delivery) total += additionalCharges.delivery;
    if (pickup) total += additionalCharges.pickup;

    setTotalPrice(total);

    let summaryText = `Service Type: ${serviceType}\nBase Price: $${basePrices[serviceType]}`;
    if (bigItem) summaryText += `\nBig Item: +$${additionalCharges.bigItem}`;
    if (delivery) summaryText += `\nDelivery: +$${additionalCharges.delivery}`;
    if (pickup) summaryText += `\nPickup: +$${additionalCharges.pickup}`;
    summaryText += `\nTotal Price: $${total}`;

    setSummary(summaryText);
  }, [serviceType, bigItem, delivery, pickup]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      alert('You need to login first');
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        'http://localhost:5000/services',
        {
          service_type: serviceType,
          big_item: bigItem,
          delivery,
          pickup,
          location,
          pickup_date: pickupDate,
          delivery_date: deliveryDate,
          total_price: totalPrice,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('Service added successfully!');
      setServiceType('Washing');
      setBigItem(false);
      setDelivery(false);
      setPickup(false);
      setLocation('');
      setPickupDate('');
      setDeliveryDate('');
      setShowSummary(false);
      setShowModal(true);
    } catch (error) {
      console.error('Failed to add service:', error);
      alert('Failed to add service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="order-form">
        <div className="form-group">
          <label>Service Type:</label>
          <select
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
          >
            <option value="Washing">Washing</option>
            <option value="Drying">Drying</option>
            <option value="Dry Cleaning">Dry Cleaning</option>
            <option value="Padded Items">Padded Items</option>
          </select>
        </div>
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={bigItem}
              onChange={(e) => setBigItem(e.target.checked)}
            />
            Big Item (+${additionalCharges.bigItem})
          </label>
        </div>
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={delivery}
              onChange={(e) => setDelivery(e.target.checked)}
            />
            Delivery (+${additionalCharges.delivery})
          </label>
        </div>
        {delivery && (
          <div className="form-group">
            <label>Delivery Date:</label>
            <input
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
            />
          </div>
        )}
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={pickup}
              onChange={(e) => setPickup(e.target.checked)}
            />
            Pickup (+${additionalCharges.pickup})
          </label>
        </div>
        {pickup && (
          <div className="form-group">
            <label>Pickup Date:</label>
            <input
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
            />
          </div>
        )}
        <LocationAutocomplete location={location} setLocation={setLocation} />

        <button
          type="button"
          onClick={() => setShowSummary(true)}
          className="display-order-btn"
        >
          Display Order
        </button>

        {showSummary && (
          <div className="form-group">
            <label>Order Summary:</label>
            <textarea
              value={summary}
              readOnly
              rows={5}
              className="summary-textarea"
            />
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>
      </form>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Order Summary</h2>
            <p>{summary}</p>
            <button onClick={() => setShowModal(false)} className="thanks-btn">
              Thanks for preferring our services!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderForm;
