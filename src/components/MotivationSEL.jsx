import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, HeartHandshake } from 'lucide-react';

export default function MotivationSEL({ mood, onBrainBreak, onMotivate }) {
  return (
    <div className="mt-8">
      <h4 className="text-lg font-bold mb-2">Motivation & SEL</h4>
      <div className="mb-4">Current mood: {mood}</div>
      <div className="flex gap-4">
        <Button onClick={onBrainBreak} className="rounded-xl shadow-lg font-semibold text-base px-5 py-2 bg-smartSchool-blue hover:bg-blue-700 transition-transform duration-150 active:scale-95 flex items-center gap-2">
          <HeartHandshake size={18} className="mr-1" /> Take a Brain Break
        </Button>
        <Button onClick={onMotivate} className="rounded-xl shadow-lg font-semibold text-base px-5 py-2 bg-smartSchool-yellow hover:bg-yellow-400 transition-transform duration-150 active:scale-95 flex items-center gap-2">
          <Sparkles size={18} className="mr-1" /> Get Motivation
        </Button>
      </div>
    </div>
  );
}
