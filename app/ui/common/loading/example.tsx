import React from 'react';
import Loading from './index';

/**
 * Example usage of the Loading component
 * This file demonstrates different ways to use the common loading component
 */

const LoadingExamples: React.FC = () => {
  return (
    <div className="space-y-8 p-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Loading Component Examples</h2>
        
        {/* Small Loading */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Small Size</h3>
          <div className="border p-4 rounded-lg">
            <Loading size="small" message="Loading..." />
          </div>
        </div>

        {/* Medium Loading (Default) */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Medium Size (Default)</h3>
          <div className="border p-4 rounded-lg">
            <Loading message="Đang tải dữ liệu..." />
          </div>
        </div>

        {/* Large Loading */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Large Size</h3>
          <div className="border p-4 rounded-lg">
            <Loading size="large" message="Đang tải danh sách bất động sản..." />
          </div>
        </div>

        {/* Without Message */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Without Message</h3>
          <div className="border p-4 rounded-lg">
            <Loading size="medium" />
          </div>
        </div>

        {/* Custom Styling */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">With Custom Class</h3>
          <div className="border p-4 rounded-lg">
            <Loading 
              size="medium" 
              message="Custom styled loading..." 
              className="bg-blue-50 rounded-lg p-4"
            />
          </div>
        </div>
      </div>

      {/* Full Screen Example Button */}
      <div>
        <h3 className="text-lg font-medium mb-2">Full Screen Loading (Click to test)</h3>
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          onClick={() => {
            // Example of how to show full screen loading
            const loadingDiv = document.createElement('div');
            loadingDiv.innerHTML = `
              <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; display: flex; align-items: center; justify-content: center; background-color: rgba(255, 255, 255, 0.9); z-index: 9999; backdrop-filter: blur(2px);">
                <div style="display: flex; flex-direction: column; align-items: center; gap: 12px;">
                  <div style="position: relative; width: 88px; height: 27px; display: flex; align-items: center; justify-content: center;">
                    <img src="/icons/nhadepqua_logo.svg" alt="Loading" style="position: relative; z-index: 10; width: 80px; height: 19px; filter: drop-shadow(0 2px 4px rgba(0, 62, 156, 0.1)); animation: pulse 2s ease-in-out infinite;" />
                    <div style="position: absolute; top: 0; left: 0; width: 88px; height: 27px; border: 2px solid transparent; border-radius: 50%; border-top-color: #0065ff; border-right-color: #0065ff; animation: spin 1.5s linear infinite;"></div>
                  </div>
                  <p style="text-align: center; font-weight: 500; color: #38393c; font-size: 14px;">Đang tải dữ liệu...</p>
                </div>
              </div>
            `;
            document.body.appendChild(loadingDiv);
            
            // Remove after 3 seconds for demo
            setTimeout(() => {
              document.body.removeChild(loadingDiv);
            }, 3000);
          }}
        >
          Show Full Screen Loading (3s)
        </button>
      </div>
    </div>
  );
};

export default LoadingExamples;