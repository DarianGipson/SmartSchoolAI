import React, { useRef, useState } from 'react';

export default function DrawingCanvas() {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);

  function startDraw(e) {
    setDrawing(true);
    draw(e);
  }
  function endDraw() {
    setDrawing(false);
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
  }
  function draw(e) {
    if (!drawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#2563eb';
    ctx.lineTo(e.nativeEvent.clientX - rect.left, e.nativeEvent.clientY - rect.top);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.clientX - rect.left, e.nativeEvent.clientY - rect.top);
  }

  function handleClear() {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, 400, 300);
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 max-w-lg mx-auto">
      <div className="mb-2 font-bold text-blue-700">Drawing Canvas</div>
      <canvas
        ref={canvasRef}
        width={400}
        height={300}
        className="border border-gray-300 rounded cursor-crosshair bg-gray-50"
        onMouseDown={startDraw}
        onMouseUp={endDraw}
        onMouseMove={draw}
        onMouseLeave={endDraw}
      />
      <button onClick={handleClear} className="mt-2 w-full bg-yellow-500 text-white py-1 rounded">Clear Canvas</button>
    </div>
  );
}
