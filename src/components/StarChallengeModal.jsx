import React, { useState, useEffect } from 'react';
import { X, Swords, Trophy, BookOpen, PenTool, Mic, Type } from 'lucide-react';

const StarChallengeModal = ({ isOpen, onClose, students, onTransfer }) => {
    const [step, setStep] = useState(0);
    const [challengeType, setChallengeType] = useState('');
    const [betAmount, setBetAmount] = useState(5);
    const [challengerId, setChallengerId] = useState('');
    const [challengedId, setChallengedId] = useState('');
    const [winnerId, setWinnerId] = useState('');

    useEffect(() => {
        if (isOpen) {
            setStep(0);
            setChallengeType('');
            setBetAmount(5);
            setChallengerId('');
            setChallengedId('');
            setWinnerId('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleTransfer = () => {
        if (!challengerId || !challengedId || !winnerId) return;
        
        const loserId = winnerId === challengerId ? challengedId : challengerId;
        onTransfer(loserId, winnerId, betAmount);
        onClose();
    };

    const nextStep = () => setStep(s => s + 1);

    const types = [
        { id: 'Vocab', icon: BookOpen, color: 'bg-blue-500' },
        { id: 'Grammar', icon: PenTool, color: 'bg-green-500' },
        { id: 'Spelling', icon: Type, color: 'bg-purple-500' },
        { id: 'Speaking', icon: Mic, color: 'bg-orange-500' }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-900/80 backdrop-blur-md transition-opacity">
            <div className="bg-white w-full max-w-2xl border-4 border-blue-900 shadow-[12px_12px_0px_0px_rgba(0,0,0,0.4)] flex flex-col min-h-[400px] overflow-hidden relative">
                
                {/* Header (hidden in Intro) */}
                {step > 0 && (
                    <div className="bg-yellow-400 border-b-4 border-blue-900 p-4 flex justify-between items-center relative animate-in slide-in-from-top duration-300 z-20">
                        <div className="flex items-center gap-2">
                            <Swords className="text-blue-900" size={24} />
                            <h2 className="text-xl font-black text-blue-900 font-mono uppercase">
                                Challenge: {challengeType || '...'} {betAmount ? `(★ ${betAmount})` : ''}
                            </h2>
                        </div>
                        <button 
                            onClick={onClose}
                            className="text-blue-900 hover:text-red-600 bg-white border-2 border-blue-900 p-1 rounded-sm shadow-[2px_2px_0px_0px_rgba(30,58,138,1)] active:translate-y-1 active:shadow-none"
                        >
                            <X size={20} strokeWidth={3} />
                        </button>
                    </div>
                )}

                {/* Content Container */}
                <div className="flex-grow flex items-center justify-center p-6 bg-slate-50 relative overflow-hidden">
                    
                    {/* Step 0: Intro */}
                    {step === 0 && (
                        <div className="w-full h-full flex flex-col items-center justify-center animate-in zoom-in duration-500">
                            <Swords size={120} className="text-red-600 mb-6 animate-bounce-slow drop-shadow-[0_0_20px_rgba(220,38,38,0.6)]" strokeWidth={1.5} />
                            <h1 className="text-6xl font-black text-blue-900 uppercase tracking-tighter text-center mb-8 animate-pulse drop-shadow-lg" style={{ WebkitTextStroke: '2px white' }}>
                                Star Challenge
                            </h1>
                            <button 
                                onClick={nextStep}
                                className="text-2xl px-12 py-4 bg-red-600 text-white font-black uppercase tracking-widest border-4 border-blue-900 shadow-[8px_8px_0px_0px_rgba(30,58,138,1)] hover:bg-red-500 hover:-translate-y-2 hover:shadow-[10px_10px_0px_0px_rgba(30,58,138,1)] active:translate-y-0 active:shadow-none transition-all"
                            >
                                START!
                            </button>
                            <button onClick={onClose} className="mt-6 text-gray-500 font-bold hover:text-red-500 uppercase tracking-wider">Cancel</button>
                        </div>
                    )}

                    {/* Step 1: Challenge Type */}
                    {step === 1 && (
                        <div className="w-full animate-in slide-in-from-right fade-in duration-300 flex flex-col items-center">
                            <h3 className="text-3xl font-black text-blue-900 uppercase mb-8 text-center bg-yellow-300 px-6 py-2 border-4 border-blue-900 shadow-[4px_4px_0px_0px_rgba(30,58,138,1)] transform -rotate-2">
                                What is the challenge?
                            </h3>
                            <div className="grid grid-cols-2 gap-6 w-full max-w-lg">
                                {types.map(type => {
                                    const Icon = type.icon;
                                    return (
                                        <button
                                            key={type.id}
                                            onClick={() => { setChallengeType(type.id); nextStep(); }}
                                            className={`${type.color} text-white p-6 border-4 border-blue-900 shadow-[6px_6px_0px_0px_rgba(30,58,138,1)] flex flex-col items-center gap-4 hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(30,58,138,1)] active:translate-y-0 active:shadow-none transition-all group`}
                                        >
                                            <Icon size={48} className="group-hover:animate-tweak" />
                                            <span className="text-xl font-black uppercase tracking-wider">{type.id}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Bet Amount */}
                    {step === 2 && (
                        <div className="w-full animate-in slide-in-from-bottom fade-in duration-300 flex flex-col items-center">
                            <h3 className="text-3xl font-black text-blue-900 uppercase mb-8 text-center bg-yellow-300 px-6 py-2 border-4 border-blue-900 shadow-[4px_4px_0px_0px_rgba(30,58,138,1)] transform rotate-1">
                                Stars at Stake
                            </h3>
                            
                            <div className="flex items-center gap-6 bg-white p-6 border-4 border-blue-900 shadow-[8px_8px_0px_0px_rgba(30,58,138,1)] mb-10">
                                <button 
                                    onClick={() => setBetAmount(Math.max(1, betAmount - 1))}
                                    className="bg-red-500 text-white w-16 h-16 flex items-center justify-center font-black text-4xl border-4 border-blue-900 active:translate-y-1 hover:bg-red-400 transition-all shadow-[4px_4px_0px_0px_rgba(30,58,138,1)] active:shadow-none"
                                >
                                    -
                                </button>
                                
                                <div className="flex flex-col items-center">
                                    <span className="text-6xl font-black text-blue-900 font-mono animate-pulse">{betAmount}</span>
                                    <span className="text-yellow-500 font-black uppercase tracking-widest text-lg">Stars</span>
                                </div>
                                
                                <button 
                                    onClick={() => setBetAmount(betAmount + 1)}
                                    className="bg-green-500 text-white w-16 h-16 flex items-center justify-center font-black text-4xl border-4 border-blue-900 active:translate-y-1 hover:bg-green-400 transition-all shadow-[4px_4px_0px_0px_rgba(30,58,138,1)] active:shadow-none"
                                >
                                    +
                                </button>
                            </div>

                            <button 
                                onClick={nextStep}
                                className="px-10 py-3 bg-blue-600 text-white font-black uppercase text-xl tracking-wider border-4 border-blue-900 shadow-[6px_6px_0px_0px_rgba(30,58,138,1)] hover:bg-blue-500 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(30,58,138,1)] active:translate-y-1 active:shadow-none transition-all"
                            >
                                Next Step
                            </button>
                        </div>
                    )}

                    {/* Step 3: VS and Winner */}
                    {step === 3 && (
                        <div className="w-full animate-in zoom-in fade-in duration-300 flex flex-col items-center relative h-full justify-between">
                            
                            <div className="w-full flex justify-between items-center relative mt-4">
                                {/* Challenger */}
                                <div className="w-[40%]">
                                    <label className="block text-center font-black text-red-600 uppercase tracking-widest mb-2 text-xl drop-shadow-sm">Challenger</label>
                                    <select 
                                        value={challengerId}
                                        onChange={(e) => {
                                            setChallengerId(e.target.value);
                                            if (e.target.value === challengedId) setChallengedId('');
                                            setWinnerId('');
                                        }}
                                        className="w-full p-4 border-4 border-blue-900 bg-red-100 text-blue-900 font-bold text-lg focus:outline-none shadow-[4px_4px_0px_0px_rgba(30,58,138,1)]"
                                    >
                                        <option value="" disabled>Select...</option>
                                        {students.map(s => (
                                            <option key={s.id} value={s.id}>{s.name} (★{s.points})</option>
                                        ))}
                                    </select>
                                </div>

                                {/* VS Badge */}
                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 animate-wobble">
                                    <div className="bg-yellow-400 text-blue-900 font-black italic text-4xl p-4 border-4 border-blue-900 rounded-full shadow-[6px_6px_0px_0px_rgba(30,58,138,1)] flex items-center justify-center w-24 h-24 transform -rotate-12">
                                        VS
                                    </div>
                                </div>

                                {/* Challenged */}
                                <div className="w-[40%] text-right">
                                    <label className="block text-center font-black text-blue-600 uppercase tracking-widest mb-2 text-xl drop-shadow-sm">Challenged</label>
                                    <select 
                                        value={challengedId}
                                        onChange={(e) => {
                                            setChallengedId(e.target.value);
                                            if (e.target.value === challengerId) setChallengerId('');
                                            setWinnerId('');
                                        }}
                                        className="w-full p-4 border-4 border-blue-900 bg-blue-100 text-blue-900 font-bold text-lg focus:outline-none shadow-[4px_4px_0px_0px_rgba(30,58,138,1)] text-right"
                                    >
                                        <option value="" disabled>Select...</option>
                                        {students.map(s => (
                                            <option key={s.id} value={s.id} disabled={s.id === challengerId}>{s.name} (★{s.points})</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Winner Selection */}
                            <div className={`mt-12 w-full transition-all duration-500 ${challengerId && challengedId ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
                                <h4 className="text-center font-black text-2xl text-blue-900 uppercase tracking-widest mb-6">Who won the {betAmount} stars?</h4>
                                
                                <div className="flex gap-6 w-full justify-center">
                                    <button
                                        onClick={() => setWinnerId(challengerId)}
                                        className={`flex-1 py-4 px-4 border-4 border-blue-900 font-black text-xl uppercase transition-all flex flex-col items-center gap-2 max-w-[200px] ${
                                            winnerId === challengerId 
                                            ? 'bg-green-400 text-white shadow-[inset_0_-6px_0_rgba(0,0,0,0.2)] scale-110 -translate-y-4' 
                                            : 'bg-white text-blue-900 hover:bg-gray-50 shadow-[6px_6px_0px_0px_rgba(30,58,138,1)]'
                                        }`}
                                    >
                                        {winnerId === challengerId && <Trophy size={32} className="text-yellow-300 animate-bounce" />}
                                        <span className="truncate w-full text-center">
                                            {students.find(s => s.id === challengerId)?.name || 'Challenger'}
                                        </span>
                                    </button>
                                    
                                    <button
                                        onClick={() => setWinnerId(challengedId)}
                                        className={`flex-1 py-4 px-4 border-4 border-blue-900 font-black text-xl uppercase transition-all flex flex-col items-center gap-2 max-w-[200px] ${
                                            winnerId === challengedId 
                                            ? 'bg-green-400 text-white shadow-[inset_0_-6px_0_rgba(0,0,0,0.2)] scale-110 -translate-y-4' 
                                            : 'bg-white text-blue-900 hover:bg-gray-50 shadow-[6px_6px_0px_0px_rgba(30,58,138,1)]'
                                        }`}
                                    >
                                        {winnerId === challengedId && <Trophy size={32} className="text-yellow-300 animate-bounce" />}
                                        <span className="truncate w-full text-center">
                                            {students.find(s => s.id === challengedId)?.name || 'Challenged'}
                                        </span>
                                    </button>
                                </div>

                                <div className="mt-10 flex justify-center">
                                    <button 
                                        onClick={handleTransfer}
                                        disabled={!winnerId}
                                        className="px-10 py-4 bg-yellow-400 text-blue-900 font-black text-2xl uppercase tracking-widest border-4 border-blue-900 shadow-[8px_8px_0px_0px_rgba(30,58,138,1)] hover:bg-yellow-300 hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_rgba(30,58,138,1)] active:translate-y-1 active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[8px_8px_0px_0px_rgba(30,58,138,1)]"
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StarChallengeModal;
