import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, RotateCcw, Shuffle, Wrench, Timer as TimerIcon, Users, Dices, ArrowLeft } from 'lucide-react';

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
            gain.gain.setValueAtTime(0.08, start);
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

const QUICK_TIMES = [
    { label: '1 min', s: 60 },
    { label: '2 min', s: 120 },
    { label: '5 min', s: 300 },
    { label: '10 min', s: 600 },
];

// Arcade press button
const ArcadeBtn = ({ children, onClick, disabled, color = 'blue', size = 'md', className = '' }) => {
    const palette = {
        blue:   'bg-blue-600 text-white border-blue-900 hover:bg-blue-500',
        red:    'bg-red-500 text-white border-blue-900 hover:bg-red-400',
        green:  'bg-green-500 text-white border-blue-900 hover:bg-green-400',
        yellow: 'bg-yellow-400 text-blue-900 border-blue-900 hover:bg-yellow-300',
        gray:   'bg-white text-blue-900 border-blue-900 hover:bg-gray-50',
    }[color];
    const sizes = {
        sm: 'px-4 py-2 text-xs shadow-[4px_4px_0px_0px_rgba(30,58,138,1)] hover:shadow-[5px_5px_0px_0px_rgba(30,58,138,1)]',
        md: 'px-6 py-3 text-sm shadow-[6px_6px_0px_0px_rgba(30,58,138,1)] hover:shadow-[8px_8px_0px_0px_rgba(30,58,138,1)]',
        lg: 'px-8 py-4 text-lg shadow-[8px_8px_0px_0px_rgba(30,58,138,1)] hover:shadow-[10px_10px_0px_0px_rgba(30,58,138,1)]',
    }[size];
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${palette} ${sizes} border-4 font-black uppercase tracking-widest flex items-center gap-2 hover:-translate-y-1 active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:hover:translate-y-0 transition-all ${className}`}
        >
            {children}
        </button>
    );
};

// Big square +/- button
const SquareBtn = ({ children, onClick, color = 'red' }) => {
    const palette = {
        red:   'bg-red-500 hover:bg-red-400',
        green: 'bg-green-500 hover:bg-green-400',
    }[color];
    return (
        <button
            onClick={onClick}
            className={`${palette} text-white w-12 h-12 flex items-center justify-center font-black text-3xl border-4 border-blue-900 shadow-[4px_4px_0px_0px_rgba(30,58,138,1)] active:translate-y-1 active:shadow-none transition-all`}
        >
            {children}
        </button>
    );
};

const ToolkitModal = ({ isOpen, onClose, students }) => {
    const [selectedTool, setSelectedTool] = useState(null);

    // ── Timer state ──
    const [inputMin, setInputMin] = useState(5);
    const [inputSec, setInputSec] = useState(0);
    const [timeLeft, setTimeLeft] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const totalRef = useRef(0);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (!isRunning) {
            clearInterval(intervalRef.current);
            return;
        }
        intervalRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(intervalRef.current);
                    setIsRunning(false);
                    playAlarmSound();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(intervalRef.current);
    }, [isRunning]);

    const startTimer = () => {
        if (timeLeft === null) {
            const total = inputMin * 60 + inputSec;
            if (total === 0) return;
            totalRef.current = total;
            setTimeLeft(total);
        }
        setIsRunning(true);
    };
    const pauseTimer = () => setIsRunning(false);
    const resetTimer = () => {
        setIsRunning(false);
        clearInterval(intervalRef.current);
        setTimeLeft(null);
    };
    const setQuickTime = (seconds) => {
        resetTimer();
        setInputMin(Math.floor(seconds / 60));
        setInputSec(seconds % 60);
    };

    const display = timeLeft !== null ? timeLeft : (inputMin * 60 + inputSec);
    const displayMin = Math.floor(display / 60);
    const displaySec = display % 60;
    const progress = (timeLeft !== null && totalRef.current > 0) ? timeLeft / totalRef.current : 1;
    const isFinished = timeLeft === 0;

    // ── Groups state ──
    const [groupSize, setGroupSize] = useState(3);
    const [generatedGroups, setGeneratedGroups] = useState([]);
    const generateGroups = () => {
        const shuffled = [...students].sort(() => Math.random() - 0.5);
        const groups = [];
        for (let i = 0; i < shuffled.length; i += groupSize) {
            groups.push(shuffled.slice(i, i + groupSize));
        }
        setGeneratedGroups(groups);
    };

    // ── Picker state ──
    const [pickCount, setPickCount] = useState(1);
    const [picked, setPicked] = useState([]);
    const [rolling, setRolling] = useState(false);
    const [rollingName, setRollingName] = useState('');
    const pickRandom = () => {
        if (students.length === 0 || rolling) return;
        setRolling(true);
        setPicked([]);
        let ticks = 0;
        const maxTicks = 20;
        const rollInterval = setInterval(() => {
            setRollingName(students[Math.floor(Math.random() * students.length)].name);
            ticks++;
            if (ticks >= maxTicks) {
                clearInterval(rollInterval);
                const shuffled = [...students].sort(() => Math.random() - 0.5);
                setPicked(shuffled.slice(0, Math.min(pickCount, students.length)));
                setRollingName('');
                setRolling(false);
            }
        }, 80);
    };

    if (!isOpen) return null;

    const tools = [
        {
            id: 'timer',
            label: 'Timer',
            desc: 'Countdown for any classroom activity',
            icon: TimerIcon,
            color: 'bg-red-500',
        },
        {
            id: 'groups',
            label: 'Group Maker',
            desc: 'Split students into random teams',
            icon: Users,
            color: 'bg-green-500',
        },
        {
            id: 'picker',
            label: 'Random Picker',
            desc: 'Pick one or more students at random',
            icon: Dices,
            color: 'bg-blue-600',
        },
    ];

    const currentTool = tools.find(t => t.id === selectedTool);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-900/80 backdrop-blur-md animate-in fade-in duration-150"
            onClick={e => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-white w-full max-w-2xl border-4 border-blue-900 shadow-[12px_12px_0px_0px_rgba(0,0,0,0.4)] flex flex-col overflow-hidden max-h-[90vh] animate-in zoom-in-95 slide-in-from-bottom-4 duration-200">

                {/* Header */}
                <div className="bg-yellow-400 border-b-4 border-blue-900 p-4 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        {selectedTool && (
                            <button
                                onClick={() => setSelectedTool(null)}
                                className="bg-white text-blue-900 border-2 border-blue-900 p-1.5 rounded-sm shadow-[2px_2px_0px_0px_rgba(30,58,138,1)] hover:bg-gray-50 active:translate-y-1 active:shadow-none transition-all"
                                title="Back to Toolkit"
                            >
                                <ArrowLeft size={18} strokeWidth={3} />
                            </button>
                        )}
                        {selectedTool ? (
                            <>
                                {currentTool && <currentTool.icon className="text-blue-900" size={26} strokeWidth={2.5} />}
                                <h2 className="text-2xl font-black text-blue-900 font-mono uppercase tracking-wider">
                                    {currentTool?.label}
                                </h2>
                            </>
                        ) : (
                            <>
                                <Wrench className="text-blue-900" size={28} strokeWidth={2.5} />
                                <h2 className="text-2xl font-black text-blue-900 font-mono uppercase tracking-wider">Toolkit</h2>
                            </>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="text-blue-900 hover:text-red-600 bg-white border-2 border-blue-900 p-1 rounded-sm shadow-[2px_2px_0px_0px_rgba(30,58,138,1)] active:translate-y-1 active:shadow-none"
                    >
                        <X size={20} strokeWidth={3} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50">

                    {/* ── LANDING / TOOL PICKER ── */}
                    {!selectedTool && (
                        <div className="flex flex-col items-center gap-6 animate-in fade-in duration-200">
                            <h3 className="text-2xl font-black text-blue-900 uppercase bg-yellow-300 px-5 py-2 border-4 border-blue-900 shadow-[4px_4px_0px_0px_rgba(30,58,138,1)] transform -rotate-1">
                                Pick a Tool
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                                {tools.map(tool => {
                                    const Icon = tool.icon;
                                    return (
                                        <button
                                            key={tool.id}
                                            onClick={() => setSelectedTool(tool.id)}
                                            className={`${tool.color} text-white p-5 border-4 border-blue-900 shadow-[6px_6px_0px_0px_rgba(30,58,138,1)] flex flex-col items-center gap-3 hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(30,58,138,1)] active:translate-y-0 active:shadow-none transition-all group`}
                                        >
                                            <Icon size={48} strokeWidth={2} className="group-hover:animate-tweak" />
                                            <span className="text-lg font-black uppercase tracking-wider font-mono">{tool.label}</span>
                                            <span className="text-[10px] uppercase tracking-wider opacity-90 text-center leading-tight">
                                                {tool.desc}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* ── TIMER ── */}
                    {selectedTool === 'timer' && (
                        <div className="flex flex-col items-center gap-6 animate-in fade-in duration-200">

                            {/* Quick presets */}
                            <div className="flex flex-wrap gap-2 justify-center">
                                {QUICK_TIMES.map(q => (
                                    <button
                                        key={q.label}
                                        onClick={() => setQuickTime(q.s)}
                                        className="bg-white text-blue-900 px-3 py-1.5 border-4 border-blue-900 font-black uppercase text-xs tracking-wider shadow-[3px_3px_0px_0px_rgba(30,58,138,1)] hover:bg-yellow-100 hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                                    >
                                        {q.label}
                                    </button>
                                ))}
                            </div>

                            {/* Big timer display */}
                            <div className="bg-white border-4 border-blue-900 shadow-[8px_8px_0px_0px_rgba(30,58,138,1)] px-10 py-6">
                                <div className={`text-7xl font-black font-mono tabular-nums leading-none select-none text-center ${isFinished ? 'text-red-500 animate-pulse' : 'text-blue-900'}`}>
                                    {String(displayMin).padStart(2, '0')}
                                    <span className="text-yellow-500 mx-2">:</span>
                                    {String(displaySec).padStart(2, '0')}
                                </div>
                            </div>

                            {/* Input controls (before timer starts) */}
                            {timeLeft === null && (
                                <div className="flex items-end gap-4 bg-white border-4 border-blue-900 p-4 shadow-[6px_6px_0px_0px_rgba(30,58,138,1)]">
                                    <div className="flex flex-col items-center gap-2">
                                        <span className="text-[10px] text-blue-900 font-black uppercase tracking-widest">Minutes</span>
                                        <div className="flex items-center gap-2">
                                            <SquareBtn color="red" onClick={() => setInputMin(v => Math.max(0, v - 1))}>−</SquareBtn>
                                            <span className="w-14 text-center font-black text-3xl text-blue-900 font-mono tabular-nums">{inputMin}</span>
                                            <SquareBtn color="green" onClick={() => setInputMin(v => Math.min(99, v + 1))}>+</SquareBtn>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center gap-2">
                                        <span className="text-[10px] text-blue-900 font-black uppercase tracking-widest">Seconds</span>
                                        <div className="flex items-center gap-2">
                                            <SquareBtn color="red" onClick={() => setInputSec(v => Math.max(0, v - 5))}>−</SquareBtn>
                                            <span className="w-14 text-center font-black text-3xl text-blue-900 font-mono tabular-nums">{inputSec}</span>
                                            <SquareBtn color="green" onClick={() => setInputSec(v => Math.min(55, v + 5))}>+</SquareBtn>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Progress bar */}
                            {timeLeft !== null && (
                                <div className="w-full max-w-md bg-white border-4 border-blue-900 h-6 shadow-[4px_4px_0px_0px_rgba(30,58,138,1)] overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-1000 ${isFinished ? 'bg-red-500' : progress > 0.3 ? 'bg-green-500' : 'bg-yellow-500'}`}
                                        style={{ width: `${progress * 100}%` }}
                                    />
                                </div>
                            )}

                            {/* Controls */}
                            <div className="flex gap-3">
                                {!isRunning ? (
                                    <ArcadeBtn
                                        color="green"
                                        onClick={startTimer}
                                        disabled={(inputMin === 0 && inputSec === 0 && timeLeft === null) || isFinished}
                                    >
                                        <Play size={18} strokeWidth={3} />
                                        {timeLeft !== null && !isFinished ? 'Resume' : 'Start'}
                                    </ArcadeBtn>
                                ) : (
                                    <ArcadeBtn color="yellow" onClick={pauseTimer}>
                                        <Pause size={18} strokeWidth={3} /> Pause
                                    </ArcadeBtn>
                                )}
                                <ArcadeBtn color="gray" onClick={resetTimer}>
                                    <RotateCcw size={18} strokeWidth={3} /> Reset
                                </ArcadeBtn>
                            </div>

                            {isFinished && (
                                <p className="text-red-500 font-black text-2xl uppercase tracking-widest animate-pulse drop-shadow-md">
                                    ⏰ Time's Up!
                                </p>
                            )}
                        </div>
                    )}

                    {/* ── GROUPS ── */}
                    {selectedTool === 'groups' && (
                        <div className="flex flex-col items-center gap-5 animate-in fade-in duration-200">
                            <h3 className="text-2xl font-black text-blue-900 uppercase bg-yellow-300 px-5 py-2 border-4 border-blue-900 shadow-[4px_4px_0px_0px_rgba(30,58,138,1)] transform -rotate-1">
                                Group Generator
                            </h3>

                            <div className="flex flex-col items-center gap-3 bg-white border-4 border-blue-900 p-4 shadow-[6px_6px_0px_0px_rgba(30,58,138,1)]">
                                <span className="text-[11px] text-blue-900 font-black uppercase tracking-widest">Students per group</span>
                                <div className="flex items-center gap-3">
                                    <SquareBtn color="red" onClick={() => setGroupSize(s => Math.max(2, s - 1))}>−</SquareBtn>
                                    <span className="w-16 text-center font-black text-4xl text-blue-900 font-mono tabular-nums">{groupSize}</span>
                                    <SquareBtn color="green" onClick={() => setGroupSize(s => Math.min(Math.max(2, students.length), s + 1))}>+</SquareBtn>
                                </div>
                            </div>

                            {students.length >= 2 && (
                                <p className="text-xs text-blue-900 font-mono font-bold uppercase tracking-wider">
                                    {students.length} students → ~{Math.ceil(students.length / groupSize)} group{Math.ceil(students.length / groupSize) !== 1 ? 's' : ''}
                                </p>
                            )}

                            <ArcadeBtn color="blue" onClick={generateGroups} disabled={students.length < 2}>
                                <Shuffle size={18} strokeWidth={3} /> Generate
                            </ArcadeBtn>

                            {generatedGroups.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mt-2">
                                    {generatedGroups.map((grp, i) => (
                                        <div
                                            key={i}
                                            className="bg-white border-4 border-blue-900 shadow-[4px_4px_0px_0px_rgba(30,58,138,1)] overflow-hidden"
                                        >
                                            <div className="bg-blue-900 text-yellow-300 font-black text-xs uppercase tracking-widest px-3 py-1.5 font-mono">
                                                Group {i + 1}
                                            </div>
                                            <ul className="p-3 space-y-1">
                                                {grp.map(s => (
                                                    <li key={s.id} className="font-bold text-sm text-blue-900 flex items-center gap-2 font-mono">
                                                        <span className="text-yellow-500">★</span> {s.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {students.length < 2 && (
                                <p className="text-gray-500 text-center py-4 text-sm font-mono">Need at least 2 students.</p>
                            )}
                        </div>
                    )}

                    {/* ── PICKER ── */}
                    {selectedTool === 'picker' && (
                        <div className="flex flex-col items-center gap-5 animate-in fade-in duration-200">
                            <h3 className="text-2xl font-black text-blue-900 uppercase bg-yellow-300 px-5 py-2 border-4 border-blue-900 shadow-[4px_4px_0px_0px_rgba(30,58,138,1)] transform rotate-1">
                                Random Picker
                            </h3>

                            <div className="flex flex-col items-center gap-3 bg-white border-4 border-blue-900 p-4 shadow-[6px_6px_0px_0px_rgba(30,58,138,1)]">
                                <span className="text-[11px] text-blue-900 font-black uppercase tracking-widest">Students to pick</span>
                                <div className="flex items-center gap-3">
                                    <SquareBtn color="red" onClick={() => setPickCount(c => Math.max(1, c - 1))}>−</SquareBtn>
                                    <span className="w-16 text-center font-black text-4xl text-blue-900 font-mono tabular-nums">{pickCount}</span>
                                    <SquareBtn color="green" onClick={() => setPickCount(c => Math.min(students.length || 1, c + 1))}>+</SquareBtn>
                                </div>
                            </div>

                            {/* Rolling display */}
                            {rolling && (
                                <div className="bg-yellow-300 border-4 border-blue-900 px-10 py-6 shadow-[6px_6px_0px_0px_rgba(30,58,138,1)] min-w-[16rem]">
                                    <p className="text-3xl font-black text-blue-900 font-mono uppercase animate-pulse text-center tracking-wider">
                                        {rollingName || '...'}
                                    </p>
                                </div>
                            )}

                            {/* Results */}
                            {!rolling && picked.length > 0 && (
                                <div className="flex flex-col gap-2 w-full max-w-md">
                                    {picked.map((s, i) => (
                                        <div
                                            key={s.id}
                                            className="flex items-center gap-3 bg-white border-4 border-blue-900 shadow-[4px_4px_0px_0px_rgba(30,58,138,1)] p-3 animate-in slide-in-from-bottom duration-300"
                                            style={{ animationDelay: `${i * 80}ms` }}
                                        >
                                            <span className="text-2xl">{i === 0 ? '🎯' : '🎲'}</span>
                                            <span className="font-black text-xl text-blue-900 font-mono uppercase tracking-wider">{s.name}</span>
                                            <span className="ml-auto font-mono text-sm text-yellow-600 font-black">★ {s.points}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <ArcadeBtn
                                color="red"
                                size="lg"
                                onClick={pickRandom}
                                disabled={students.length === 0 || rolling}
                            >
                                <Shuffle size={22} strokeWidth={3} /> Pick!
                            </ArcadeBtn>

                            {students.length === 0 && (
                                <p className="text-gray-500 text-sm font-mono">No students yet.</p>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default ToolkitModal;
