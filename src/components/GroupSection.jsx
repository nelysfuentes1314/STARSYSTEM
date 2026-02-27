import React, { useState } from 'react';
import { UserPlus, MoreVertical, Trash2 } from 'lucide-react';
import StudentCard from './StudentCard';

const GroupSection = ({ group, onAddStudent, onDeleteGroup, onUpdatePoints, onDeleteStudent }) => {
    const [newStudentName, setNewStudentName] = useState('');

    const handleAddString = (e) => {
        e.preventDefault();
        if (newStudentName.trim()) {
            onAddStudent(group.id, newStudentName.trim());
            setNewStudentName('');
        }
    };

    return (
        <div className="bg-gray-50 rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{group.name}</h2>
                <button
                    onClick={() => onDeleteGroup(group.id)}
                    className="text-red-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg"
                    title="Delete group"
                >
                    <Trash2 size={20} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {group.students.map(student => (
                    <StudentCard
                        key={student.id}
                        student={student}
                        onUpdatePoints={(studentId, change) => onUpdatePoints(group.id, studentId, change)}
                        onDelete={() => onDeleteStudent(group.id, student.id)}
                    />
                ))}
            </div>

            <form onSubmit={handleAddString} className="flex gap-2">
                <input
                    type="text"
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    placeholder="Student name..."
                    className="flex-grow px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <button
                    type="submit"
                    disabled={!newStudentName.trim()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <UserPlus size={20} />
                    <span>Add</span>
                </button>
            </form>
        </div>
    );
};

export default GroupSection;
