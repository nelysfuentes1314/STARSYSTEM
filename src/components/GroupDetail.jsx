import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus, ArrowDownUp, Gift, Swords, Wrench } from 'lucide-react';
import StudentCard from './StudentCard';
import StarChallengeModal from './StarChallengeModal';
import GroupAwardModal from './GroupAwardModal';
import ToolkitModal from './ToolkitModal';

const GroupDetail = ({ groups, onAddStudent, onUpdatePoints, onUpdateAllPoints, onTransferPoints, onDeleteStudent, onAddMedal, onUpdateMedal, onDeleteMedal, settings }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const group = groups.find(g => g.id === id);
    const [newStudentName, setNewStudentName] = useState('');
    const [sortBy, setSortBy] = useState('stars_desc');
    const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);
    const [isAwardModalOpen, setIsAwardModalOpen] = useState(false);
    const [isToolkitOpen, setIsToolkitOpen] = useState(false);

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

    const handleAwardAll = (amount) => {
        onUpdateAllPoints(group.id, amount);
    };

    const sortedStudents = [...group.students].sort((a, b) => {
        if (sortBy === 'stars_desc') {
            return b.points - a.points;
        }
        return a.name.localeCompare(b.name);
    });

    const uniquePoints = [...new Set(group.students.map(s => s.points))].sort((a, b) => b - a);
    const getRank = (points) => {
        if (points === 0) return null;
        const index = uniquePoints.indexOf(points);
        if (index === 0) return 1;
        if (index === 1) return 2;
        if (index === 2) return 3;
        return null;
    };

    return (
        <div className="animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4 min-w-0">
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 hover:bg-gray-200 rounded-full transition text-blue-900 shrink-0"
                        title="Go Back"
                    >
                        <ArrowLeft size={28} />
                    </button>
                    <div className="min-w-0">
                        <h2 className="text-4xl font-bold text-blue-900 font-serif truncate">{group.name}</h2>
                        <p className="text-gray-500">{group.students.length} enrolled students</p>
                    </div>
                </div>

                <button
                    onClick={() => setIsToolkitOpen(true)}
                    className="shrink-0 inline-flex items-center gap-2 bg-yellow-400 text-blue-900 px-5 py-3 border-4 border-blue-900 shadow-[6px_6px_0px_0px_rgba(30,58,138,1)] hover:bg-yellow-300 hover:-translate-y-0.5 hover:shadow-[7px_7px_0px_0px_rgba(30,58,138,1)] active:translate-y-1 active:shadow-none font-black uppercase tracking-widest text-sm font-mono transition-all"
                    title="Open Toolkit"
                >
                    <Wrench size={18} strokeWidth={2.5} />
                    <span className="hidden sm:inline">Toolkit</span>
                </button>
            </div>

            <div className="bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] border-4 border-blue-900">
                {/* Tabs / Toolbar */}
                {/* Tabs / Toolbar - Redesigned as Arcade Panel */}
                <div className="bg-blue-100 border-b-4 border-blue-900 p-6 flex flex-col lg:flex-row justify-between items-center gap-4">
                    <div className="text-xl font-bold text-blue-900 flex items-center gap-3 bg-white px-4 py-2 border-2 border-blue-900 shadow-[4px_4px_0px_0px_rgba(30,58,138,1)] transform -rotate-1 shrink-0">
                        <img src="/icons/pixel-star-cool.svg" alt="Cool Star" className="w-8 h-8 animate-spin-slow" />
                        Classroom Star Chart
                    </div>
                    
                    <div className="flex gap-2 flex-wrap justify-center flex-grow">
                        <button
                            onClick={() => setSortBy(sortBy === 'name' ? 'stars_desc' : 'name')}
                            className="bg-purple-500 text-white px-3 py-2 border-b-4 border-purple-700 active:border-b-0 active:translate-y-1 transition-all flex items-center gap-2 font-bold uppercase tracking-wide text-xs hover:bg-purple-400 rounded-sm"
                        >
                            <ArrowDownUp size={16} />
                            Sort: {sortBy === 'name' ? 'A-Z' : 'Stars'}
                        </button>
                        
                        <button
                            onClick={() => setIsAwardModalOpen(true)}
                            className="bg-yellow-500 text-blue-900 px-3 py-2 border-b-4 border-yellow-700 active:border-b-0 active:translate-y-1 transition-all flex items-center gap-2 font-black uppercase tracking-wide text-xs hover:bg-yellow-400 rounded-sm"
                        >
                            <Gift size={16} />
                            Award All
                        </button>

                        <button
                            onClick={() => setIsChallengeModalOpen(true)}
                            className="bg-red-500 text-white px-3 py-2 border-b-4 border-red-700 active:border-b-0 active:translate-y-1 transition-all flex items-center gap-2 font-black uppercase tracking-wide text-xs hover:bg-red-400 rounded-sm"
                        >
                            <Swords size={16} />
                            Challenge!
                        </button>
                    </div>

                    <form onSubmit={handleAddStudent} className="flex gap-2 w-full md:w-auto bg-yellow-100 p-2 rounded-lg border-2 border-dashed border-yellow-600 shrink-0">
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
                            {sortedStudents.map(student => (
                                <StudentCard
                                    key={student.id}
                                    student={student}
                                    rank={getRank(student.points)}
                                    onUpdatePoints={(studentId, change) => onUpdatePoints(group.id, studentId, change)}
                                    onDelete={() => onDeleteStudent(group.id, student.id)}
                                    onAddMedal={(medal) => onAddMedal(group.id, student.id, medal)}
                                    onUpdateMedal={(medalId, updates) => onUpdateMedal(group.id, student.id, medalId, updates)}
                                    onDeleteMedal={(medalId) => onDeleteMedal(group.id, student.id, medalId)}
                                    settings={settings}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <StarChallengeModal
                isOpen={isChallengeModalOpen}
                onClose={() => setIsChallengeModalOpen(false)}
                students={group.students}
                onTransfer={(fromId, toId, amount) => onTransferPoints(group.id, fromId, toId, amount)}
                onUpdatePoints={(studentId, amount) => onUpdatePoints(group.id, studentId, amount)}
            />

            <GroupAwardModal
                isOpen={isAwardModalOpen}
                onClose={() => setIsAwardModalOpen(false)}
                onAward={handleAwardAll}
            />

            <ToolkitModal
                isOpen={isToolkitOpen}
                onClose={() => setIsToolkitOpen(false)}
                students={group.students}
            />
        </div>
    );
};

export default GroupDetail;
