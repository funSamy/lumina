import React, { useEffect, useState } from 'react';
import { BrandIdentity } from '../types';
import { Download, Copy, ExternalLink, RefreshCw } from 'lucide-react';
import { generateLogoImage } from '../services/geminiService';

interface Props {
  data: BrandIdentity;
}

export const BrandDashboard: React.FC<Props> = ({ data }) => {
  const { strategy, primaryLogoUrl: initialPrimaryUrl, secondaryMarkUrl: initialSecondaryUrl } = data;

  const [primaryUrl, setPrimaryUrl] = useState<string | null>(initialPrimaryUrl);
  const [secondaryUrl, setSecondaryUrl] = useState<string | null>(initialSecondaryUrl);
  const [isRegeneratingPrimary, setIsRegeneratingPrimary] = useState(false);
  const [isRegeneratingSecondary, setIsRegeneratingSecondary] = useState(false);

  // Sync state if props change (e.g. user generated a completely new identity)
  useEffect(() => {
    setPrimaryUrl(initialPrimaryUrl);
  }, [initialPrimaryUrl]);

  useEffect(() => {
    setSecondaryUrl(initialSecondaryUrl);
  }, [initialSecondaryUrl]);

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
  };

  const handleRegenerate = async (type: 'primary' | 'secondary') => {
    if (type === 'primary') {
      setIsRegeneratingPrimary(true);
      try {
        const newUrl = await generateLogoImage(strategy.logoPrompts.primary);
        setPrimaryUrl(newUrl);
      } catch (error) {
        console.error("Failed to regenerate primary logo", error);
        // Optional: Add toast or error feedback
      } finally {
        setIsRegeneratingPrimary(false);
      }
    } else {
      setIsRegeneratingSecondary(true);
      try {
        const newUrl = await generateLogoImage(strategy.logoPrompts.secondary);
        setSecondaryUrl(newUrl);
      } catch (error) {
        console.error("Failed to regenerate secondary mark", error);
      } finally {
        setIsRegeneratingSecondary(false);
      }
    }
  };

  const renderUsageVisual = (hex: string, usage: string) => {
    const u = usage.toLowerCase();
    
    // Text / Typography
    if (u.match(/text|font|typography|heading|body|title/)) {
      return (
        <div className="flex items-center justify-center w-full h-full bg-slate-950/80" title="Typography">
          <span style={{ color: hex }} className="font-serif text-lg font-bold">Aa</span>
        </div>
      );
    }
    
    // Background / Surface
    if (u.match(/background|surface|canvas|neutral|fill/)) {
      return (
        <div className="w-full h-full relative" style={{ backgroundColor: hex }} title="Background">
           <div className="absolute inset-0 border border-black/5" />
           <div className="absolute inset-2 bg-white/10 rounded-sm" />
        </div>
      );
    }
  
    // Primary / Action / Button
    if (u.match(/primary|action|button|cta|main/)) {
       return (
         <div className="flex flex-col items-center justify-center w-full h-full bg-slate-950/80 gap-1 p-1.5" title="Interactive Element">
            <div className="w-full h-1 bg-slate-700 rounded-full opacity-50" />
            <div className="w-full h-1 bg-slate-700 rounded-full opacity-50" />
            <div className="mt-auto w-full h-2.5 rounded-[2px] shadow-sm" style={{ backgroundColor: hex }} />
         </div>
       );
    }
  
    // Accent / Highlight
    if (u.match(/accent|highlight|decoration|pop/)) {
       return (
         <div className="flex items-center justify-center w-full h-full bg-slate-950/80 relative" title="Accent">
            <div className="w-6 h-6 rounded-md bg-slate-800 border border-slate-700 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-3 h-3 rounded-bl-md" style={{ backgroundColor: hex }} />
            </div>
         </div>
       );
    }
  
    // Secondary / Border / Outline
    if (u.match(/secondary|border|stroke|outline|tertiary/)) {
      return (
        <div className="flex items-center justify-center w-full h-full bg-slate-950/80" title="Secondary / Outline">
          <div className="w-6 h-6 rounded-md border-2" style={{ borderColor: hex }} />
        </div>
      );
    }
  
    // Fallback - Generic Swatch
    return (
      <div className="flex items-center justify-center w-full h-full bg-slate-950/80" title="Color Swatch">
        <div className="w-5 h-5 rounded-full shadow-sm ring-1 ring-white/10" style={{ backgroundColor: hex }} />
      </div>
    );
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
            <button 
              onClick={() => handleRegenerate('primary')}
              disabled={isRegeneratingPrimary || !primaryUrl}
              className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
              title="Regenerate Logo"
            >
              <RefreshCw size={18} className={isRegeneratingPrimary ? "animate-spin" : ""} />
            </button>
          </div>
          <div className="aspect-square w-full bg-slate-900 rounded-xl overflow-hidden border border-slate-700 flex items-center justify-center relative group">
            {primaryUrl && !isRegeneratingPrimary ? (
              <>
                <img src={primaryUrl} alt="Primary Logo" className="w-full h-full object-cover" />
                <a 
                  href={primaryUrl} 
                  download="primary-logo.png"
                  className="absolute bottom-4 right-4 p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Download size={20} />
                </a>
              </>
            ) : (
              <div className="text-slate-500 flex flex-col items-center gap-3">
                 <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                 <span className="animate-pulse">{isRegeneratingPrimary ? 'Regenerating...' : 'Generating Logo...'}</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm">
           <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-white">Secondary Mark</h3>
            <button 
              onClick={() => handleRegenerate('secondary')}
              disabled={isRegeneratingSecondary || !secondaryUrl}
              className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
              title="Regenerate Mark"
            >
              <RefreshCw size={18} className={isRegeneratingSecondary ? "animate-spin" : ""} />
            </button>
          </div>
          <div className="aspect-square w-full bg-slate-900 rounded-xl overflow-hidden border border-slate-700 flex items-center justify-center relative group">
            {secondaryUrl && !isRegeneratingSecondary ? (
              <>
                <img src={secondaryUrl} alt="Secondary Mark" className="w-full h-full object-cover" />
                <a 
                  href={secondaryUrl} 
                  download="secondary-mark.png"
                  className="absolute bottom-4 right-4 p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Download size={20} />
                </a>
              </>
            ) : (
              <div className="text-slate-500 flex flex-col items-center gap-3">
                 <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                 <span className="animate-pulse">{isRegeneratingSecondary ? 'Regenerating...' : 'Generating Mark...'}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Palette Section */}
      <section className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 backdrop-blur-sm">
        <h3 className="text-xl font-semibold text-white mb-6">Color Palette</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {strategy.colors.map((color, idx) => {
            return (
              <div key={idx} className="group relative bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden hover:border-slate-500 transition-colors flex flex-col">
                {/* Main Swatch */}
                <div 
                  className="h-24 w-full relative transition-transform duration-500 group-hover:scale-105"
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
                       <div className="shrink-0 w-10 h-10 rounded-lg border border-slate-600/50 overflow-hidden">
                          {renderUsageVisual(color.hex, color.usage)}
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