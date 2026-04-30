import React, { useState, useEffect, useRef } from 'react';
import { X, Swords, Trophy, BookOpen, PenTool, Mic, Type, CloudSnow, ArrowLeft, Play, Pause, RotateCcw, AlertTriangle, Check } from 'lucide-react';
import { playWinnerSound } from './StudentCard';

const playAlarmSound = () => {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const playNote = (freq, start, duration) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'square';
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.1, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(start);
            osc.stop(start + duration);
        };
        const now = ctx.currentTime;
        playNote(880, now, 0.2);
        playNote(440, now + 0.25, 0.2);
        playNote(880, now + 0.5, 0.2);
        playNote(440, now + 0.75, 0.2);
        playNote(880, now + 1.0, 0.4);
    } catch (e) {}
};

const StarChallengeModal = ({ isOpen, onClose, students, onTransfer, onUpdatePoints }) => {
    // Shared
    const [step, setStep] = useState(0);
    const [mode, setMode] = useState(null); // 'duel' | 'blizzard'

    // Duel state
    const [challengeType, setChallengeType] = useState('');
    const [betAmount, setBetAmount] = useState(5);
    const [challengerId, setChallengerId] = useState('');
    const [challengedId, setChallengedId] = useState('');
    const [winnerId, setWinnerId] = useState('');

    // Blizzard state
    const [blizzardStake, setBlizzardStake] = useState(1);
    const [blizzardDuration, setBlizzardDuration] = useState(30); // seconds
    const [blizzardParticipants, setBlizzardParticipants] = useState([]); // student ids
    const [blizzardTimeLeft, setBlizzardTimeLeft] = useState(null);
    const [blizzardRunning, setBlizzardRunning] = useState(false);
    const [blizzardWinnerId, setBlizzardWinnerId] = useState(null);
    const [blizzardOutcome, setBlizzardOutcome] = useState(null); // 'won' | 'timeout' | null
    const blizzardIntervalRef = useRef(null);

    // Reset on open
    useEffect(() => {
        if (isOpen) {
            setStep(0);
            setMode(null);
            setChallengeType('');
            setBetAmount(5);
            setChallengerId('');
            setChallengedId('');
            setWinnerId('');
            setBlizzardStake(1);
            setBlizzardDuration(30);
            setBlizzardParticipants([]);
            setBlizzardTimeLeft(null);
            setBlizzardRunning(false);
            setBlizzardWinnerId(null);
            setBlizzardOutcome(null);
        }
    }, [isOpen]);

    // Blizzard countdown effect
    useEffect(() => {
        if (!blizzardRunning) {
            clearInterval(blizzardIntervalRef.current);
            return;
        }
        blizzardIntervalRef.current = setInterval(() => {
            setBlizzardTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(blizzardIntervalRef.current);
                    setBlizzardRunning(false);
                    setBlizzardOutcome('timeout');
                    playAlarmSound();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(blizzardIntervalRef.current);
    }, [blizzardRunning]);

    if (!isOpen) return null;

    const nextStep = () => setStep(s => s + 1);

    const types = [
        { id: 'Vocab',    icon: BookOpen, color: 'bg-blue-500'   },
        { id: 'Grammar',  icon: PenTool,  color: 'bg-green-500'  },
        { id: 'Spelling', icon: Type,     color: 'bg-purple-500' },
        { id: 'Speaking', icon: Mic,      color: 'bg-orange-500' },
    ];

    // ── Duel handlers ──
    const handleDuelTransfer = () => {
        if (!challengerId || !challengedId || !winnerId) return;
        const loserId = winnerId === challengerId ? challengedId : challengerId;
        onTransfer(loserId, winnerId, betAmount);
        playWinnerSound();
        onClose();
    };

    // ── Blizzard handlers ──
    const toggleParticipant = (id) => {
        setBlizzardParticipants(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const startBlizzard = () => {
        setBlizzardTimeLeft(blizzardDuration);
        setBlizzardWinnerId(null);
        setBlizzardOutcome(null);
        setBlizzardRunning(true);
        setStep(3); // live screen
    };

    const declareWinner = (id) => {
        setBlizzardRunning(false);
        clearInterval(blizzardIntervalRef.current);
        setBlizzardWinnerId(id);
        setBlizzardOutcome('won');
    };

    const cancelBlizzard = () => {
        setBlizzardRunning(false);
        clearInterval(blizzardIntervalRef.current);
        setStep(2); // back to setup
    };

    const confirmBlizzard = () => {
        if (blizzardOutcome === 'won' && blizzardWinnerId) {
            onUpdatePoints(blizzardWinnerId, blizzardStake);
            playWinnerSound();
        } else if (blizzardOutcome === 'timeout') {
            blizzardParticipants.forEach(id => onUpdatePoints(id, -blizzardStake));
        }
        onClose();
    };

    const goBackToModePicker = () => {
        setStep(1);
        setMode(null);
    };

    // ── Header title ──
    let headerTitle = 'Star Challenge';
    if (mode === 'duel' && step >= 2) {
        headerTitle = `Duel: ${challengeType || '...'}${betAmount ? ` (★ ${betAmount})` : ''}`;
    } else if (mode === 'blizzard' && step >= 2) {
        headerTitle = `Blizzard ❄ (★ ${blizzardStake})`;
    }

    const blizzardMin = Math.floor((blizzardTimeLeft ?? blizzardDuration) / 60);
    const blizzardSec = (blizzardTimeLeft ?? blizzardDuration) % 60;
    const blizzardProgress = blizzardTimeLeft !== null && blizzardDuration > 0
        ? blizzardTimeLeft / blizzardDuration : 1;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-900/80 backdrop-blur-md transition-opacity">
            <div className="bg-white w-full max-w-2xl border-4 border-blue-900 shadow-[12px_12px_0px_0px_rgba(0,0,0,0.4)] flex flex-col min-h-[400px] max-h-[90vh] overflow-hidden relative">

                {/* Header (hidden in Intro) */}
                {step > 0 && (
                    <div className="bg-yellow-400 border-b-4 border-blue-900 p-4 flex justify-between items-center relative animate-in slide-in-from-top duration-300 z-20 shrink-0">
                        <div className="flex items-center gap-2">
                            {step > 1 && mode && (
                                <button
                                    onClick={goBackToModePicker}
                                    className="text-blue-900 bg-white border-2 border-blue-900 p-1 rounded-sm shadow-[2px_2px_0px_0px_rgba(30,58,138,1)] hover:bg-gray-50 active:translate-y-1 active:shadow-none mr-2"
                                    title="Change Challenge Type"
                                >
                                    <ArrowLeft size={16} strokeWidth={3} />
                                </button>
                            )}
                            {mode === 'blizzard' ? <CloudSnow className="text-blue-900" size={24} /> : <Swords className="text-blue-900" size={24} />}
                            <h2 className="text-xl font-black text-blue-900 font-mono uppercase truncate">
                                {headerTitle}
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-blue-900 hover:text-red-600 bg-white border-2 border-blue-900 p-1 rounded-sm shadow-[2px_2px_0px_0px_rgba(30,58,138,1)] active:translate-y-1 active:shadow-none shrink-0"
                        >
                            <X size={20} strokeWidth={3} />
                        </button>
                    </div>
                )}

                {/* Content */}
                <div className="flex-grow flex items-center justify-center p-6 bg-slate-50 relative overflow-y-auto">

                    {/* ── Step 0: Intro ── */}
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

                    {/* ── Step 1: Mode picker (Duels vs Blizzard) ── */}
                    {step === 1 && (
                        <div className="w-full animate-in slide-in-from-right fade-in duration-300 flex flex-col items-center">
                            <h3 className="text-3xl font-black text-blue-900 uppercase mb-8 text-center bg-yellow-300 px-6 py-2 border-4 border-blue-900 shadow-[4px_4px_0px_0px_rgba(30,58,138,1)] transform -rotate-2">
                                Choose Challenge Type
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-xl">
                                <button
                                    onClick={() => { setMode('duel'); setStep(2); }}
                                    className="bg-red-500 text-white p-6 border-4 border-blue-900 shadow-[6px_6px_0px_0px_rgba(30,58,138,1)] flex flex-col items-center gap-3 hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(30,58,138,1)] active:translate-y-0 active:shadow-none transition-all group"
                                >
                                    <Swords size={56} className="group-hover:animate-tweak" strokeWidth={1.8} />
                                    <span className="text-2xl font-black uppercase tracking-wider font-mono">Duels</span>
                                    <span className="text-[11px] uppercase tracking-wider opacity-90 text-center leading-snug">
                                        1 vs 1 — winner steals stars from loser
                                    </span>
                                </button>
                                <button
                                    onClick={() => { setMode('blizzard'); setStep(2); }}
                                    className="bg-blue-500 text-white p-6 border-4 border-blue-900 shadow-[6px_6px_0px_0px_rgba(30,58,138,1)] flex flex-col items-center gap-3 hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(30,58,138,1)] active:translate-y-0 active:shadow-none transition-all group"
                                >
                                    <CloudSnow size={56} className="group-hover:animate-tweak" strokeWidth={1.8} />
                                    <span className="text-2xl font-black uppercase tracking-wider font-mono">Countdown Blizzard</span>
                                    <span className="text-[11px] uppercase tracking-wider opacity-90 text-center leading-snug">
                                        Beat the clock — answer first, or lose a star
                                    </span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ──────────────────────────────────────────────────── */}
                    {/* DUEL FLOW                                           */}
                    {/* ──────────────────────────────────────────────────── */}

                    {/* Duel Step 2: Challenge Type */}
                    {mode === 'duel' && step === 2 && (
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

                    {/* Duel Step 3: Bet Amount */}
                    {mode === 'duel' && step === 3 && (
                        <div className="w-full animate-in slide-in-from-bottom fade-in duration-300 flex flex-col items-center">
                            <h3 className="text-3xl font-black text-blue-900 uppercase mb-8 text-center bg-yellow-300 px-6 py-2 border-4 border-blue-900 shadow-[4px_4px_0px_0px_rgba(30,58,138,1)] transform rotate-1">
                                Stars at Stake
                            </h3>

                            <div className="flex items-center gap-6 bg-white p-6 border-4 border-blue-900 shadow-[8px_8px_0px_0px_rgba(30,58,138,1)] mb-10">
                                <button
                                    onClick={() => setBetAmount(Math.max(1, betAmount - 1))}
                                    className="bg-red-500 text-white w-16 h-16 flex items-center justify-center font-black text-4xl border-4 border-blue-900 active:translate-y-1 hover:bg-red-400 transition-all shadow-[4px_4px_0px_0px_rgba(30,58,138,1)] active:shadow-none"
                                >−</button>
                                <div className="flex flex-col items-center">
                                    <span className="text-6xl font-black text-blue-900 font-mono animate-pulse">{betAmount}</span>
                                    <span className="text-yellow-500 font-black uppercase tracking-widest text-lg">Stars</span>
                                </div>
                                <button
                                    onClick={() => setBetAmount(betAmount + 1)}
                                    className="bg-green-500 text-white w-16 h-16 flex items-center justify-center font-black text-4xl border-4 border-blue-900 active:translate-y-1 hover:bg-green-400 transition-all shadow-[4px_4px_0px_0px_rgba(30,58,138,1)] active:shadow-none"
                                >+</button>
                            </div>

                            <button
                                onClick={nextStep}
                                className="px-10 py-3 bg-blue-600 text-white font-black uppercase text-xl tracking-wider border-4 border-blue-900 shadow-[6px_6px_0px_0px_rgba(30,58,138,1)] hover:bg-blue-500 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(30,58,138,1)] active:translate-y-1 active:shadow-none transition-all"
                            >
                                Next Step
                            </button>
                        </div>
                    )}

                    {/* Duel Step 4: Fighters & Winner */}
                    {mode === 'duel' && step === 4 && (
                        <div className="w-full animate-in zoom-in fade-in duration-300 flex flex-col items-center relative h-full justify-between">
                            <div className="w-full flex justify-between items-center relative mt-4">
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

                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 animate-wobble">
                                    <div className="bg-yellow-400 text-blue-900 font-black italic text-4xl p-4 border-4 border-blue-900 rounded-full shadow-[6px_6px_0px_0px_rgba(30,58,138,1)] flex items-center justify-center w-24 h-24 transform -rotate-12">
                                        VS
                                    </div>
                                </div>

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
                                        onClick={handleDuelTransfer}
                                        disabled={!winnerId}
                                        className="px-10 py-4 bg-yellow-400 text-blue-900 font-black text-2xl uppercase tracking-widest border-4 border-blue-900 shadow-[8px_8px_0px_0px_rgba(30,58,138,1)] hover:bg-yellow-300 hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_rgba(30,58,138,1)] active:translate-y-1 active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[8px_8px_0px_0px_rgba(30,58,138,1)]"
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ──────────────────────────────────────────────────── */}
                    {/* BLIZZARD FLOW                                       */}
                    {/* ──────────────────────────────────────────────────── */}

                    {/* Blizzard Step 2: Setup */}
                    {mode === 'blizzard' && step === 2 && (
                        <div className="w-full animate-in slide-in-from-right fade-in duration-300 flex flex-col items-center gap-5">
                            <h3 className="text-3xl font-black text-blue-900 uppercase text-center bg-yellow-300 px-6 py-2 border-4 border-blue-900 shadow-[4px_4px_0px_0px_rgba(30,58,138,1)] transform -rotate-1">
                                Blizzard Setup
                            </h3>

                            {/* Stars at stake */}
                            <div className="flex flex-col items-center gap-2 bg-white border-4 border-blue-900 p-3 shadow-[4px_4px_0px_0px_rgba(30,58,138,1)] w-full max-w-md">
                                <span className="text-[11px] font-black uppercase tracking-widest text-blue-900">Stars at stake</span>
                                <div className="flex items-center gap-3">
                                    <button onClick={() => setBlizzardStake(s => Math.max(1, s - 1))}
                                        className="bg-red-500 text-white w-10 h-10 flex items-center justify-center font-black text-2xl border-4 border-blue-900 active:translate-y-1 active:shadow-none shadow-[3px_3px_0px_0px_rgba(30,58,138,1)] hover:bg-red-400 transition-all">−</button>
                                    <span className="w-14 text-center text-3xl font-black text-blue-900 font-mono">{blizzardStake}</span>
                                    <button onClick={() => setBlizzardStake(s => s + 1)}
                                        className="bg-green-500 text-white w-10 h-10 flex items-center justify-center font-black text-2xl border-4 border-blue-900 active:translate-y-1 active:shadow-none shadow-[3px_3px_0px_0px_rgba(30,58,138,1)] hover:bg-green-400 transition-all">+</button>
                                </div>
                            </div>

                            {/* Duration presets */}
                            <div className="flex flex-col items-center gap-2 bg-white border-4 border-blue-900 p-3 shadow-[4px_4px_0px_0px_rgba(30,58,138,1)] w-full max-w-md">
                                <span className="text-[11px] font-black uppercase tracking-widest text-blue-900">Countdown</span>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {[10, 30, 60, 120].map(s => (
                                        <button
                                            key={s}
                                            onClick={() => setBlizzardDuration(s)}
                                            className={`px-3 py-1.5 border-4 border-blue-900 font-black uppercase text-xs tracking-wider transition-all ${
                                                blizzardDuration === s
                                                    ? 'bg-yellow-400 text-blue-900 shadow-[inset_0_-3px_0_rgba(0,0,0,0.2)]'
                                                    : 'bg-white text-blue-900 shadow-[3px_3px_0px_0px_rgba(30,58,138,1)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none'
                                            }`}
                                        >
                                            {s < 60 ? `${s}s` : `${s / 60}m`}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Participants */}
                            <div className="flex flex-col items-center gap-2 bg-white border-4 border-blue-900 p-3 shadow-[4px_4px_0px_0px_rgba(30,58,138,1)] w-full max-w-md">
                                <div className="flex items-center justify-between w-full">
                                    <span className="text-[11px] font-black uppercase tracking-widest text-blue-900">Participants ({blizzardParticipants.length})</span>
                                    <div className="flex gap-1">
                                        <button onClick={() => setBlizzardParticipants(students.map(s => s.id))}
                                            className="text-[10px] font-black uppercase tracking-widest text-blue-900 bg-blue-100 border-2 border-blue-900 px-2 py-0.5 hover:bg-blue-200">All</button>
                                        <button onClick={() => setBlizzardParticipants([])}
                                            className="text-[10px] font-black uppercase tracking-widest text-blue-900 bg-blue-100 border-2 border-blue-900 px-2 py-0.5 hover:bg-blue-200">None</button>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 justify-center w-full max-h-40 overflow-y-auto p-1">
                                    {students.length === 0 && (
                                        <p className="text-gray-500 text-sm font-mono py-2">No students.</p>
                                    )}
                                    {students.map(s => {
                                        const selected = blizzardParticipants.includes(s.id);
                                        return (
                                            <button
                                                key={s.id}
                                                onClick={() => toggleParticipant(s.id)}
                                                className={`px-3 py-1 border-4 border-blue-900 font-black uppercase text-xs tracking-wider transition-all ${
                                                    selected
                                                        ? 'bg-blue-500 text-white shadow-[inset_0_-3px_0_rgba(0,0,0,0.2)]'
                                                        : 'bg-white text-blue-900 shadow-[3px_3px_0px_0px_rgba(30,58,138,1)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none'
                                                }`}
                                            >
                                                {selected && <Check size={12} className="inline mr-1" />}
                                                {s.name}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <button
                                onClick={startBlizzard}
                                disabled={blizzardParticipants.length === 0}
                                className="px-10 py-3 bg-red-600 text-white font-black uppercase text-xl tracking-widest border-4 border-blue-900 shadow-[8px_8px_0px_0px_rgba(30,58,138,1)] hover:bg-red-500 hover:-translate-y-2 hover:shadow-[10px_10px_0px_0px_rgba(30,58,138,1)] active:translate-y-1 active:shadow-none transition-all disabled:opacity-50 disabled:hover:translate-y-0 flex items-center gap-2"
                            >
                                <Play size={20} strokeWidth={3} /> Start Blizzard
                            </button>
                        </div>
                    )}

                    {/* Blizzard Step 3: Live */}
                    {mode === 'blizzard' && step === 3 && (
                        <div className="w-full animate-in zoom-in fade-in duration-300 flex flex-col items-center gap-5">

                            {/* Big timer */}
                            <div className={`bg-white border-4 border-blue-900 shadow-[8px_8px_0px_0px_rgba(30,58,138,1)] px-10 py-4 ${blizzardOutcome === 'timeout' ? 'animate-pulse' : ''}`}>
                                <div className={`text-7xl font-black font-mono tabular-nums leading-none text-center ${blizzardOutcome === 'timeout' ? 'text-red-500' : blizzardProgress > 0.3 ? 'text-blue-900' : 'text-yellow-600'}`}>
                                    {String(blizzardMin).padStart(2, '0')}
                                    <span className="text-yellow-500 mx-2">:</span>
                                    {String(blizzardSec).padStart(2, '0')}
                                </div>
                            </div>

                            {/* Progress bar */}
                            <div className="w-full max-w-md bg-white border-4 border-blue-900 h-5 shadow-[4px_4px_0px_0px_rgba(30,58,138,1)] overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-1000 ${blizzardOutcome === 'timeout' ? 'bg-red-500' : blizzardProgress > 0.3 ? 'bg-green-500' : 'bg-yellow-500'}`}
                                    style={{ width: `${blizzardProgress * 100}%` }}
                                />
                            </div>

                            {/* Status / instructions */}
                            {blizzardOutcome === null && (
                                <p className="text-blue-900 font-black uppercase tracking-widest text-sm text-center">
                                    Tap a name when they answer correctly
                                </p>
                            )}

                            {blizzardOutcome === 'won' && blizzardWinnerId && (
                                <div className="bg-green-400 border-4 border-blue-900 shadow-[6px_6px_0px_0px_rgba(30,58,138,1)] px-6 py-3 flex items-center gap-3">
                                    <Trophy size={28} className="text-yellow-200 animate-bounce" />
                                    <p className="font-black text-white uppercase tracking-widest text-lg">
                                        {students.find(s => s.id === blizzardWinnerId)?.name} wins +{blizzardStake} ★
                                    </p>
                                </div>
                            )}

                            {blizzardOutcome === 'timeout' && (
                                <div className="bg-red-500 border-4 border-blue-900 shadow-[6px_6px_0px_0px_rgba(30,58,138,1)] px-6 py-3 flex items-center gap-3">
                                    <AlertTriangle size={28} className="text-yellow-200" />
                                    <p className="font-black text-white uppercase tracking-widest text-sm text-center">
                                        Time's up! Each participant loses {blizzardStake} ★
                                    </p>
                                </div>
                            )}

                            {/* Participant buttons */}
                            <div className="flex flex-wrap gap-2 justify-center w-full max-w-lg">
                                {blizzardParticipants.map(id => {
                                    const s = students.find(st => st.id === id);
                                    if (!s) return null;
                                    const isWinner = blizzardWinnerId === id;
                                    const disabled = blizzardOutcome !== null;
                                    return (
                                        <button
                                            key={id}
                                            onClick={() => declareWinner(id)}
                                            disabled={disabled && !isWinner}
                                            className={`px-4 py-2 border-4 border-blue-900 font-black uppercase text-sm tracking-wider transition-all ${
                                                isWinner
                                                    ? 'bg-green-400 text-white shadow-[inset_0_-4px_0_rgba(0,0,0,0.2)] scale-110'
                                                    : disabled
                                                        ? 'bg-gray-200 text-gray-500 opacity-60'
                                                        : 'bg-white text-blue-900 shadow-[4px_4px_0px_0px_rgba(30,58,138,1)] hover:bg-yellow-100 hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none'
                                            }`}
                                        >
                                            {isWinner && <Trophy size={14} className="inline mr-1 text-yellow-300" />}
                                            {s.name}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Action buttons */}
                            <div className="flex gap-3 mt-2">
                                {blizzardOutcome === null ? (
                                    <button
                                        onClick={cancelBlizzard}
                                        className="px-5 py-2 bg-gray-200 text-gray-700 font-black uppercase text-xs tracking-widest border-4 border-blue-900 shadow-[4px_4px_0px_0px_rgba(30,58,138,1)] hover:bg-gray-300 active:translate-y-1 active:shadow-none transition-all flex items-center gap-2"
                                    >
                                        <RotateCcw size={14} strokeWidth={3} /> Cancel
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={cancelBlizzard}
                                            className="px-5 py-2 bg-gray-200 text-gray-700 font-black uppercase text-xs tracking-widest border-4 border-blue-900 shadow-[4px_4px_0px_0px_rgba(30,58,138,1)] hover:bg-gray-300 active:translate-y-1 active:shadow-none transition-all flex items-center gap-2"
                                        >
                                            Discard
                                        </button>
                                        <button
                                            onClick={confirmBlizzard}
                                            className="px-8 py-2 bg-yellow-400 text-blue-900 font-black uppercase text-base tracking-widest border-4 border-blue-900 shadow-[6px_6px_0px_0px_rgba(30,58,138,1)] hover:bg-yellow-300 hover:-translate-y-1 active:translate-y-1 active:shadow-none transition-all"
                                        >
                                            Apply Result
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default StarChallengeModal;
