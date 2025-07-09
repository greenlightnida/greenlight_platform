// import React from 'react';

export const TeamPortal = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Team Portal
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Team Collaboration & Management
          </p>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <p className="text-gray-700">
              Team Portal provides collaboration tools, team management features, 
              and communication platforms for effective teamwork.
            </p>
            <div className="mt-6">
              <button className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                Launch Team Portal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 