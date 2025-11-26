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
    <div className={`absolute ${position === 'top-left' ? 'left-0' : 'right-0'} top-0 w-40 h-40 overflow-visible pointer-events-none z-10`}>
      <div 
        className={`absolute bg-gradient-to-r from-rose-700 via-rose-600 to-rose-700 text-white shadow-2xl text-center py-2 px-8 ${
          position === 'top-left' 
            ? 'left-[-35px] top-[30px] -rotate-45' 
            : 'right-[-35px] top-[30px] rotate-45'
        } min-w-[180px]`}
      >
        <span className="text-xs font-bold tracking-widest whitespace-nowrap">
          {text}
        </span>
      </div>
    </div>
  );
};

export default BlackFridayRibbon;
