import React, { useState, useEffect, useRef } from 'react';
import { Trash2, Eraser, Plus, Award, Star, Crown, Medal } from 'lucide-react';
import EvolutionStar, { PixelStar } from './EvolutionStar';
import MedalModal from './MedalModal';

export const playMagicSound = () => {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();

        const playNote = (freq, startTime, duration, vol) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(vol, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(startTime);
            osc.stop(startTime + duration);
        };

        const now = ctx.currentTime;
        // Fast ascending magical arpeggio
        playNote(523.25, now, 0.15, 0.1);       // C5
        playNote(659.25, now + 0.05, 0.15, 0.1); // E5
        playNote(783.99, now + 0.1, 0.15, 0.1);  // G5
        playNote(1046.50, now + 0.15, 0.3, 0.15); // C6
    } catch(e) {
        console.error("Audio error", e);
    }
};

export const playWinnerSound = () => {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();

        const playNote = (freq, startTime, duration, vol = 0.1, type = 'sine') => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(vol, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(startTime);
            osc.stop(startTime + duration);
        };

        const now = ctx.currentTime;
        // Victory fanfare: rising triplet → big sustained C-major chord
        playNote(523.25, now,        0.12, 0.10);  // C5
        playNote(659.25, now + 0.12, 0.12, 0.10);  // E5
        playNote(783.99, now + 0.24, 0.12, 0.10);  // G5
        // Big triumphant chord
        playNote(1046.50, now + 0.36, 0.8, 0.13);  // C6
        playNote(1318.51, now + 0.36, 0.8, 0.08);  // E6
        playNote(1567.98, now + 0.36, 0.8, 0.08);  // G6
        // Sparkle on top
        playNote(2093.00, now + 0.55, 0.4, 0.05);  // C7
    } catch (e) {
        console.error("Audio error", e);
    }
};

export const playSubtractSound = () => {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();

        const playNote = (freq, startTime, duration, vol) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(vol, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(startTime);
            osc.stop(startTime + duration);
        };

        const now = ctx.currentTime;
        // Descending "deflate" arpeggio
        playNote(523.25, now, 0.12, 0.09);        // C5
        playNote(415.30, now + 0.06, 0.12, 0.09); // G#4
        playNote(329.63, now + 0.12, 0.12, 0.09); // E4
        playNote(220.00, now + 0.18, 0.30, 0.10); // A3
    } catch(e) {
        console.error("Audio error", e);
    }
};

const EASTER_EGG_NUMBERS = [67, 167, 267, 367];

