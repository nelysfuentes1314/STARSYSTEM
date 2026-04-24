import React from 'react';

// Perfect 8-bit star
const NORMAL_STAR = [
    "       11       ",
    "      1331      ",
    "      1321      ",
    " 11111132111111 ",
    "  133333222221  ",
    "   1333222221   ",
    "    13322221    ",
    "   1322112221   ",
    "  13221  12221  ",
    "  1321    1221  ",
    "  111      111  "
];

const getStarDesign = (level) => {
    const design = {
        colors: { '1': 'black', '2': 'gray', '3': 'white' },
        scale: 1,
        className: 'pixel-art-render flex-shrink-0 animate-in zoom-in px-[1px]'
    };

    switch (level) {
        case 0: // Individual points (1-4)
            design.scale = 0.6;
            design.colors = {
                '1': 'hsl(45, 60%, 40%)',
                '2': 'hsl(45, 80%, 60%)',
                '3': 'hsl(45, 100%, 80%)'
            };
            design.className += ' opacity-80';
            break;
        case 1: // 5 pts (Level 1)
            design.scale = 1.0;
            design.colors = {
                '1': 'hsl(45, 90%, 30%)',
                '2': 'hsl(45, 100%, 50%)',
                '3': 'hsl(45, 100%, 80%)'
            };
            design.className += ' drop-shadow-md animate-bounce-slow';
            break;
        case 2: // 10 pts (Level 2 - Pro)
            design.scale = 1.4;
            design.colors = {
                '1': 'hsl(190, 80%, 30%)',
                '2': 'hsl(190, 90%, 60%)',
                '3': 'hsl(190, 100%, 90%)'
            };
            design.className += ' drop-shadow-lg';
            break;
        case 3: // 20 pts (Level 3)
            design.scale = 1.8;
            design.colors = {
                '1': 'hsl(280, 80%, 30%)',
                '2': 'hsl(280, 90%, 60%)',
                '3': 'hsl(280, 100%, 85%)'
            };
            design.className += ' drop-shadow-[0_0_8px_rgba(168,85,247,0.6)] animate-pulse';
            break;
        case 4: // 40 pts (Level 4)
            design.scale = 2.4;
            design.colors = {
                '1': 'hsl(0, 90%, 30%)',
                '2': 'hsl(0, 100%, 60%)',
                '3': 'hsl(0, 100%, 85%)'
            };
            design.className += ' drop-shadow-[0_0_12px_rgba(239,68,68,0.8)] animate-bounce';
            break;
        case 5: // 80 pts (Level 5)
            design.scale = 3.2;
            design.colors = {
                '1': 'hsl(140, 90%, 25%)',
                '2': 'hsl(140, 100%, 55%)',
                '3': 'hsl(140, 100%, 85%)'
            };
            design.className += ' drop-shadow-[0_0_20px_rgba(34,197,94,0.8)] animate-tweak';
            break;
        case 6: // 160 pts (Level 6 - Diamond)
            design.scale = 4.0;
            design.colors = {
                '1': 'hsl(190, 100%, 25%)',
                '2': 'hsl(180, 100%, 65%)',
                '3': 'hsl(180, 100%, 95%)'
            };
            design.className += ' drop-shadow-[0_0_25px_rgba(34,211,238,0.9)] animate-tweak';
            break;
        case 7: // 320 pts (Level 7 - Fire)
            design.scale = 4.8;
            design.colors = {
                '1': 'hsl(15, 100%, 35%)',
                '2': 'hsl(35, 100%, 60%)',
                '3': 'hsl(60, 100%, 80%)'
            };
            design.className += ' drop-shadow-[0_0_30px_rgba(249,115,22,1)] animate-pulse';
            break;
        case 8: // 640 pts (Level 8 - Amethyst)
            design.scale = 5.6;
            design.colors = {
                '1': 'hsl(290, 100%, 30%)',
                '2': 'hsl(300, 100%, 60%)',
                '3': 'hsl(320, 100%, 85%)'
            };
            design.className += ' drop-shadow-[0_0_35px_rgba(217,70,239,1)] animate-color-shift';
            break;
        case 9: // 1280 pts (Level 9 - Galactic)
            design.scale = 3.5; // Scaled down because it will be a 4-star cluster
            design.isCluster = true;
            design.colors = {
                '1': 'hsl(230, 100%, 20%)',
                '2': 'hsl(260, 100%, 60%)',
                '3': 'hsl(310, 100%, 90%)'
            };
            design.className += ' drop-shadow-[0_0_20px_rgba(139,92,246,1)] animate-tweak';
            break;
        default: // 2560+ pts (Level 10+)
            design.scale = 7.0 + (level - 10) * 0.5;
            design.colors = {
                '1': 'hsl(50, 100%, 30%)',
                '2': 'hsl(50, 100%, 60%)',
                '3': 'white'
            };
            design.className += ' drop-shadow-[0_0_50px_rgba(250,204,21,1)] animate-glow';
            break;
    }
    return design;
};

export const PixelStar = ({ level }) => {
    const design = getStarDesign(level);
    const height = NORMAL_STAR.length;
    const width = NORMAL_STAR[0].length;

    const renderStarSVG = () => (
        <svg
            viewBox={`0 0 ${width} ${height}`}
            style={{ width: `${width * design.scale}px`, height: `${height * design.scale}px` }}
            className={design.className}
            title={`Level ${level} Star`}
        >
            {NORMAL_STAR.map((row, y) =>
                row.split('').map((char, x) => {
                    if (char === ' ') return null;
                    return <rect key={`${x}-${y}`} x={x} y={y} width="1.05" height="1.05" fill={design.colors[char]} />;
                })
            )}
        </svg>
    );

    if (design.isCluster) {
        return (
            <div className="grid grid-cols-2 gap-1 animate-color-shift">
                {renderStarSVG()}
                {renderStarSVG()}
                {renderStarSVG()}
                {renderStarSVG()}
            </div>
        );
    }

    return renderStarSVG();
};

export const getStarsDistribution = (points) => {
    const distribution = [];

    // Level 0: individual points (0 to 4)
    const level0Count = points % 5;
    for (let i = 0; i < level0Count; i++) {
        distribution.push(0);
    }

    // Higher levels using binary representation of floor(points / 5)
    let baseStars = Math.floor(points / 5);
    let currentLevel = 1;

    while (baseStars > 0) {
        if (baseStars & 1) {
            distribution.push(currentLevel);
        }
        baseStars >>= 1;
        currentLevel++;
    }

    // Sort descending so bigger stars are on the left
    return distribution.sort((a, b) => b - a);
};

const EvolutionStar = ({ points }) => {
    const stars = getStarsDistribution(points);

    return (
        <div className="flex flex-wrap items-center justify-start w-full gap-2 px-1 py-1 min-h-[40px]">
            {points === 0 && <span className="text-gray-400 text-sm italic">No stars yet</span>}

            {stars.map((level, i) => (
                <div key={`${level}-${i}`} className="flex items-center justify-center">
                    <PixelStar level={level} />
                </div>
            ))}
        </div>
    );
};

export default EvolutionStar;
