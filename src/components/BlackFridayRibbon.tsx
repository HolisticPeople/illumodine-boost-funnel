interface BlackFridayRibbonProps {
  enabled?: boolean;
  text?: string;
  position?: 'top-left' | 'top-right';
}

const BlackFridayRibbon = ({ 
  enabled = true, 
  text = "BLACK FRIDAY SPECIAL",
  position = 'top-right'
}: BlackFridayRibbonProps) => {
  if (!enabled) return null;
  
  return (
    <div className={`absolute ${position === 'top-left' ? 'left-0' : 'right-0'} top-0 w-32 h-32 overflow-hidden pointer-events-none z-10`}>
      <div 
        className={`absolute bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white shadow-lg text-center ${
          position === 'top-left' 
            ? 'left-0 top-0 -rotate-45 origin-top-left -translate-x-8 translate-y-6' 
            : 'right-0 top-0 rotate-45 origin-top-right translate-x-8 translate-y-6'
        } w-40 py-1.5`}
      >
        <span className="text-[10px] font-bold tracking-wider whitespace-nowrap block">
          {text}
        </span>
      </div>
    </div>
  );
};

export default BlackFridayRibbon;
