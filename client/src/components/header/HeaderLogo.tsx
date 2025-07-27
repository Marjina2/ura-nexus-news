
import React from 'react';

const HeaderLogo = () => {
  return (
    <div className="flex items-center space-x-2">
      <a href="/" className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-pulsee-green rounded-lg flex items-center justify-center">
          <span className="text-pulsee-black font-bold text-lg">P</span>
        </div>
        <span className="text-2xl font-bold gradient-text">Pulsee</span>
      </a>
    </div>
  );
};

export default HeaderLogo;