const StudentCard = ({ student, rank, onUpdatePoints, onDelete, onAddMedal, onUpdateMedal, onDeleteMedal, settings = {} }) => {
    const [addValue, setAddValue] = useState(1);
    const [subValue, setSubValue] = useState(1);
    const [flyingStars, setFlyingStars] = useState([]);
    const [isGlowing, setIsGlowing] = useState(false);
    const [isMedalModalOpen, setIsMedalModalOpen] = useState(false);
    const [editingMedal, setEditingMedal] = useState(null);
    const [easterEggActive, setEasterEggActive] = useState(false);

    const prevPointsRef = useRef(student.points);
    const pendingEasterRef = useRef(null);
    const dismissEasterRef = useRef(null);
    const easterPositions = useRef([]);
    const medalClickRef = useRef({}); // { [medalId]: { count, timer } }
    const bannersEnabled = settings.bannersEnabled !== false;

    useEffect(() => {
        if (student.points > prevPointsRef.current) {
            const diff = student.points - prevPointsRef.current;
            const numStars = Math.min(diff, 8); // cap visual stars
            const newStars = Array.from({length: numStars}).map((_, i) => ({
                id: Date.now() + i,
                delay: Math.random() * 0.2
            }));
            
            setFlyingStars(prev => [...prev, ...newStars]);
            
            // Trigger glow when stars hit the name
            setTimeout(() => {
                setIsGlowing(true);
                setTimeout(() => setIsGlowing(false), 500);
            }, 960);

            setTimeout(() => {
                setFlyingStars(prev => prev.filter(s => !newStars.find(n => n.id === s.id)));
            }, 1500);
        }
        prevPointsRef.current = student.points;
    }, [student.points]);

    // Easter egg: 67, 167, 267, 367 — must stay for 1.5s to trigger
    const easterEggEnabled = settings.easterEgg67Enabled !== false;
    useEffect(() => {
        clearTimeout(pendingEasterRef.current);

        if (!easterEggEnabled) {
            setEasterEggActive(false);
            clearTimeout(dismissEasterRef.current);
            return;
        }

        if (!EASTER_EGG_NUMBERS.includes(student.points)) return;

        pendingEasterRef.current = setTimeout(() => {
            easterPositions.current = Array.from({ length: 28 }, () => ({
                left: `${Math.random() * 85}%`,
                top: `${Math.random() * 78}%`,
                fontSize: `${Math.random() * 16 + 10}px`,
                rotation: `${Math.random() * 60 - 30}deg`,
            }));
            setEasterEggActive(true);
            clearTimeout(dismissEasterRef.current);
            dismissEasterRef.current = setTimeout(() => setEasterEggActive(false), 5000);
        }, 1500);

        return () => clearTimeout(pendingEasterRef.current);
    }, [student.points, easterEggEnabled]);

    // Cleanup dismiss timer on unmount
    useEffect(() => {
        return () => clearTimeout(dismissEasterRef.current);
    }, []);

    const handleAdd = () => {
        const val = parseInt(addValue);
        if (val > 0) {
            onUpdatePoints(student.id, val);
            playMagicSound();
            setAddValue(1);
        }
    };

    const handleSubtract = () => {
        const val = parseInt(subValue);
        if (val > 0) {
            onUpdatePoints(student.id, -val);
            playSubtractSound();
            setSubValue(1);
        }
    };

    // Medal interactions: 2 clicks → edit, 4 clicks → delete (within 400ms windows)
    const handleMedalClick = (medal) => {
        const entry = medalClickRef.current[medal.id] || { count: 0, timer: null };
        clearTimeout(entry.timer);
        entry.count += 1;

        if (entry.count >= 4) {
            entry.count = 0;
            medalClickRef.current[medal.id] = entry;
            if (onDeleteMedal) onDeleteMedal(medal.id);
            return;
        }

        entry.timer = setTimeout(() => {
            if (entry.count === 2) {
                setEditingMedal(medal);
                setIsMedalModalOpen(true);
            }
            entry.count = 0;
        }, 400);
        medalClickRef.current[medal.id] = entry;
    };

    let bannerClasses = "bg-white border-blue-100 hover:bg-blue-50";
    let rankBadge = null;
    let rankLabel = null;
    let rankDecoration = null;

    if (bannersEnabled && rank === 1) {
        // STAR MASTER: bright royal gold with floating pixel stars
        bannerClasses = "relative overflow-hidden bg-gradient-to-r from-yellow-100 via-amber-50 to-yellow-100 border-l-[6px] border-l-yellow-400 border-yellow-200 shadow-[inset_0_0_40px_rgba(234,179,8,0.12)]";
        rankBadge = (
            <div className="flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-br from-yellow-200 via-yellow-400 to-amber-600 border-2 border-amber-700 shadow-[0_0_18px_rgba(250,204,21,0.9)] animate-bounce-slow shrink-0">
                <Star size={22} className="text-white drop-shadow fill-white" strokeWidth={2} />
            </div>
        );
        rankLabel = (
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-900 bg-gradient-to-r from-yellow-300 to-amber-400 px-1.5 py-0.5 rounded-sm border border-amber-700 shadow-sm">
                ★ Star Master
            </span>
        );
        rankDecoration = (
            <>
                <div aria-hidden className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.95),transparent_30%),radial-gradient(circle_at_80%_30%,rgba(250,204,21,0.5),transparent_35%)]" />
                <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[
                        { left: '4%',  level: 1, scale: 0.9, delay: '0s'    },
                        { left: '11%', level: 3, scale: 0.6, delay: '1.4s'  },
                        { left: '17%', level: 2, scale: 0.8, delay: '2.6s'  },
                        { left: '24%', level: 4, scale: 0.45, delay: '0.5s' },
                        { left: '31%', level: 1, scale: 1.0, delay: '3.2s'  },
                        { left: '38%', level: 5, scale: 0.4, delay: '1.8s'  },
                        { left: '44%', level: 2, scale: 0.7, delay: '0.9s'  },
                        { left: '51%', level: 1, scale: 0.85,delay: '2.4s'  },
                        { left: '57%', level: 3, scale: 0.55,delay: '0.2s'  },
                        { left: '64%', level: 4, scale: 0.5, delay: '1.6s'  },
                        { left: '70%', level: 2, scale: 0.6, delay: '3.0s'  },
                        { left: '77%', level: 1, scale: 0.95,delay: '0.7s'  },
                        { left: '83%', level: 5, scale: 0.4, delay: '2.1s'  },
                        { left: '89%', level: 3, scale: 0.7, delay: '1.2s'  },
                        { left: '95%', level: 1, scale: 0.8, delay: '2.8s'  },
                    ].map((s, i) => (
                        <span
                            key={i}
                            className="absolute"
                            style={{ left: s.left, bottom: '-15%', transform: `scale(${s.scale})`, transformOrigin: 'bottom center' }}
                        >
                            <span
                                className="animate-star-float drop-shadow-[0_0_6px_rgba(255,255,255,0.9)] block"
                                style={{ animationDelay: s.delay }}
                            >
                                <PixelStar level={s.level} noAnim />
                            </span>
                        </span>
                    ))}
                </div>
            </>
        );
    } else if (bannersEnabled && rank === 2) {
        // GOLD INGOT: soft metallic with gentle sweeping light
        bannerClasses = "relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#fefce8_40%,#fef9c3_65%,#fef3c7_100%)] border-l-[6px] border-l-amber-300 border-amber-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-1px_0_rgba(217,119,6,0.1)]";
        rankBadge = (
            <div className="flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-br from-yellow-100 via-amber-300 to-amber-700 border-2 border-amber-800 shadow-[0_0_14px_rgba(180,83,9,0.7)] shrink-0">
                <Crown size={22} className="text-amber-900 drop-shadow" strokeWidth={2.5} />
            </div>
        );
        rankLabel = (
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-950 bg-yellow-100 px-1.5 py-0.5 rounded-sm border border-amber-700">
                2nd · Gold
            </span>
        );
        rankDecoration = (
            <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden animate-ingot-shine bg-[linear-gradient(110deg,transparent_42%,rgba(255,255,255,0.45)_49%,rgba(255,255,255,0.6)_50%,rgba(255,255,255,0.45)_51%,transparent_58%)] bg-[length:250%_100%]" />
        );
    } else if (bannersEnabled && rank === 3) {
        // Iron / Silver: steel gradient with polish shine
        bannerClasses = "relative bg-gradient-to-r from-slate-200 via-gray-100 to-slate-200 border-l-[6px] border-l-slate-500 border-slate-300 shadow-[inset_0_0_40px_rgba(100,116,139,0.2)] animate-banner-shine";
        rankBadge = (
            <div className="flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-br from-slate-200 via-white to-slate-400 border-2 border-slate-600 shadow-[0_0_12px_rgba(100,116,139,0.5)] shrink-0">
                <Medal size={22} className="text-slate-700 drop-shadow" strokeWidth={2.5} />
            </div>
        );
        rankLabel = (
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-700 bg-slate-200 px-1.5 py-0.5 rounded-sm border border-slate-400">
                3rd · Iron
            </span>
        );
        rankDecoration = (
            <div aria-hidden className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(circle_at_18%_50%,rgba(255,255,255,0.9),transparent_25%),radial-gradient(circle_at_82%_35%,rgba(100,116,139,0.3),transparent_30%)]" />
        );
    }

    return (
        <div className={`group flex items-center justify-between p-4 transition-colors border-b last:border-b-0 relative ${bannerClasses}`}>
            {/* Easter Egg Overlay */}
            {easterEggActive && (
                <div className="absolute inset-0 z-[100] overflow-hidden animate-easter-egg pointer-events-none bg-yellow-400/90">
                    {easterPositions.current.map((pos, i) => (
                        <span
                            key={i}
                            className="absolute font-black font-mono text-blue-900 select-none opacity-80"
                            style={{
                                left: pos.left,
                                top: pos.top,
                                fontSize: pos.fontSize,
                                transform: `rotate(${pos.rotation})`,
                            }}
                        >
                            67
                        </span>
                    ))}
                    <span className="absolute inset-0 flex items-center justify-center text-6xl font-black font-mono text-blue-900 drop-shadow-lg">
                        67
                    </span>
                </div>
            )}
            {rankDecoration}
            {/* Left: Name */}
            <div className="w-1/3 min-w-[200px] flex items-center gap-3 relative z-10">
                <div className="flex flex-col items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                        onClick={() => { setEditingMedal(null); setIsMedalModalOpen(true); }}
                        className="text-amber-500 hover:text-amber-600 hover:brightness-110 transition-colors p-1"
                        title="Award Medal"
                    >
                        <Award size={18} />
                    </button>
                    <button
                        onClick={onDelete}
                        className="text-gray-300 hover:text-red-500 transition-colors p-1"
                        title="Delete"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
                {rankBadge}
                <div className="flex flex-col gap-1 w-full min-w-0">
                    <div className="flex items-center relative gap-2">
                        <h3 className={`font-bold text-xl font-mono text-left truncate transition-all duration-300 ${isGlowing ? 'drop-shadow-[0_0_15px_rgba(250,204,21,1)] text-yellow-500 scale-110' : 'text-blue-900'}`}>
                            {student.name}
                        </h3>
                        {rankLabel}

                        {/* Flying Stars Target Zone - lands just past the name */}
                        {flyingStars.length > 0 && (
                            <div className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 flex items-center z-[60] pointer-events-none">
                                {flyingStars.map(star => (
                                    <div
                                        key={star.id}
                                        className="animate-fly-to-target absolute"
                                        style={{
                                            animationDelay: `${star.delay}s`
                                        }}
                                    >
                                        <PixelStar level={1} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Student Medals - prominent animated pills */}
                    {(student.medals && student.medals.length > 0) && (
                        <div className="flex flex-wrap gap-1.5 mt-1">
                            {student.medals.map(m => (
                                <button
                                    key={m.id}
                                    type="button"
                                    onClick={() => handleMedalClick(m)}
                                    title={`${m.name} — double-click to edit, 4 clicks to remove`}
                                    className="group/medal relative inline-flex items-center gap-1 pl-1 pr-2 py-0.5 rounded-full bg-gradient-to-r from-yellow-200 via-amber-100 to-yellow-200 border border-amber-500 shadow-[0_2px_0_0_rgba(180,83,9,0.7)] hover:shadow-[0_3px_0_0_rgba(180,83,9,0.9)] hover:-translate-y-0.5 transition-all overflow-hidden cursor-pointer"
                                >
                                    <span aria-hidden className="absolute inset-0 opacity-0 group-hover/medal:opacity-100 transition-opacity bg-gradient-to-r from-transparent via-white/70 to-transparent animate-banner-shine-fast pointer-events-none" />
                                    <span className="relative text-base drop-shadow-sm leading-none">{m.icon}</span>
                                    <span className="relative text-[10px] font-black uppercase tracking-wider text-amber-900 font-mono leading-none">{m.name}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Center: Visual Progress */}
            <div className="flex-grow flex justify-start px-4 py-2 min-w-0">
                <EvolutionStar points={student.points} />
            </div>

            {/* Right: Controls */}
            <div className="flex flex-shrink-0 items-center gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
                <span className="font-bold text-blue-900 font-mono text-xl w-10 text-right mr-2">{student.points}</span>

                <div className="flex flex-col gap-1">
                    {/* Add Controls */}
                    <div className="flex items-center gap-1 bg-green-50 p-1 rounded border border-green-200" title="Add Stars">
                        <input
                            type="number"
                            min="1"
                            value={addValue}
                            onChange={(e) => setAddValue(e.target.value)}
                            className="w-12 h-6 px-1 text-center font-bold text-green-900 bg-white border border-green-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500 font-mono text-sm"
                        />
                        <div className="relative">
                            <button
                                onClick={handleAdd}
                                disabled={!addValue || parseInt(addValue) <= 0}
                                className="w-8 h-6 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded transition-transform active:scale-95 disabled:opacity-50"
                            >
                                <Plus size={16} strokeWidth={3} />
                            </button>
                        </div>
                    </div>

                    {/* Subtract Controls */}
                    <div className="flex items-center gap-1 bg-red-50 p-1 rounded border border-red-200" title="Remove Stars">
                        <input
                            type="number"
                            min="1"
                            value={subValue}
                            onChange={(e) => setSubValue(e.target.value)}
                            className="w-12 h-6 px-1 text-center font-bold text-red-900 bg-white border border-red-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500 font-mono text-sm"
                        />
                        <button
                            onClick={handleSubtract}
                            disabled={student.points < parseInt(subValue) || !subValue || parseInt(subValue) <= 0}
                            className="w-8 h-6 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded transition-transform active:scale-95 disabled:opacity-50"
                        >
                            <Eraser size={14} />
                        </button>
                    </div>
                </div>
            </div>
            
            <MedalModal
                isOpen={isMedalModalOpen}
                onClose={() => { setIsMedalModalOpen(false); setEditingMedal(null); }}
                onAwardMedal={onAddMedal}
                onSaveMedal={(updates) => editingMedal && onUpdateMedal && onUpdateMedal(editingMedal.id, updates)}
                editingMedal={editingMedal}
                studentName={student.name}
            />
        </div>
    );
};

export default StudentCard;
