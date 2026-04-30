import React from 'react';
import { X, Settings as SettingsIcon } from 'lucide-react';

const Toggle = ({ checked, onChange }) => (
    <button
        onClick={() => onChange(!checked)}
        className={`relative w-16 h-8 border-4 border-blue-900 transition-colors shrink-0 ${
            checked ? 'bg-green-400' : 'bg-gray-300'
        }`}
        aria-pressed={checked}
    >
        <span
            className={`absolute top-0 bottom-0 my-auto w-5 h-5 bg-white border-2 border-blue-900 transition-all ${
                checked ? 'left-[calc(100%-1.5rem)]' : 'left-0.5'
            }`}
        />
    </button>
);

const SettingsModal = ({ isOpen, onClose, settings, onUpdateSetting }) => {
    if (!isOpen) return null;

    const items = [
        {
            key: 'bannersEnabled',
            label: 'Rank Banners',
            desc: 'Show the ★ Star Master, Gold Ingot and Iron banners for the top 3 students. Disable to keep all student rows plain.',
            emoji: '🏆',
        },
        {
            key: 'easterEgg67Enabled',
            label: '67 Easter Egg',
            desc: 'When a student lands on 67, 167, 267 or 367 (and stays there for 1.5s), the banner fills with "67"s for a few seconds.',
            emoji: '🥚',
        },
    ];

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-blue-900/80 backdrop-blur-md animate-in fade-in duration-150"
            onClick={e => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-white w-full max-w-lg border-4 border-blue-900 shadow-[12px_12px_0px_0px_rgba(0,0,0,0.4)] flex flex-col overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-200">

                {/* Header — yellow arcade band */}
                <div className="bg-yellow-400 border-b-4 border-blue-900 p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <SettingsIcon className="text-blue-900 animate-spin-slow" size={26} strokeWidth={2.5} />
                        <h2 className="text-2xl font-black text-blue-900 font-mono uppercase tracking-wider">Settings</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-blue-900 hover:text-red-600 bg-white border-2 border-blue-900 p-1 rounded-sm shadow-[2px_2px_0px_0px_rgba(30,58,138,1)] active:translate-y-1 active:shadow-none"
                    >
                        <X size={20} strokeWidth={3} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 bg-slate-50 flex flex-col gap-4">
                    {items.map(item => (
                        <div
                            key={item.key}
                            className="bg-white border-4 border-blue-900 shadow-[6px_6px_0px_0px_rgba(30,58,138,1)] p-4 flex items-center gap-4"
                        >
                            <span className="text-3xl shrink-0">{item.emoji}</span>
                            <div className="flex-1 min-w-0">
                                <p className="font-black text-blue-900 font-mono uppercase text-sm tracking-wider">
                                    {item.label}
                                </p>
                                <p className="text-gray-600 text-xs leading-snug mt-0.5">{item.desc}</p>
                            </div>
                            <Toggle
                                checked={!!settings[item.key]}
                                onChange={(v) => onUpdateSetting(item.key, v)}
                            />
                        </div>
                    ))}

                    <p className="text-center text-xs text-gray-400 font-mono uppercase tracking-widest mt-2">
                        more coming soon
                    </p>
                </div>

                {/* Footer */}
                <div className="bg-blue-100 border-t-4 border-blue-900 px-5 py-3 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-blue-900 text-white font-black uppercase text-xs tracking-widest border-2 border-blue-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)] hover:bg-blue-800 hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
