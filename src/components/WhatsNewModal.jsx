import React from 'react';
import { X, Sparkles } from 'lucide-react';

const CHANGELOG = [
    {
        tag: 'Toolkit',
        color: 'bg-yellow-400 text-yellow-900',
        title: '🛠 Toolkit — Timer, Groups & Picker',
        desc: 'New Toolkit button at the top-right of every class. Pick one of three tools: a countdown Timer with quick presets and an alarm; a Group Maker that splits the class into random teams of any size; and a Random Picker that rolls one or more students at random. Each opens from a single landing screen — pick what you need.',
    },
    {
        tag: 'Challenges',
        color: 'bg-red-500 text-white',
        title: 'Countdown Blizzard ❄ — new challenge mode',
        desc: 'The "Challenge!" button now lets you choose between Duels (the classic 1-vs-1) and the brand-new Countdown Blizzard. Pick a stake, a duration (10s · 30s · 1m · 2m) and the participants. The clock starts, and the first student to answer correctly wins the stake. If nobody answers in time, every participant loses the stake. Great for fast-paced review.',
    },
    {
        tag: 'Settings',
        color: 'bg-blue-500 text-white',
        title: '⚙️ Settings panel',
        desc: 'A new Settings button next to "What\'s new" lets you tailor the experience: turn the Top-3 rank banners on/off (handy if you prefer a uniform look), and enable or disable the secret 67 Easter Egg. Settings persist across sessions.',
    },
    {
        tag: 'Medals',
        color: 'bg-amber-500 text-white',
        title: 'Edit & remove medals',
        desc: 'Medals are now interactive. Double-click any medal pill to edit its name and icon. Click it four times in quick succession to remove it. Past awards no longer get stuck — fix typos or retire a medal anytime.',
    },
    {
        tag: 'Sound',
        color: 'bg-purple-400 text-white',
        title: 'New audio cues',
        desc: 'Removing stars now plays a short descending tone so subtractions feel deliberate. When a challenge winner is confirmed (Duel or Blizzard), a triumphant fanfare plays — a quick rising arpeggio into a sustained C-major chord with a sparkle on top.',
    },
    {
        tag: 'UX',
        color: 'bg-slate-500 text-white',
        title: 'Default sort by stars',
        desc: 'Open any class and students are now ranked by stars (highest first) by default. The Sort button still toggles back to A–Z whenever you want.',
    },
    {
        tag: 'Polish',
        color: 'bg-green-500 text-white',
        title: 'Star Master banner glow-up',
        desc: 'The 1st-place banner now floats a richer mix of stars — gold, cyan, purple, red and green pixel stars at varied sizes and timings, drifting upward without distracting jitter. Top spot looks the part.',
    },
];

const WhatsNewModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-blue-950/70 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="bg-white border-4 border-blue-900 rounded-2xl shadow-[10px_10px_0px_0px_rgba(30,58,138,1)] w-full max-w-2xl max-h-[85vh] flex flex-col animate-in zoom-in-95 slide-in-from-bottom-4 duration-200">

                {/* Header */}
                <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 to-blue-800 rounded-t-xl px-6 py-5 flex items-center justify-between shrink-0">
                    <div className="relative z-10 flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-400 border-2 border-yellow-600 shadow-[0_0_14px_rgba(250,204,21,0.7)]">
                            <Sparkles size={20} className="text-yellow-900" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white font-mono tracking-tight uppercase">What's New</h2>
                            <p className="text-blue-300 text-xs font-medium">Playground branch · 7 new updates</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="relative z-10 text-blue-300 hover:text-white transition-colors p-1 rounded"
                    >
                        <X size={24} strokeWidth={2.5} />
                    </button>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
                        <Sparkles size={120} className="text-white" />
                    </div>
                </div>

                {/* Scrollable changelog */}
                <div className="overflow-y-auto p-5 space-y-3">
                    {CHANGELOG.map((item, i) => (
                        <div
                            key={i}
                            className="flex gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-blue-200 hover:shadow-sm transition-all"
                        >
                            <span className={`shrink-0 self-start mt-0.5 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md ${item.color}`}>
                                {item.tag}
                            </span>
                            <div className="min-w-0">
                                <p className="font-bold text-blue-900 font-mono text-sm mb-0.5">{item.title}</p>
                                <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="shrink-0 border-t border-gray-100 px-5 py-3 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 bg-blue-900 hover:bg-blue-800 hover:brightness-110 text-white font-bold rounded-lg font-mono uppercase text-xs tracking-wider transition-colors"
                    >
                        Got it!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WhatsNewModal;