import React, { useState } from 'react';

const DICTIONARY = {
  apple: 'A round fruit with red or green skin.',
  democracy: 'A system of government by the whole population.',
  molecule: 'A group of atoms bonded together.'
};

export default function Dictionary() {
  const [word, setWord] = useState('');
  const [definition, setDefinition] = useState('');

  function handleSearch() {
    setDefinition(DICTIONARY[word.toLowerCase()] || 'Word not found.');
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 max-w-xs mx-auto">
      <div className="mb-2 font-bold text-blue-700">Dictionary</div>
      <input
        className="border p-2 rounded w-full mb-2"
        placeholder="Type a word..."
        value={word}
        onChange={e => setWord(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSearch()}
      />
      <button onClick={handleSearch} className="w-full bg-blue-500 text-white py-1 rounded mb-2">Search</button>
      <div className="text-gray-700 min-h-[2rem]">{definition}</div>
    </div>
  );
}
