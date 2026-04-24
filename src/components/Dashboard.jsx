import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Users, School, Trash2, Sparkles } from 'lucide-react';
import WhatsNewModal from './WhatsNewModal';

const Dashboard = ({ groups, onAddGroup, onDeleteGroup }) => {
    const [newGroupName, setNewGroupName] = useState('');
    const [isWhatsNewOpen, setIsWhatsNewOpen] = useState(false);

    const handleAddGroup = (e) => {
        e.preventDefault();
        if (newGroupName.trim()) {
            onAddGroup(newGroupName.trim());
            setNewGroupName('');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Panel */}
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold font-serif mb-2">School Dashboard</h2>
                    <p className="text-blue-100 opacity-90 mb-4">Manage your classes and groups from here.</p>
                    <button
                        onClick={() => setIsWhatsNewOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-400 hover:bg-yellow-300 hover:brightness-105 text-yellow-900 font-black text-xs uppercase tracking-wider border-2 border-yellow-600 shadow-[0_3px_0_0_rgba(161,98,7,0.8)] hover:shadow-[0_4px_0_0_rgba(161,98,7,0.9)] hover:-translate-y-0.5 transition-all"
                    >
                        <Sparkles size={14} />
                        What's new
                    </button>
                </div>
                <img
                    src="/icons/ninos.svg"
                    alt="Estudiantes"
                    className="absolute right-0 bottom-0 h-48 w-auto object-contain opacity-90 pointer-events-none"
                />

                {/* Create Group Form integrated in header */}
                <div className="mt-8 bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20 max-w-xl">
                    <form onSubmit={handleAddGroup} className="flex gap-2">
                        <input
                            type="text"
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                            placeholder="New Group Name (e.g., History 3B)"
                            className="flex-grow px-4 py-2 rounded-md bg-white/90 text-blue-900 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
                        />
                        <button
                            type="submit"
                            disabled={!newGroupName.trim()}
                            className="bg-red-700 text-white px-6 py-2 rounded-md hover:bg-red-600 transition font-bold shadow-lg flex items-center gap-2 disabled:opacity-50"
                        >
                            <Plus size={20} />
                            Create
                        </button>
                    </form>
                </div>
            </div>

            {/* Grid of Groups */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.length === 0 ? (
                    <div className="col-span-full text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-300">
                        <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <p className="text-xl text-gray-400 font-medium">No active groups.</p>
                        <p className="text-gray-400">Create a new one to get started.</p>
                    </div>
                ) : (
                    groups.map(group => (
                        <div key={group.id} className="group relative bg-white rounded-xl shadow-md border-t-4 border-blue-900 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                            <Link to={`/group/${group.id}`} className="block p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors">
                                        <Users className="w-8 h-8 text-blue-900" />
                                    </div>
                                    <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded-full">
                                        {group.students.length} Students
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2 truncate font-serif">{group.name}</h3>
                                <p className="text-sm text-gray-500">Click to enter</p>
                            </Link>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteGroup(group.id);
                                }}
                                className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                title="Delete group"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        <WhatsNewModal isOpen={isWhatsNewOpen} onClose={() => setIsWhatsNewOpen(false)} />
        </div>
    );
};

export default Dashboard;
