import React, { useRef } from 'react';
import { Download, Upload } from 'lucide-react';

const DataManager = ({ groups, onLoadData }) => {
    const fileInputRef = useRef(null);

    const handleExport = () => {
        const dataStr = JSON.stringify(groups, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const exportFileDefaultName = 'stars_system_data.json';

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const handleImportClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const fileReader = new FileReader();
        const file = event.target.files[0];

        if (!file) return;

        fileReader.readAsText(file, "UTF-8");
        fileReader.onload = (e) => {
            try {
                const parsedData = JSON.parse(e.target.result);
                if (Array.isArray(parsedData)) {
                    onLoadData(parsedData);
                    alert('Data loaded successfully.');
                } else {
                    alert('The file format is incorrect (must be a list of groups).');
                }
            } catch (error) {
                console.error("Error parsing JSON:", error);
                alert('Error reading the file. Make sure it is a valid JSON.');
            }
            // Reset input so same file can be selected again if needed
            event.target.value = null;
        };
    };

    return (
        <div className="flex gap-2">
            <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition font-medium"
            >
                <Download size={18} />
                Export Data
            </button>

            <button
                onClick={handleImportClick}
                className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition font-medium"
            >
                <Upload size={18} />
                Import Data
            </button>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                className="hidden"
            />
        </div>
    );
};

export default DataManager;
