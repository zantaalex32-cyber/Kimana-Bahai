import React, { useState } from 'react';
import logoImage from '../../assets/images/kimana_cluster_logo_1792154698520.jpg';

interface AppLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showText?: boolean;
  textClassName?: string;
  subtextClassName?: string;
  className?: string;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 'md',
  showText = false,
  textClassName = '',
  subtextClassName = '',
  className = ''
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeDimensions = {
    xs: { box: 'w-6 h-6', img: 'w-6 h-6', text: 'text-sm', sub: 'text-[9px]' },
    sm: { box: 'w-8 h-8', img: 'w-8 h-8', text: 'text-base font-bold', sub: 'text-[10px]' },
    md: { box: 'w-10 h-10', img: 'w-10 h-10', text: 'text-lg font-bold', sub: 'text-xs' },
    lg: { box: 'w-14 h-14', img: 'w-14 h-14', text: 'text-xl font-extrabold', sub: 'text-xs' },
    xl: { box: 'w-20 h-20', img: 'w-20 h-20', text: 'text-2xl font-black', sub: 'text-sm' },
    '2xl': { box: 'w-28 h-28', img: 'w-28 h-28', text: 'text-3xl font-black', sub: 'text-base' }
  }[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Emblem / Logo Icon */}
      <div className={`relative flex items-center justify-center shrink-0 ${sizeDimensions.box} rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 group`}>
        {!imageError ? (
          <img 
            src={logoImage} 
            alt="Kimana Cluster Tracker Logo" 
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className={`${sizeDimensions.img} object-contain rounded-2xl transition-transform duration-300 group-hover:scale-105`}
          />
        ) : (
          /* High-fidelity Vector SVG Fallback of the Circular Wheel Logo */
          <svg 
            viewBox="0 0 100 100" 
            className="w-full h-full p-1"
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="100" height="100" rx="20" fill="#f8fafc" />
            <g transform="translate(50, 50)">
              {/* Outer Colorful Ring Sectors */}
              <path d="M 0 -36 A 36 36 0 0 1 31.18 -18 L 20.78 -12 A 24 24 0 0 0 0 -24 Z" fill="#6339a8" />
              <path d="M 31.18 -18 A 36 36 0 0 1 31.18 18 L 20.78 12 A 24 24 0 0 0 20.78 -12 Z" fill="#8bc34a" />
              <path d="M 31.18 18 A 36 36 0 0 1 0 36 L 0 24 A 24 24 0 0 0 20.78 12 Z" fill="#e53935" />
              <path d="M 0 36 A 36 36 0 0 1 -31.18 18 L -20.78 12 A 24 24 0 0 0 0 24 Z" fill="#fb8c00" />
              <path d="M -31.18 18 A 36 36 0 0 1 -31.18 -18 L -20.78 -12 A 24 24 0 0 0 -20.78 12 Z" fill="#fbc02d" />
              <path d="M -31.18 -18 A 36 36 0 0 1 0 -36 L 0 -24 A 24 24 0 0 0 -20.78 -12 Z" fill="#42a5f5" />

              {/* White Circular Donut Ring */}
              <circle cx="0" cy="0" r="23" fill="#ffffff" />

              {/* Center Red Disc and Down-Right Stem */}
              <rect x="5" y="5" width="10" height="24" rx="3" fill="#e53935" transform="rotate(-45 10 17)" />
              <circle cx="0" cy="0" r="14" fill="#e53935" />
            </g>
          </svg>
        )}
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col leading-tight select-none">
          <div className="flex items-center gap-1.5">
            <span className={`tracking-tight text-slate-900 dark:text-white font-extrabold ${sizeDimensions.text} ${textClassName}`}>
              KIMANA CLUSTER
            </span>
            <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
              KENYA
            </span>
          </div>
          <span className={`text-slate-500 dark:text-slate-400 font-medium ${sizeDimensions.sub} ${subtextClassName}`}>
            Community Development Tracker
          </span>
        </div>
      )}
    </div>
  );
};
