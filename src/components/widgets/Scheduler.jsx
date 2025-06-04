import React, { useState } from 'react';

export default function Scheduler() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');

  function addTask() {
    if (input.trim()) {
      setTasks([...tasks, { text: input, done: false }]);
      setInput('');
    }
  }
  function toggleTask(idx) {
    setTasks(tasks.map((t, i) => i === idx ? { ...t, done: !t.done } : t));
  }
  return (
    <div className="bg-white rounded-lg shadow p-4 max-w-xs mx-auto">
      <div className="mb-2 font-bold text-blue-700">Lesson Scheduler & Daily Planner</div>
      <div className="flex mb-2">
        <input
          className="border p-2 rounded flex-1 mr-2"
          placeholder="Add a lesson or task..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTask()}
          autoComplete="off"
        />
        <button onClick={addTask} className="bg-blue-500 text-white px-3 py-1 rounded">Add</button>
      </div>
      <ul className="list-disc pl-5">
        {tasks.map((t, i) => (
          <li key={i} className={t.done ? 'line-through text-gray-400' : ''}>
            <span onClick={() => toggleTask(i)} className="cursor-pointer select-none">{t.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
