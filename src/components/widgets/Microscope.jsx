import React, { useState } from 'react';

export default function Microscope() {
  const [zoom, setZoom] = useState(1);
  return (
    <div className="bg-white rounded-lg shadow p-4 max-w-xs mx-auto">
      <div className="mb-2 font-bold text-blue-700">Microscope Simulation</div>
      <div className="flex flex-col items-center">
        <div className="w-40 h-40 bg-gray-200 rounded-full flex items-center justify-center mb-2 border-4 border-blue-300 overflow-hidden">
          <img
            src={`https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=${200*zoom}&h=${200*zoom}`}
            alt="Microscope sample"
            style={{ width: 200, height: 200, objectFit: 'cover', transform: `scale(${zoom})` }}
          />
        </div>
        <input
          type="range"
          min="1"
          max="5"
          value={zoom}
          onChange={e => setZoom(Number(e.target.value))}
          className="w-full mb-2"
        />
        <div className="text-gray-700">Zoom: {zoom}x</div>
      </div>
    </div>
  );
}
