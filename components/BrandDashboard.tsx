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
          {strategy.colors.map((color, idx) => (
            <div key={idx} className="group relative">
              <div 
                className="h-32 w-full rounded-xl shadow-lg mb-3 border border-white/5 transition-transform group-hover:scale-105"
                style={{ backgroundColor: color.hex }}
              />
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-white">{color.hex}</p>
                  <button onClick={() => copyToClipboard(color.hex)} className="text-slate-400 hover:text-white">
                    <Copy size={14} />
                  </button>
                </div>
                <p className="text-sm font-medium text-slate-300">{color.name}</p>
                <p className="text-xs text-slate-500">{color.usage}</p>
              </div>
            </div>
          ))}
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