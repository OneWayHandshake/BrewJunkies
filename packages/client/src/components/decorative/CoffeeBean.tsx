import React from 'react';

interface CoffeeBeanProps {
  className?: string;
  size?: number;
  variant?: 'filled' | 'outline';
  color?: string;
}

export function CoffeeBean({
  className = '',
  size = 40,
  variant = 'filled',
  color = 'currentColor'
}: CoffeeBeanProps) {
  return (
    <svg
      width={size}
      height={size * 1.4}
      viewBox="0 0 40 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {variant === 'filled' ? (
        <>
          <path
            d="M20 2C10 2 2 14 2 28C2 42 10 54 20 54C30 54 38 42 38 28C38 14 30 2 20 2Z"
            fill={color}
          />
          <path
            d="M20 8C16 14 16 42 20 48"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.6"
          />
        </>
      ) : (
        <>
          <path
            d="M20 2C10 2 2 14 2 28C2 42 10 54 20 54C30 54 38 42 38 28C38 14 30 2 20 2Z"
            stroke={color}
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M20 8C16 14 16 42 20 48"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.6"
          />
        </>
      )}
    </svg>
  );
}

// Multiple floating beans for decoration
interface FloatingBeansProps {
  className?: string;
}

export function FloatingBeans({ className = '' }: FloatingBeansProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Bean 1 - Top left */}
      <div className="absolute top-[10%] left-[5%] animate-float opacity-20">
        <CoffeeBean size={30} color="hsl(var(--sage-dark))" />
      </div>

      {/* Bean 2 - Top right */}
      <div className="absolute top-[15%] right-[10%] animate-float-slow opacity-15" style={{ animationDelay: '1s' }}>
        <CoffeeBean size={45} color="hsl(var(--terracotta))" variant="outline" />
      </div>

      {/* Bean 3 - Middle left */}
      <div className="absolute top-[40%] left-[8%] animate-float-reverse opacity-20" style={{ animationDelay: '0.5s' }}>
        <CoffeeBean size={25} color="hsl(var(--coffee-deep))" />
      </div>

      {/* Bean 4 - Bottom right */}
      <div className="absolute bottom-[20%] right-[5%] animate-float opacity-15" style={{ animationDelay: '2s' }}>
        <CoffeeBean size={35} color="hsl(var(--sage))" />
      </div>

      {/* Bean 5 - Bottom left */}
      <div className="absolute bottom-[30%] left-[15%] animate-float-slow opacity-10" style={{ animationDelay: '1.5s' }}>
        <CoffeeBean size={50} color="hsl(var(--terracotta))" variant="outline" />
      </div>

      {/* Bean 6 - Top center */}
      <div className="absolute top-[5%] left-[45%] animate-float-reverse opacity-15" style={{ animationDelay: '0.8s' }}>
        <CoffeeBean size={20} color="hsl(var(--olive))" />
      </div>
    </div>
  );
}
