import React from 'react';

const BlurCircle = ({ top = 'auto', left = 'auto', right = 'auto', bottom = 'auto' }) => {
  return (
    <div
      className="absolute -z-10 h-96 w-96 rounded-full bg-[#5c4033]/30 blur-3xl"
      style={{ top, left, right, bottom }}
    />
  );
};

export default BlurCircle;