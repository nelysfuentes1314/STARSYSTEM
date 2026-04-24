import React from 'react';
import { X, Sparkles } from 'lucide-react';

const CHANGELOG = [
    {
        tag: 'Rankings',
        color: 'bg-yellow-400 text-yellow-900',
        title: 'Top 3 Special Banners',
        desc: 'The top 3 students with the most stars now stand out with special banners! 1st place earns the ★ Star Master banner in gold, 2nd place gets a shiny Gold banner, and 3rd place gets a Silver banner — each with its own badge.',
    },
    {
        tag: 'Visual',
        color: 'bg-sky-400 text-sky-900',
        title: 'Flying Stars When Giving Points',
        desc: 'Every time a student earns stars, little stars fly across the screen toward their name. When you reward the whole class at once, every student sees the stars flying at the same time!',
    },
    {
        tag: 'Sound',
        color: 'bg-purple-400 text-white',
        title: 'Magic Sound Effect',
        desc: 'A short, fun sound plays every time stars are given out — it works right away, nothing extra needed. The sound also plays when you reward the whole class at once.',
    },
    {
        tag: 'Medals',
        color: 'bg-amber-500 text-white',
        title: 'Medal System',
        desc: 'Move your mouse over any student to reveal an Award button. Click it to give them a medal: ⭐ Good Behavior, ✋ Participation, or make your own with a custom name and emoji. Medals show up as shiny gold badges under the student\'s name.',
    },
    {
        tag: 'Class Tool',
        color: 'bg-green-500 text-white',
        title: 'Award All — Give Stars to Everyone',
        desc: 'The "Award All" button lets you pick a number of stars and give them to every student in the class at the same time — great for group activities or when the whole class deserves a reward.',
    },
    {
        tag: 'Class Tool',
        color: 'bg-red-500 text-white',
        title: 'Star Challenge ⚔️',
        desc: 'A fun classroom game: pick two students and decide how many stars are on the line. The winner takes the stars from the other. Perfect for review games, quick quizzes, or friendly competitions!',
    },
    {
        tag: 'Display',
        color: 'bg-slate-500 text-white',
        title: 'Sort Student List',
        desc: 'Use the Sort button to organize your students by name (A to Z) or by who has the most stars. Great for quickly finding a student or seeing who\'s leading the class.',
    },
    {
        tag: 'Stars',
        color: 'bg-blue-500 text-white',
        title: 'More Star Levels',
        desc: 'There are now even more star levels for students to reach! New ranks include Diamond, Fire, Amethyst, Galactic, and the legendary Golden Titan — something to work toward for your highest achievers.',
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
                            <p className="text-blue-300 text-xs font-medium">Latest update · 8 new features</p>
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