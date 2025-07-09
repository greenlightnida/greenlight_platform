import React from 'react';

const Elevate: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Elevate Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Coaching Excellence & Performance Enhancement
          </p>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <p className="text-gray-700">
              Elevate platform provides advanced coaching tools, performance analytics, 
              and team management features for sports organizations and coaches.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Elevate; 