import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus } from 'lucide-react';
import StudentCard from './StudentCard';

const GroupDetail = ({ groups, onAddStudent, onUpdatePoints, onDeleteStudent }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const group = groups.find(g => g.id === id);
    const [newStudentName, setNewStudentName] = useState('');

    if (!group) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-700">Group not found</h2>
                <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">Return to Home</Link>
            </div>
        );
    }

    const handleAddStudent = (e) => {
        e.preventDefault();
        if (newStudentName.trim()) {
            onAddStudent(group.id, newStudentName.trim());
            setNewStudentName('');
        }
    };

    return (
        <div className="animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate('/')}
                    className="p-2 hover:bg-gray-200 rounded-full transition text-blue-900"
                    title="Go Back"
                >
                    <ArrowLeft size={28} />
                </button>
                <div>
                    <h2 className="text-4xl font-bold text-blue-900 font-serif">{group.name}</h2>
                    <p className="text-gray-500">{group.students.length} enrolled students</p>
                </div>
            </div>

            <div className="bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] border-4 border-blue-900">
                {/* Tabs / Toolbar */}
                {/* Tabs / Toolbar - Redesigned as Arcade Panel */}
                <div className="bg-blue-100 border-b-4 border-blue-900 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-xl font-bold text-blue-900 flex items-center gap-3 bg-white px-4 py-2 border-2 border-blue-900 shadow-[4px_4px_0px_0px_rgba(30,58,138,1)] transform -rotate-1">
                        <img src="/icons/pixel-star-cool.svg" alt="Cool Star" className="w-8 h-8 animate-spin-slow" />
                        Classroom Star Chart
                    </div>

                    <form onSubmit={handleAddStudent} className="flex gap-2 w-full md:w-auto bg-yellow-100 p-2 rounded-lg border-2 border-dashed border-yellow-600">
                        <input
                            type="text"
                            value={newStudentName}
                            onChange={(e) => setNewStudentName(e.target.value)}
                            placeholder="Student name..."
                            className="flex-grow md:w-64 px-4 py-2 bg-white border-2 border-yellow-600 text-blue-900 placeholder-blue-300 focus:outline-none focus:ring-0 font-bold font-mono text-sm"
                        />
                        <button
                            type="submit"
                            disabled={!newStudentName.trim()}
                            className="bg-green-500 text-white px-4 py-2 border-b-4 border-green-700 active:border-b-0 active:translate-y-1 transition-all flex items-center gap-2 font-bold uppercase tracking-wide text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-400"
                        >
                            <UserPlus size={16} />
                            Start
                        </button>
                    </form>
                </div>

                {/* Content */}
                <div className="p-6 bg-slate-50 min-h-[500px]">
                    {group.students.length === 0 ? (
                        <div className="text-center py-20 text-gray-400">
                            <p className="text-lg">This class is empty.</p>
                            <p>Add students above to get started.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-0 divide-y-2 divide-blue-100 bg-white border-2 border-blue-900 shadow-[4px_4px_0px_0px_rgba(30,58,138,0.2)]">
                            {group.students.map(student => (
                                <StudentCard
                                    key={student.id}
                                    student={student}
                                    onUpdatePoints={(studentId, change) => onUpdatePoints(group.id, studentId, change)}
                                    onDelete={() => onDeleteStudent(group.id, student.id)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GroupDetail;
