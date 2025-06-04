import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

export default function CustomLessonEditor({ onSave }) {
  const [lesson, setLesson] = useState('');
  return (
    <div className="mt-8">
      <h4 className="text-lg font-bold mb-2">Custom Lesson Editor</h4>
      <textarea value={lesson} onChange={e => setLesson(e.target.value)} rows={6} className="w-full rounded-lg border border-gray-300 p-2 mb-4" />
      <Button onClick={() => onSave(lesson)} className="rounded-xl shadow-lg font-semibold text-base px-5 py-2 bg-gradient-to-r from-smartSchool-blue to-blue-400 hover:from-blue-700 hover:to-smartSchool-blue transition-transform duration-150 active:scale-95 flex items-center gap-2 mt-2">
        <Save size={18} className="mr-1" /> Save Lesson
      </Button>
    </div>
  );
}
