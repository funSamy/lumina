import React, { useEffect } from 'react';
import { BrandIdentity } from '../types';
import { Download, Copy, ExternalLink } from 'lucide-react';

interface Props {
  data: BrandIdentity;
}

export const BrandDashboard: React.FC<Props> = ({ data }) => {
  const { strategy, primaryLogoUrl, secondaryMarkUrl } = data;

  useEffect(() => {
    if (strategy?.typography) {
      const { headerFont, bodyFont } = strategy.typography;
      const linkId = 'dynamic-fonts';
      if (!document.getElementById(linkId)) {
        const link = document.createElement('link');
        link.id = linkId;
        link.href = `https://fonts.googleapis.com/css2?family=${headerFont.replace(/\s+/g, '+')}&family=${bodyFont.replace(/\s+/g, '+')}&display=swap`;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      }
    }
  }, [strategy]);

  if (!strategy) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add toast here
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-12 animate-fade-in pb-20">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">Brand Bible</h2>
        <p className="text-slate-400 max-w-2xl mx-auto italic">"{strategy.brandVoice}"</p>
      </div>

      {/* Logos Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-white">Primary Logo</h3>
          </div>
          <div className="aspect-square w-full bg-slate-900 rounded-xl overflow-hidden border border-slate-700 flex items-center justify-center relative group">
            {primaryLogoUrl ? (
              <>
                <img src={primaryLogoUrl} alt="Primary Logo" className="w-full h-full object-cover" />
                <a 
                  href={primaryLogoUrl} 
                  download="primary-logo.png"
                  className="absolute bottom-4 right-4 p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Download size={20} />
                </a>
              </>
            ) : (
              <div className="text-slate-500 animate-pulse">Generating Logo...</div>
            )}
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm">
           <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-white">Secondary Mark</h3>
          </div>
          <div className="aspect-square w-full bg-slate-900 rounded-xl overflow-hidden border border-slate-700 flex items-center justify-center relative group">
            {secondaryMarkUrl ? (
              <>
                <img src={secondaryMarkUrl} alt="Secondary Mark" className="w-full h-full object-cover" />
                <a 
                  href={secondaryMarkUrl} 
                  download="secondary-mark.png"
                  className="absolute bottom-4 right-4 p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Download size={20} />
                </a>
              </>
            ) : (
              <div className="text-slate-500 animate-pulse">Generating Mark...</div>
            )}
          </div>
        </div>
      </section>

      {/* Palette Section */}
      <section className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 backdrop-blur-sm">
        <h3 className="text-xl font-semibold text-white mb-6">Color Palette</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {strategy.colors.map((color, idx) => {
            // Determine usage type for visualization
            const usageLower = color.usage.toLowerCase();
            const isText = /text|font|typography|heading|body/.test(usageLower);
            const isBg = /background|surface|canvas|neutral/.test(usageLower);

            return (
              <div key={idx} className="group relative bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden hover:border-slate-500 transition-colors flex flex-col">
                {/* Main Swatch */}
                <div 
                  className="h-24 w-full relative"
                  style={{ backgroundColor: color.hex }}
                >
                   {/* Hex Badge Overlay */}
                   <div className="absolute bottom-2 left-2 bg-black/20 backdrop-blur-md px-2 py-1 rounded text-xs font-mono text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                     {color.hex}
                   </div>
                   <button 
                     onClick={() => copyToClipboard(color.hex)}
                     className="absolute top-2 right-2 p-1.5 bg-black/10 hover:bg-black/30 backdrop-blur-md rounded-full text-white/80 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                   >
                     <Copy size={14} />
                   </button>
                </div>

                {/* Info Body */}
                <div className="p-4 flex flex-col flex-1 gap-3">
                   <div>
                     <h4 className="text-white font-semibold leading-tight">{color.name}</h4>
                     <p className="text-xs text-slate-400 font-mono mt-1 opacity-70 group-hover:opacity-100 transition-opacity">{color.hex}</p>
                   </div>
                   
                   {/* Usage Visualization */}
                   <div className="mt-auto pt-3 border-t border-white/5">
                     <div className="flex items-center gap-3">
                       {/* Visual Icon */}
                       <div 
                         className="shrink-0 w-10 h-10 rounded-lg border border-slate-600/50 overflow-hidden flex items-center justify-center bg-slate-900/50"
                         title={`Example usage: ${color.usage}`}
                       >
                          {isText ? (
                            <span style={{ color: color.hex }} className="text-xl font-serif font-bold">Aa</span>
                          ) : isBg ? (
                            <div className="w-full h-full" style={{ backgroundColor: color.hex }} />
                          ) : (
                            <div className="w-5 h-5 rounded-md shadow-sm" style={{ backgroundColor: color.hex }} />
                          )}
                       </div>
                       
                       {/* Usage Label */}
                       <div className="flex flex-col overflow-hidden">
                         <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Usage</span>
                         <p className="text-xs text-slate-300 leading-tight truncate w-full" title={color.usage}>{color.usage}</p>
                       </div>
                     </div>
                   </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Typography Section */}
      <section className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 backdrop-blur-sm">
        <h3 className="text-xl font-semibold text-white mb-6">Typography System</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
                <div>
                    <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Header Font</span>
                    <div className="flex items-baseline gap-2 mt-1">
                         <h4 className="text-2xl text-white">{strategy.typography.headerFont}</h4>
                         <a 
                            href={`https://fonts.google.com/specimen/${strategy.typography.headerFont}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-indigo-400 hover:text-indigo-300"
                         >
                            <ExternalLink size={16} />
                         </a>
                    </div>
                </div>
                <div>
                    <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Body Font</span>
                    <div className="flex items-baseline gap-2 mt-1">
                         <h4 className="text-2xl text-white">{strategy.typography.bodyFont}</h4>
                         <a 
                            href={`https://fonts.google.com/specimen/${strategy.typography.bodyFont}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-indigo-400 hover:text-indigo-300"
                         >
                            <ExternalLink size={16} />
                         </a>
                    </div>
                </div>
                <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                    <p className="text-sm text-slate-400 italic">"{strategy.typography.reasoning}"</p>
                </div>
            </div>

            <div className="bg-white text-slate-900 p-8 rounded-xl shadow-inner">
                <h1 style={{ fontFamily: strategy.typography.headerFont }} className="text-4xl font-bold mb-4">
                    The Quick Brown Fox
                </h1>
                <h2 style={{ fontFamily: strategy.typography.headerFont }} className="text-2xl font-semibold mb-4 text-slate-700">
                    Jumps Over The Lazy Dog
                </h2>
                <p style={{ fontFamily: strategy.typography.bodyFont }} className="text-lg leading-relaxed text-slate-600">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
            </div>
        </div>
      </section>
    </div>
  );
};