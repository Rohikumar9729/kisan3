import React from 'react';

const BlurCircle = ({ top = 'auto', left = 'auto', right = 'auto', bottom = 'auto', color = 'emerald' }) => {
  const bgClass =
    color === 'gold'
      ? 'bg-gradient-to-tr from-[#CEC382]/20 to-amber-500/10'
      : 'bg-gradient-to-tr from-emerald-600/15 to-[#CEC382]/10';

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute -z-10 h-80 w-80 md:h-[450px] md:w-[450px] rounded-full blur-[110px] ${bgClass}`}
      style={{ top, left, right, bottom }}
    />
  );
};

export default BlurCircle;