// LoadingSpinner.js
import React from 'react';
import { Circles } from 'react-loader-spinner';

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner">
      <Circles
        height="80"
        width="80"
        color="#00BFFF"
        ariaLabel="circles-loading"
        visible={true}
      />
    </div>
  );
};

export default LoadingSpinner;
