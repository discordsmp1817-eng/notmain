import { useState } from 'react';
import { Layers } from 'lucide-react';
import { resolveAssetUrl } from '../data/termicoreData';

interface EngineeringImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
  darkFallback?: boolean;
  priority?: boolean;
}

export function EngineeringImage({
  src,
  alt,
  className = '',
  fallbackTitle,
  darkFallback = false,
  priority = false,
}: EngineeringImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center p-6 text-center ${
          darkFallback
            ? 'bg-[#101D2B] text-slate-300 border border-slate-800'
            : 'bg-[#F8FAFC] text-slate-700 border border-slate-200'
        } ${className}`}
      >
        <Layers className="h-7 w-7 mb-2 text-[#0F766E]" strokeWidth={1.5} />
        <span className="text-xs font-semibold tracking-tight">
          {fallbackTitle || alt}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-[#F8FAFC] flex items-center justify-center ${className}`}>
      <img
        src={resolveAssetUrl(src)}
        alt={alt}
        referrerPolicy="no-referrer"
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        onError={() => setFailed(true)}
        className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
      />
    </div>
  );
}
