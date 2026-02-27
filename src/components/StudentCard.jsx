import React, { useState } from 'react';
import { Trash2, Eraser, Plus } from 'lucide-react';
import EvolutionStar from './EvolutionStar';

const StudentCard = ({ student, onUpdatePoints, onDelete }) => {
    const [addValue, setAddValue] = useState(1);
    const [subValue, setSubValue] = useState(1);

    const handleAdd = () => {
        const val = parseInt(addValue);
        if (val > 0) {
            onUpdatePoints(student.id, val);
            setAddValue(1);
        }
    };

    const handleSubtract = () => {
        const val = parseInt(subValue);
        if (val > 0) {
            onUpdatePoints(student.id, -val);
            setSubValue(1);
        }
    };

    return (
        <div className="group flex items-center justify-between p-4 hover:bg-blue-50 transition-colors bg-white border-b border-blue-100 last:border-b-0">
            {/* Left: Name */}
            <div className="w-1/4 min-w-[200px] flex items-center gap-3">
                <button
                    onClick={onDelete}
                    className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-1"
                    title="Delete"
                >
                    <Trash2 size={18} />
                </button>
                <h3 className="font-bold text-xl text-blue-900 font-mono text-left truncate">{student.name}</h3>
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
                        <button
                            onClick={handleAdd}
                            disabled={!addValue || parseInt(addValue) <= 0}
                            className="w-8 h-6 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded transition-transform active:scale-95 disabled:opacity-50"
                        >
                            <Plus size={16} strokeWidth={3} />
                        </button>
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
        </div>
    );
};

export default StudentCard;
