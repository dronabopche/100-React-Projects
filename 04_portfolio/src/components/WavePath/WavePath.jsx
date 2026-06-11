import React, { useRef, useEffect, useState } from 'react';

export function WavePath({ className, style, ...props }) {
  const path = useRef(null);
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [width, setWidth] = useState(100);
  
  let progress = 0;
  let x = 0.5;
  let time = Math.PI / 2;
  let reqId = null;

  useEffect(() => {
    if (!containerRef.current) return;
    const handleResize = () => {
      setWidth(containerRef.current.getBoundingClientRect().width);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setPath(progress);
  }, [width]);

  const setPath = (currentProgress) => {
    if (path.current) {
      path.current.setAttributeNS(
        null,
        'd',
        `M0 100 Q${width * x} ${100 + currentProgress * 0.6}, ${width} 100`
      );
    }
  };

  const lerp = (start, end, amt) => start * (1 - amt) + end * amt;

  const manageMouseEnter = () => {
    setIsHovered(true);
    if (reqId) {
      cancelAnimationFrame(reqId);
      resetAnimation();
    }
  };

  const manageMouseMove = (e) => {
    const { movementY, clientX } = e;
    if (path.current && containerRef.current) {
      const pathBound = containerRef.current.getBoundingClientRect();
      x = (clientX - pathBound.left) / pathBound.width;
      progress += movementY;
      setPath(progress);
    }
  };

  const manageMouseLeave = () => {
    setIsHovered(false);
    animateOut();
  };

  const animateOut = () => {
    const newProgress = progress * Math.sin(time);
    progress = lerp(progress, 0, 0.025);
    time += 0.2;
    setPath(newProgress);
    if (Math.abs(progress) > 0.75) {
      reqId = requestAnimationFrame(animateOut);
    } else {
      resetAnimation();
    }
  };

  const resetAnimation = () => {
    time = Math.PI / 2;
    progress = 0;
  };

  return (
    <div 
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        height: '1px',
        width: '100%',
        ...style
      }} 
      {...props}
    >
      <div
        onMouseEnter={manageMouseEnter}
        onMouseMove={manageMouseMove}
        onMouseLeave={manageMouseLeave}
        style={{
          position: 'absolute',
          top: isHovered ? '-150px' : '-20px',
          zIndex: 10,
          height: isHovered ? '300px' : '40px',
          width: '100%',
          cursor: 'pointer',
        }}
      />
      <svg 
        style={{
          position: 'absolute',
          top: '-100px',
          height: '300px',
          width: '100%',
          pointerEvents: 'none',
          overflow: 'visible'
        }}
      >
        <path 
          ref={path} 
          style={{
            fill: 'none',
            stroke: 'var(--border2)',
            strokeWidth: 1.5,
            transition: 'stroke 0.3s'
          }}
        />
      </svg>
    </div>
  );
}
export default WavePath;
