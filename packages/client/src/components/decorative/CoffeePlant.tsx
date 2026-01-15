import React from 'react';

interface CoffeeLeafProps {
  className?: string;
  size?: number;
  color?: string;
  flip?: boolean;
}

export function CoffeeLeaf({
  className = '',
  size = 60,
  color = 'currentColor',
  flip = false
}: CoffeeLeafProps) {
  return (
    <svg
      width={size}
      height={size * 0.6}
      viewBox="0 0 60 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ transform: flip ? 'scaleX(-1)' : undefined }}
    >
      <path
        d="M2 18C2 18 10 4 30 4C50 4 58 18 58 18C58 18 50 32 30 32C10 32 2 18 2 18Z"
        fill={color}
      />
      <path
        d="M2 18H58"
        stroke="white"
        strokeWidth="1.5"
        opacity="0.4"
      />
      {/* Leaf veins */}
      <path
        d="M15 18C15 12 22 8 30 8"
        stroke="white"
        strokeWidth="1"
        opacity="0.3"
        fill="none"
      />
      <path
        d="M15 18C15 24 22 28 30 28"
        stroke="white"
        strokeWidth="1"
        opacity="0.3"
        fill="none"
      />
      <path
        d="M45 18C45 12 38 8 30 8"
        stroke="white"
        strokeWidth="1"
        opacity="0.3"
        fill="none"
      />
      <path
        d="M45 18C45 24 38 28 30 28"
        stroke="white"
        strokeWidth="1"
        opacity="0.3"
        fill="none"
      />
    </svg>
  );
}

interface CoffeeBranchProps {
  className?: string;
  size?: number;
}

export function CoffeeBranch({ className = '', size = 200 }: CoffeeBranchProps) {
  const scale = size / 200;

  return (
    <svg
      width={size}
      height={size * 1.2}
      viewBox="0 0 200 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Main stem */}
      <path
        d="M100 0C100 0 95 60 90 100C85 140 80 200 85 240"
        stroke="hsl(var(--sage-dark))"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />

      {/* Left leaves */}
      <g transform="translate(30, 50) rotate(-20)">
        <ellipse cx="25" cy="12" rx="25" ry="12" fill="hsl(var(--sage))" />
        <path d="M0 12H50" stroke="hsl(var(--sage-dark))" strokeWidth="1" opacity="0.5" />
      </g>

      <g transform="translate(20, 100) rotate(-30)">
        <ellipse cx="30" cy="14" rx="30" ry="14" fill="hsl(var(--sage-light))" />
        <path d="M0 14H60" stroke="hsl(var(--sage))" strokeWidth="1" opacity="0.5" />
      </g>

      <g transform="translate(25, 160) rotate(-15)">
        <ellipse cx="22" cy="10" rx="22" ry="10" fill="hsl(var(--olive))" />
        <path d="M0 10H44" stroke="hsl(var(--olive))" strokeWidth="1" opacity="0.5" />
      </g>

      {/* Right leaves */}
      <g transform="translate(110, 70) rotate(25)">
        <ellipse cx="28" cy="13" rx="28" ry="13" fill="hsl(var(--sage))" />
        <path d="M0 13H56" stroke="hsl(var(--sage-dark))" strokeWidth="1" opacity="0.5" />
      </g>

      <g transform="translate(115, 130) rotate(20)">
        <ellipse cx="24" cy="11" rx="24" ry="11" fill="hsl(var(--sage-light))" />
        <path d="M0 11H48" stroke="hsl(var(--sage))" strokeWidth="1" opacity="0.5" />
      </g>

      <g transform="translate(105, 190) rotate(35)">
        <ellipse cx="20" cy="9" rx="20" ry="9" fill="hsl(var(--olive-light))" />
        <path d="M0 9H40" stroke="hsl(var(--olive))" strokeWidth="1" opacity="0.5" />
      </g>

      {/* Coffee cherries */}
      <circle cx="70" cy="85" r="6" fill="hsl(var(--terracotta))" />
      <circle cx="62" cy="92" r="5" fill="hsl(var(--terracotta))" opacity="0.8" />
      <circle cx="130" cy="115" r="6" fill="hsl(var(--terracotta))" />
      <circle cx="138" cy="108" r="4" fill="hsl(var(--terracotta))" opacity="0.7" />
    </svg>
  );
}

// Decorative corner branches
interface CornerBranchesProps {
  className?: string;
}

export function CornerBranches({ className = '' }: CornerBranchesProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Top left branch */}
      <div className="absolute -top-10 -left-10 animate-sway origin-bottom-right opacity-60">
        <CoffeeBranch size={180} />
      </div>

      {/* Bottom right branch - flipped */}
      <div className="absolute -bottom-20 -right-10 animate-sway origin-top-left opacity-50" style={{ transform: 'scaleX(-1) rotate(180deg)', animationDelay: '1s' }}>
        <CoffeeBranch size={160} />
      </div>
    </div>
  );
}
