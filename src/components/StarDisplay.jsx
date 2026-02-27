import React from 'react';
import EvolutionStar from './EvolutionStar';

const StarDisplay = ({ points, label = "Group Total" }) => {
    return (
        <div className="flex flex-col items-center p-4 bg-blue-50/50 rounded-xl border border-blue-100">
            <span className="text-sm font-semibold text-blue-800 tracking-wider uppercase mb-2">
                {label} (★ {points})
            </span>
            <EvolutionStar points={points} />
            {points === 0 && <span className="text-gray-400 text-sm italic mt-2">No stars yet</span>}
        </div>
    );
};

export default StarDisplay;
