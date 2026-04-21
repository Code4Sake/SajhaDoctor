import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const TextReveal = ({
  children,
  className = '',
  as = 'div',
  delay = 0,
  duration = 0.7,
  once = true,
  direction = 'up', // 'up', 'left', 'right', 'fade'
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: '-60px 0px' });

  const directionMap = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { y: 0, x: 40 },
    right: { y: 0, x: -40 },
    fade: { y: 0, x: 0 },
  };

  const initial = directionMap[direction] || directionMap.up;

  const Tag = motion[as] || motion.div;

  return (
    <Tag
      ref={ref}
      className={className}
      initial={{ opacity: 0, ...initial }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, ...initial }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </Tag>
  );
};

export default TextReveal;
