
import React from 'react';
import { Star } from 'lucide-react';

interface RatingProps {
  value: number;
  text?: string;
  color?: string;
}

const Rating = ({ value, text, color = 'text-yellow-400' }: RatingProps) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((index) => (
        <span key={index}>
          {value >= index ? (
            <Star className={`${color} w-4 h-4`} fill="currentColor" />
          ) : value >= index - 0.5 ? (
            <Star className={`${color} w-4 h-4`} fill="currentColor" strokeWidth={0} strokeDasharray="64" strokeDashoffset="32" />
          ) : (
            <Star className="text-gray-300 w-4 h-4" />
          )}
        </span>
      ))}
      {text && <span className="ml-2 text-sm text-gray-500">{text}</span>}
    </div>
  );
};

export default Rating;
