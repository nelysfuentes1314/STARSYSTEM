import React, { useState } from 'react';
import { X, Gift } from 'lucide-react';
import { playMagicSound } from './StudentCard';

const GroupAwardModal = ({ isOpen, onClose, onAward }) => {
    const [amount, setAmount] = useState(1);

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (amount > 0) {
            onAward(amount);
            playMagicSound();
            setAmount(1);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-sm border-4 border-blue-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] flex flex-col">
                
                {/* Header */}
                <div className="bg-yellow-400 border-b-4 border-blue-900 p-4 flex justify-between items-center relative overflow-hidden">
                    <div className="flex items-center gap-2 relative z-10">
                        <Gift className="text-blue-900 animate-tweak" size={28} />
                        <h2 className="text-2xl font-black text-blue-900 font-mono tracking-tighter uppercase">Group Reward</h2>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-blue-900 hover:text-red-600 transition-colors z-10 bg-white border-2 border-blue-900 p-1 rounded-sm shadow-[2px_2px_0px_0px_rgba(30,58,138,1)] active:translate-y-1 active:shadow-none"
                    >
                        <X size={24} strokeWidth={3} />
                    </button>
                    {/* Background decoration */}
                    <div className="absolute right-[-10px] top-[-10px] opacity-20 transform rotate-12 animate-pulse-fast">
                        <Gift size={100} />
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col items-center gap-4 bg-yellow-50">
                    <p className="text-center font-bold text-blue-900 leading-tight">
                        How many stars do you want to give to <span className="text-red-600 uppercase font-black underline">EVERYONE</span>?
                    </p>
                    
                    <div className="flex items-center gap-4 bg-white p-4 border-4 border-blue-900 shadow-[4px_4px_0px_0px_rgba(30,58,138,1)] transform rotate-1">
                        <button 
                            onClick={() => setAmount(Math.max(1, amount - 1))}
                            className="bg-red-500 text-white w-10 h-10 flex items-center justify-center font-black text-xl border-2 border-blue-900 active:translate-y-1 hover:bg-red-400 transition-all"
                        >
                            -
                        </button>
                        
                        <input 
                            type="number" 
                            min="1"
                            value={amount}
                            onChange={(e) => setAmount(parseInt(e.target.value) || 1)}
                            className="w-16 h-12 text-center text-3xl font-black text-blue-900 border-b-4 border-yellow-400 bg-transparent focus:outline-none"
                        />
                        
                        <button 
                            onClick={() => setAmount(amount + 1)}
                            className="bg-green-500 text-white w-10 h-10 flex items-center justify-center font-black text-xl border-2 border-blue-900 active:translate-y-1 hover:bg-green-400 transition-all"
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-white border-t-4 border-blue-900 flex justify-end gap-3">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleConfirm}
                        className="px-6 py-2 bg-yellow-400 text-blue-900 font-black uppercase tracking-wider border-2 border-blue-900 shadow-[4px_4px_0px_0px_rgba(30,58,138,1)] hover:bg-yellow-300 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(30,58,138,1)] active:translate-y-1 active:shadow-none transition-all"
                    >
                        Award Stars!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GroupAwardModal;
