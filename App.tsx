import React, { useState } from 'react';
import { BrandDashboard } from './components/BrandDashboard';
import { ChatInterface } from './components/ChatInterface';
import { generateBrandStrategy, generateLogoImage, initChatSession } from './services/geminiService';
import { BrandIdentity } from './types';
import { Wand2, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [mission, setMission] = useState('');
  const [loadingStep, setLoadingStep] = useState<string | null>(null);
  const [brandData, setBrandData] = useState<BrandIdentity | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mission.trim()) return;

    setError(null);
    setLoadingStep("Drafting Brand Strategy...");
    
    try {
      // 1. Generate Strategy
      const strategy = await generateBrandStrategy(mission);
      setLoadingStep("Rendering Primary Logo...");
      
      // Initialize chat with new context
      initChatSession(strategy);

      // 2. Generate Primary Logo
      // Note: We do these in parallel if we wanted speed, but sequentially gives better loading feedback
      const primaryUrl = await generateLogoImage(strategy.logoPrompts.primary);
      
      setLoadingStep("Rendering Secondary Mark...");
      // 3. Generate Secondary Mark
      const secondaryUrl = await generateLogoImage(strategy.logoPrompts.secondary);

      setBrandData({
        mission,
        strategy,
        primaryLogoUrl: primaryUrl,
        secondaryMarkUrl: secondaryUrl,
      });

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate brand identity. Please try again.");
    } finally {
      setLoadingStep(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100">
      {/* Hero / Input Section */}
      {!brandData && (
        <div className="container mx-auto px-4 h-screen flex flex-col justify-center items-center relative z-10">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[128px]" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px]" />
          </div>

          <div className="text-center max-w-2xl mx-auto space-y-8 animate-fade-in-up">
            <div className="space-y-4">
              <h1 className="text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-white">
                Lumina
              </h1>
              <p className="text-xl text-slate-400">
                AI-Powered Brand Identity Generator
              </p>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 p-8 rounded-2xl shadow-2xl w-full">
              <form onSubmit={handleGenerate} className="space-y-6">
                <div>
                  <label htmlFor="mission" className="block text-sm font-medium text-slate-400 mb-2 text-left">
                    Describe your company mission & vision
                  </label>
                  <textarea
                    id="mission"
                    value={mission}
                    onChange={(e) => setMission(e.target.value)}
                    placeholder="e.g. A sustainable coffee roastery based in Seattle that focuses on direct trade and compostable packaging. We are modern, earthy, and premium."
                    className="w-full h-32 bg-slate-800 border border-slate-600 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                    disabled={!!loadingStep}
                  />
                </div>

                <div className="flex gap-4 items-end">
                    <button
                      type="submit"
                      disabled={!!loadingStep || !mission.trim()}
                      className="w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 h-[50px]"
                    >
                      {loadingStep ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <>
                          <Wand2 size={20} />
                          Generate Identity
                        </>
                      )}
                    </button>
                </div>
              </form>
              
              {loadingStep && (
                <div className="mt-6 text-slate-400 text-sm animate-pulse">
                   {loadingStep}
                </div>
              )}
               {error && (
                <div className="mt-6 text-red-400 text-sm bg-red-900/20 p-3 rounded-lg border border-red-900/50">
                   {error}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Dashboard View */}
      {brandData && (
        <div className="relative z-10 min-h-screen py-10 px-4">
           {/* Navigation to Reset */}
           <div className="max-w-6xl mx-auto mb-8 flex justify-between items-center">
              <h1 className="text-2xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-white">
                Lumina
              </h1>
              <button 
                onClick={() => { setBrandData(null); setMission(''); }}
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                Create New Identity
              </button>
           </div>
           
           <BrandDashboard data={brandData} />
           <ChatInterface />
        </div>
      )}
      
      {/* Background Gradient for Dashboard */}
      {brandData && (
         <div className="fixed inset-0 z-0 bg-slate-900 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-900/20 to-transparent" />
         </div>
      )}

      {/* CSS Animation Extras */}
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
         @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
           animation: fade-in 1s ease-out forwards;
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
           animation: slide-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;