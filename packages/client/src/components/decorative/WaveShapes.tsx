import React from 'react';

interface WaveDividerProps {
  className?: string;
  color?: string;
  flip?: boolean;
}

export function WaveDivider({ className = '', color = 'hsl(var(--cream))', flip = false }: WaveDividerProps) {
  return (
    <div className={`w-full overflow-hidden ${className}`} style={{ transform: flip ? 'rotate(180deg)' : undefined }}>
      <svg
        viewBox="0 0 1440 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        preserveAspectRatio="none"
      >
        <path
          d="M0 60C240 120 480 0 720 60C960 120 1200 0 1440 60V120H0V60Z"
          fill={color}
        />
      </svg>
    </div>
  );
}

export function WaveDividerSoft({ className = '', color = 'hsl(var(--sage-light))', flip = false }: WaveDividerProps) {
  return (
    <div className={`w-full overflow-hidden ${className}`} style={{ transform: flip ? 'rotate(180deg)' : undefined }}>
      <svg
        viewBox="0 0 1440 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        preserveAspectRatio="none"
      >
        <path
          d="M0 40C180 80 360 20 540 50C720 80 900 10 1080 40C1260 70 1350 30 1440 50V100H0V40Z"
          fill={color}
        />
      </svg>
    </div>
  );
}

export function OrganicBlob({ className = '', color = 'hsl(var(--peach))' }: { className?: string; color?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fill={color}
        d="M47.7,-57.2C59.9,-47.3,66.6,-30.9,69.3,-13.8C72,3.3,70.8,21.2,62.4,34.6C54.1,48.1,38.6,57.2,22,63.4C5.3,69.6,-12.5,72.9,-28.4,68.2C-44.3,63.5,-58.2,50.7,-66.4,34.8C-74.6,18.9,-77.1,-0.1,-71.5,-16.3C-65.9,-32.5,-52.2,-45.9,-37.5,-55.2C-22.8,-64.5,-7.1,-69.7,7.5,-68.6C22.1,-67.5,35.5,-67.1,47.7,-57.2Z"
        transform="translate(100 100)"
      />
    </svg>
  );
}

export function OrganicBlob2({ className = '', color = 'hsl(var(--sage-light))' }: { className?: string; color?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fill={color}
        d="M39.5,-48.7C51.9,-39.4,63.2,-28.1,67.9,-13.9C72.6,0.3,70.7,17.4,62.8,31C54.9,44.6,41.1,54.7,26.1,60.3C11.1,65.9,-5.1,67,-20.1,62.5C-35.1,58,-48.9,47.9,-58.3,34.1C-67.7,20.3,-72.7,2.9,-69.5,-12.6C-66.3,-28.1,-54.9,-41.7,-41.6,-50.8C-28.2,-60,-12.9,-64.6,0.5,-65.2C13.9,-65.8,27.1,-58,39.5,-48.7Z"
        transform="translate(100 100)"
      />
    </svg>
  );
}

// Background with multiple organic shapes
interface OrganicBackgroundProps {
  className?: string;
}

export function OrganicBackground({ className = '' }: OrganicBackgroundProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Large blob - top right */}
      <div className="absolute -top-20 -right-20 w-96 h-96 opacity-30 animate-pulse-soft">
        <OrganicBlob className="w-full h-full" color="hsl(var(--sage-light))" />
      </div>

      {/* Medium blob - bottom left */}
      <div className="absolute -bottom-32 -left-32 w-80 h-80 opacity-25 animate-pulse-soft" style={{ animationDelay: '1s' }}>
        <OrganicBlob2 className="w-full h-full" color="hsl(var(--peach))" />
      </div>

      {/* Small blob - center left */}
      <div className="absolute top-1/3 -left-16 w-48 h-48 opacity-20 animate-pulse-soft" style={{ animationDelay: '2s' }}>
        <OrganicBlob className="w-full h-full" color="hsl(var(--terracotta-light))" />
      </div>
    </div>
  );
}

// Hills/Mountain silhouette for footer
export function HillsSilhouette({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <svg
        viewBox="0 0 1440 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        preserveAspectRatio="none"
      >
        {/* Back hill */}
        <path
          d="M0 200V120C120 80 280 40 400 60C520 80 600 100 720 80C840 60 960 30 1080 50C1200 70 1320 90 1440 80V200H0Z"
          fill="hsl(var(--sage-light))"
          opacity="0.5"
        />
        {/* Middle hill */}
        <path
          d="M0 200V140C180 100 300 80 480 100C660 120 780 90 900 110C1020 130 1200 100 1440 120V200H0Z"
          fill="hsl(var(--sage))"
          opacity="0.6"
        />
        {/* Front hill */}
        <path
          d="M0 200V160C200 130 400 150 600 140C800 130 1000 160 1200 150C1320 145 1380 155 1440 150V200H0Z"
          fill="hsl(var(--sage-dark))"
          opacity="0.8"
        />
        {/* Coffee trees silhouettes */}
        <g fill="hsl(var(--coffee-deep))" opacity="0.4">
          <ellipse cx="150" cy="155" rx="20" ry="30" />
          <rect x="148" y="155" width="4" height="20" />
          <ellipse cx="300" cy="145" rx="25" ry="35" />
          <rect x="298" y="150" width="4" height="25" />
          <ellipse cx="500" cy="150" rx="18" ry="28" />
          <rect x="498" y="150" width="4" height="20" />
          <ellipse cx="800" cy="140" rx="22" ry="32" />
          <rect x="798" y="145" width="4" height="22" />
          <ellipse cx="1100" cy="150" rx="20" ry="30" />
          <rect x="1098" y="150" width="4" height="20" />
          <ellipse cx="1300" cy="148" rx="24" ry="34" />
          <rect x="1298" y="150" width="4" height="24" />
        </g>
      </svg>
    </div>
  );
}
