import React, { useState } from 'react';

export default function Calculator() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  function handleClick(val) {
    setInput(input + val);
  }
  function handleClear() {
    setInput('');
    setResult('');
  }
  function handleEquals() {
    try {
      setResult(eval(input));
    } catch {
      setResult('Error');
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 max-w-xs mx-auto">
      <div className="mb-2 text-lg font-mono bg-gray-100 p-2 rounded">{input || '0'}</div>
      <div className="mb-2 text-xl font-bold text-blue-700">{result}</div>
      <div className="grid grid-cols-4 gap-2">
        {[7,8,9,'/'].map(v => <button key={v} onClick={()=>handleClick(v.toString())} className="btn">{v}</button>)}
        {[4,5,6,'*'].map(v => <button key={v} onClick={()=>handleClick(v.toString())} className="btn">{v}</button>)}
        {[1,2,3,'-'].map(v => <button key={v} onClick={()=>handleClick(v.toString())} className="btn">{v}</button>)}
        {[0,'.','=','+'].map(v => v==='='
          ? <button key={v} onClick={handleEquals} className="btn bg-blue-500 text-white">=</button>
          : <button key={v} onClick={()=>handleClick(v.toString())} className="btn">{v}</button>
        )}
      </div>
      <button onClick={handleClear} className="mt-2 w-full bg-red-500 text-white py-1 rounded">Clear</button>
    </div>
  );
}
