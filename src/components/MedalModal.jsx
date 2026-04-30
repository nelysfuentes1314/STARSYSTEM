import React, { useState, useEffect } from 'react';
import { X, Award } from 'lucide-react';

const EMOJIS = ['🌟', '🔥', '🧠', '🚀', '👑', '🏅', '🎯', '🎨', '📚', '🤝', '⭐', '✋', '✨', '💎', '🦄'];

const MedalModal = ({ isOpen, onClose, onAwardMedal, onSaveMedal, studentName, editingMedal }) => {
    const isEditing = !!editingMedal;
    const [selectedType, setSelectedType] = useState(null); // 'behavior', 'participation', 'custom'
    const [customName, setCustomName] = useState('');
    const [customIcon, setCustomIcon] = useState('🌟');

    // Reset / preload state when opening
    useEffect(() => {
        if (!isOpen) return;
        if (editingMedal) {
            setSelectedType('custom');
            setCustomName(editingMedal.name || '');
            setCustomIcon(editingMedal.icon || '🌟');
        } else {
            setSelectedType(null);
            setCustomName('');
            setCustomIcon('🌟');
        }
    }, [isOpen, editingMedal]);

    if (!isOpen) return null;

    const PRESETS = [
        { id: 'behavior', name: 'Behavior', icon: '⭐', desc: 'Excellent conduct and respect.' },
        { id: 'participation', name: 'Participation', icon: '✋', desc: 'Active involvement in class.' },
        { id: 'custom', name: 'Custom Medal', icon: '✨', desc: 'Create your own special medal.' }
    ];

    const handleConfirm = () => {
        let payload = null;
        if (selectedType === 'behavior') payload = { name: 'Behavior', icon: '⭐' };
        else if (selectedType === 'participation') payload = { name: 'Participation', icon: '✋' };
        else if (selectedType === 'custom') {
            if (!customName.trim()) return;
            payload = { name: customName.trim(), icon: customIcon };
        }
        if (!payload) return;

        if (isEditing) {
            onSaveMedal(payload);
        } else {
            onAwardMedal(payload);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-blue-900/70 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="bg-white border-4 border-blue-900 rounded-xl shadow-[8px_8px_0px_0px_rgba(30,58,138,1)] max-w-sm w-full overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 slide-in-from-bottom-4 duration-200">

                {/* Header */}
                <div className="bg-blue-900 text-white p-4 flex justify-between items-center border-b-4 border-blue-950">
                    <div className="flex items-center gap-2">
                        <Award className="text-yellow-400" size={24} />
                        <h2 className="text-xl font-bold font-mono tracking-tight text-yellow-400 uppercase">
                            {isEditing ? 'Edit Medal' : 'Award Medal'}
                        </h2>
                    </div>
                    <button onClick={onClose} className="text-blue-200 hover:text-white transition-colors">
                        <X size={24} strokeWidth={3} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto">
                    <p className="text-center font-bold text-gray-600 mb-6 font-mono text-sm">
                        {isEditing ? (
                            <>Editing medal for <span className="text-blue-700">{studentName}</span></>
                        ) : (
                            <>Choose a medal to award to <span className="text-blue-700">{studentName}</span></>
                        )}
                    </p>

                    {!isEditing && (
                        <div className="space-y-3 mb-6">
                            {PRESETS.map(preset => (
                                <button
                                    key={preset.id}
                                    onClick={() => setSelectedType(preset.id)}
                                    className={`w-full text-left p-3 rounded-lg border-2 transition-colors flex items-center gap-4 ${
                                        selectedType === preset.id
                                        ? 'border-yellow-400 bg-yellow-50 ring-2 ring-yellow-300'
                                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                                    }`}
                                >
                                    <div className="text-3xl">{preset.icon}</div>
                                    <div>
                                        <div className="font-bold text-blue-900 font-mono">{preset.name}</div>
                                        <div className="text-xs text-gray-500 font-sans">{preset.desc}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Custom / Edit Options */}
                    {(selectedType === 'custom' || isEditing) && (
                        <div className="animate-in slide-in-from-top-4 fade-in duration-300 p-4 bg-gray-50 rounded-lg border-2 border-gray-200 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Medal Name</label>
                                <input
                                    type="text"
                                    value={customName}
                                    onChange={(e) => setCustomName(e.target.value)}
                                    placeholder="e.g. Math Genius"
                                    className="w-full px-3 py-2 border-2 border-gray-300 rounded font-mono font-bold focus:outline-none focus:border-blue-500"
                                    maxLength={20}
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Select Icon</label>
                                <div className="flex flex-wrap gap-2">
                                    {EMOJIS.map(emoji => (
                                        <button
                                            key={emoji}
                                            onClick={() => setCustomIcon(emoji)}
                                            className={`text-2xl p-2 rounded transition-all ${customIcon === emoji ? 'bg-blue-100 scale-110 shadow-sm' : 'hover:bg-gray-200'}`}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 border-t-2 border-gray-100 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 font-bold text-gray-500 hover:bg-gray-200 rounded transition-colors font-mono uppercase text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={!selectedType || ((selectedType === 'custom' || isEditing) && !customName.trim())}
                        className="px-6 py-2 bg-yellow-400 hover:bg-yellow-300 hover:brightness-110 text-yellow-900 font-bold rounded shadow-[0_0_0_0_rgba(202,138,4,0)] hover:shadow-[0_0_16px_2px_rgba(250,204,21,0.6)] transition-all disabled:opacity-50 disabled:hover:shadow-none font-mono uppercase text-sm flex items-center gap-2"
                    >
                        <Award size={18} />
                        {isEditing ? 'Save' : 'Award Medal!'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MedalModal;
