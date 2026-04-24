import React from 'react';
import { X, Sparkles } from 'lucide-react';

const CHANGELOG = [
    {
        tag: 'Rankings',
        color: 'bg-yellow-400 text-yellow-900',
        title: 'Top 3 Live Ranking Banners',
        desc: 'The top 3 students by points now get fully themed banners. 1st place earns the ★ Star Master banner — gold gradient with pixel stars floating upward. 2nd place gets a Gold Ingot banner with a sweeping metallic shine. 3rd place receives an Iron/Silver polished steel banner. All ranks show a custom badge icon and label.',
    },
    {
        tag: 'Animation',
        color: 'bg-sky-400 text-sky-900',
        title: 'Flying Stars on Point Gain',
        desc: 'Whenever a student earns points, pixel stars launch from the right and arc toward their name, flashing gold on impact and glowing the name yellow. When awarding the whole group, every student card fires stars simultaneously.',
    },
    {
        tag: 'Sound',
        color: 'bg-purple-400 text-white',
        title: 'Magic Sound Effect',
        desc: 'Adding stars plays a short ascending magical arpeggio (C5 → E5 → G5 → C6) generated entirely in the browser via Web Audio API — no audio files needed. The Group Award plays it once for the whole class.',
    },
    {
        tag: 'Medals',
        color: 'bg-amber-500 text-white',
        title: 'Medal System',
        desc: 'Each student now has an Award button (hover to reveal, left of the name). Click it to open the Medal modal and give: ⭐ Behavior, ✋ Participation, or a fully custom medal with your own name and emoji. Medals appear as shiny animated gold pills below the student\'s name, visible at all times.',
    },
    {
        tag: 'Group Tool',
        color: 'bg-green-500 text-white',
        title: 'Award All — Group Reward',
        desc: 'The "Award All" button opens a modal where you pick a star amount and award it to every student in the class at once — stars fly and sound plays for each card.',
    },
    {
        tag: 'Group Tool',
        color: 'bg-red-500 text-white',
        title: 'Star Challenge ⚔️',
        desc: 'A classroom duel mechanic: pick two students and a wager. The loser\'s stars transfer to the winner. Great for competitive review games or pop quizzes.',
    },
    {
        tag: 'UX',
        color: 'bg-slate-500 text-white',
        title: 'Sort Toggle',
        desc: 'Sort the student list by name (A–Z) or by star count (highest first) using the Sort button in the toolbar.',
    },
    {
        tag: 'Stars',
        color: 'bg-blue-500 text-white',
        title: 'Extended Evolution Tiers',
        desc: 'The pixel star evolution system now goes up to Level 10+ with new unique tiers: Diamond (cyan), Fire (orange), Amethyst (purple), Galactic cluster (4-star formation), and a Golden Titan for 2560+ points.',
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
                            <p className="text-blue-300 text-xs font-medium">Playground branch · 8 new features</p>
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
