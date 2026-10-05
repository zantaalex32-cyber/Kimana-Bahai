import React, { useState } from 'react';
import logoImage from '../../assets/images/kimana_cluster_logo_1791234439143.jpg';

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
      <div className={`relative flex items-center justify-center shrink-0 ${sizeDimensions.box} rounded-2xl overflow-hidden shadow-sm border border-emerald-500/20 bg-gradient-to-tr from-emerald-900 via-teal-950 to-slate-900 group`}>
        {!imageError ? (
          <img 
            src={logoImage} 
            alt="Kimana Cluster Logo" 
            onError={() => setImageError(true)}
            className={`${sizeDimensions.img} object-cover rounded-2xl transition-transform duration-300 group-hover:scale-105`}
          />
        ) : (
          /* High-fidelity Vector SVG Fallback with 9-pointed Star & Kilimanjaro Emblem */
          <svg 
            viewBox="0 0 100 100" 
            className="w-full h-full p-1"
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="skyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0f172a" />
                <stop offset="60%" stopColor="#064e3b" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
              <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
            </defs>
            <rect width="100" height="100" rx="20" fill="url(#skyGrad)" />
            {/* Sunrise Rays */}
            <path d="M50 48 L15 15 M50 48 L50 8 M50 48 L85 15 M50 48 L92 35 M50 48 L8 35" stroke="#fef08a" strokeWidth="1" strokeOpacity="0.4" />
            
            {/* Mount Kilimanjaro Silhouette */}
            <path d="M12 88 L38 52 L52 50 L64 54 L88 88 Z" fill="#042f2e" />
            {/* Snow Cap */}
            <path d="M42 51 L48 49 L54 50 L58 52 L60 56 L55 58 L52 55 L48 57 L44 55 Z" fill="#ffffff" fillOpacity="0.9" />
            <path d="M26 88 L46 64 L56 65 L76 88 Z" fill="#064e3b" fillOpacity="0.6" />

            {/* Radiant Nine-Pointed Bahá'í Star */}
            <g transform="translate(50, 32) scale(1.1)">
              {Array.from({ length: 9 }).map((_, i) => {
                const angle = (i * 360) / 9;
                return (
                  <path
                    key={i}
                    d="M 0 -16 L 3.5 -5 L 0 0 L -3.5 -5 Z"
                    fill="url(#goldGrad)"
                    transform={`rotate(${angle})`}
                  />
                );
              })}
              <circle cx="0" cy="0" r="3.5" fill="#fef08a" />
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
