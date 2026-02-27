import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { School } from 'lucide-react';
import Dashboard from './components/Dashboard';
import GroupDetail from './components/GroupDetail';
import DataManager from './components/DataManager';
import './index.css'

function App() {
  const [groups, setGroups] = useState(() => {
    const saved = localStorage.getItem('stars-system-data');
    return saved ? JSON.parse(saved) : [];
  });

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem('stars-system-data', JSON.stringify(groups));
  }, [groups]);

  const addGroup = (name) => {
    setGroups([...groups, {
      id: uuidv4(),
      name: name,
      students: []
    }]);
  };

  const deleteGroup = (groupId) => {
    setGroups(groups.filter(g => g.id !== groupId));
  };

  const addStudent = (groupId, name) => {
    setGroups(groups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          students: [...group.students, {
            id: uuidv4(),
            name: name,
            points: 0
          }]
        };
      }
      return group;
    }));
  };

  const deleteStudent = (groupId, studentId) => {
    setGroups(groups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          students: group.students.filter(s => s.id !== studentId)
        };
      }
      return group;
    }));
  };

  const updatePoints = (groupId, studentId, amount) => {
    setGroups(groups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          students: group.students.map(student => {
            if (student.id === studentId) {
              const newPoints = Math.max(0, student.points + amount);
              return { ...student, points: newPoints };
            }
            return student;
          })
        };
      }
      return group;
    }));
  };

  const loadData = (data) => {
    setGroups(data);
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-100 text-gray-800 font-sans selection:bg-red-200 selection:text-red-900">
        <header className="bg-white shadow-lg border-b-4 border-red-700 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition">
              <div className="bg-transparent p-0 flex items-center">
                <img src="/icons/LOGO.svg" alt="ISE Logo" className="h-16 w-auto object-contain mr-4" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-blue-900 leading-none">I.S.E Class Stars System</h1>
                <span className="text-xs text-red-600 font-bold uppercase tracking-wider">Star Management</span>
              </div>
            </Link>

            <DataManager groups={groups} onLoadData={loadData} />
          </div>
        </header>

        <main className="max-w-7xl mx-auto p-6 md:p-8">
          <Routes>
            <Route path="/" element={
              <Dashboard
                groups={groups}
                onAddGroup={addGroup}
                onDeleteGroup={deleteGroup}
              />
            } />
            <Route path="/group/:id" element={
              <GroupDetail
                groups={groups}
                onAddStudent={addStudent}
                onUpdatePoints={updatePoints}
                onDeleteStudent={deleteStudent}
              />
            } />
          </Routes>
        </main>

        <footer className="w-full bg-blue-900 text-white p-6 mt-12">
          <div className="max-w-7xl mx-auto text-center opacity-70 text-sm">
            <p>&copy; 2026 School Star System</p>
            <p className="mt-1 text-xs">Designed for academic excellence</p>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App
