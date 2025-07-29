import React from 'react';

const Debug: React.FC = () => {
  return (
    <div className="p-8 bg-green-100 border border-green-400 rounded">
      <h1 className="text-2xl font-bold text-green-800 mb-4">Debug Component</h1>
      <p className="text-green-700">If you can see this, React is working!</p>
      <p className="text-green-700 mt-2">Current time: {new Date().toLocaleString()}</p>
    </div>
  );
};

export default Debug; 