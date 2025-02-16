import { useEffect, useRef, useState } from "react";

export interface PopoverProps {
	children: React.ReactNode
	content: React.ReactNode
	trigger?: 'click' | 'hover';
	className?: string;
}

const Popover: React.FC<PopoverProps> = ({
  children,
  content,
  trigger = "click",
	className,
}) => {
  const [show, setShow] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleMouseOver = () => {
    if (trigger === "hover") {
      setShow(true);
    }
  };

  const handleMouseLeft = () => {
    if (trigger === "hover") {
      setShow(false);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShow(false);
      }
    }

    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
			
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [show, wrapperRef]);

  return (
    <div
      ref={wrapperRef}
      onMouseEnter={handleMouseOver}
      onMouseLeave={handleMouseLeft}
      className={`w-fit h-fit relative flex justify-center${className ? ' ' + className : '' }`}>
      <button onClick={() => setShow(!show)}>
        {children}
      </button>
      <div
        hidden={!show}
        className="min-w-fit h-fit absolute -right-8 md:right-0 bottom-[100%] z-50 transition-all">
        <div className="rounded-md bg-white shadow-md mb-2 overflow-hidden">
          {content}
        </div>
      </div>
    </div>
  );
};

export default Popover;