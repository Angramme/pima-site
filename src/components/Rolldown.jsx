'use client';

import { useState, useRef, useEffect } from 'react';

export default function Rolldown({ children, defaultOpen = false, closedHeight = '15vh' }) {
  const [open, setOpen] = useState(defaultOpen);
  const [plusNeeded, setPlusNeeded] = useState(false);
  const mainRef = useRef(null);

  useEffect(() => {
    if (mainRef.current) {
      setPlusNeeded(open || mainRef.current.scrollHeight !== mainRef.current.clientHeight);
    }
  }, [open, children]);

  const roll = () => {
    setOpen(!open);
    setTimeout(() => {
      mainRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'start',
      });
    }, 200);
  };

  return (
    <div>
      <div
        ref={mainRef}
        className="main"
        style={open ? {} : { maxHeight: closedHeight, overflow: 'hidden' }}
      >
        {children}
      </div>
      {plusNeeded && (
        <div className="plus">
          <button onClick={roll}>{open ? '- cacher -' : '+ afficher plus +'}</button>
        </div>
      )}
    </div>
  );
}
