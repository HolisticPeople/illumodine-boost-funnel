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
  
  const positionClasses = position === 'top-left' 
    ? 'left-0 top-0 -rotate-45 -translate-x-[30%] translate-y-[40%]'
    : 'right-0 top-0 rotate-45 translate-x-[30%] translate-y-[40%]';
  
  return (
    <div className={`absolute ${positionClasses} z-20 overflow-hidden`}>
      <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white px-12 py-2 shadow-lg">
        <span className="text-xs font-bold tracking-wider whitespace-nowrap">
          {text}
        </span>
      </div>
    </div>
  );
};

export default BlackFridayRibbon;
