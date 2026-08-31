import React from 'react';

export const Skeleton = ({
  className = '',
  variant = 'text',
  count = 1,
  width,
  height,
}) => {
  const variantStyles = {
    text: 'h-4 w-full rounded-md',
    circle: 'rounded-full',
    card: 'h-48 w-full rounded-2xl',
    button: 'h-10 w-28 rounded-xl',
  };

  const style = {
    width: width,
    height: height,
  };

  const items = Array.from({ length: count });

  if (count === 1) {
    return (
      <div
        className={`animate-pulse bg-slate-200/80 ${variantStyles[variant] || ''} ${className}`}
        style={style}
      />
    );
  }

  return (
    <div className="space-y-2.5">
      {items.map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-slate-200/80 ${variantStyles[variant] || ''} ${className}`}
          style={style}
        />
      ))}
    </div>
  );
};

export default Skeleton;
