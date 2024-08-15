import React, { useEffect } from 'react';

interface LocationAutocompleteProps {
  location: string;
  setLocation: (location: string) => void;
}

const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({ location, setLocation }) => {
  useEffect(() => {
    const initAutocomplete = () => {
      const input = document.getElementById('location-input') as HTMLInputElement;
      const autocomplete = new window.google.maps.places.Autocomplete(input);
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.formatted_address) {
          setLocation(place.formatted_address);
        }
      });
    };

    if (window.google) {
      initAutocomplete();
    } else {
      const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBYxZsiYvqO7MsWvtSmlMZD6M0aeyQrKkg&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = initAutocomplete;
        document.head.appendChild(script);
      } else {
        existingScript.addEventListener('load', initAutocomplete);
      }
    }
  }, [setLocation]);

  return (
    <div>
      <label>Location:</label>
      <input
        id="location-input"
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
    </div>
  );
};

export default LocationAutocomplete;
