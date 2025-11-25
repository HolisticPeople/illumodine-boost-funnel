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
    ? 'left-0 top-0 origin-top-left'
    : 'right-0 top-0 origin-top-right';
  
  const rotateClasses = position === 'top-left'
    ? '-rotate-45'
    : 'rotate-45';
  
  return (
    <div className={`absolute ${positionClasses} w-40 h-40 overflow-hidden pointer-events-none`}>
      <div className={`absolute ${rotateClasses} bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white shadow-lg ${position === 'top-left' ? 'left-[-50px] top-[25px]' : 'right-[-50px] top-[25px]'} w-[200px] py-2 text-center`}>
        <span className="text-xs font-bold tracking-wider whitespace-nowrap">
          {text}
        </span>
      </div>
    </div>
  );
};

export default BlackFridayRibbon;
