"use client"


import { useState, useRef } from 'react';

const Spreadsheet = () => {
    const [cells, setCells] = useState(
        Array.from({ length: 1000 }, (_, index) => ({
            value: '',
            formatting: { textAlign: 'center' },
            validation: index % 2 === 0 ? { type: 'numeric' } : { type: 'text', pattern: '^[a-zA-Z]+$' }
        }))
    );
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCell, setSelectedCell] = useState(null);
    const undoStack = useRef([]);
    const redoStack = useRef([]);
    const [currentPage, setCurrentPage] = useState(0);

    const cellsPerPage = 50;
    const totalPages = Math.ceil(cells.length / cellsPerPage);

    const handleChange = (index, value) => {
        const validation = cells[index].validation;

        if (validation) {
            if (validation.type === 'numeric' && isNaN(value)) {
                alert('This cell only accepts numeric values.');
                return;
            }
            if (validation.type === 'text' && !new RegExp(validation.pattern).test(value)) {
                alert('This cell only accepts letters.');
                return;
            }
        }

        undoStack.current.push([...cells]);
        redoStack.current = [];

        const newCells = [...cells];
        newCells[index] = { ...newCells[index], value: value };
        setCells(newCells);
    };

    const handleCellClick = (index) => {
        setSelectedCell(index);
    };

    const applyFormatToSelected = (format) => {
        if (selectedCell !== null) {
            undoStack.current.push([...cells]);
            redoStack.current = [];

            const newCells = [...cells];
            newCells[selectedCell] = { ...newCells[selectedCell], formatting: { ...newCells[selectedCell].formatting, ...format } };
            setCells(newCells);
        } else {
            alert("Please select a cell first.");
        }
    };

    // Undo
    const undo = () => {
        if (undoStack.current.length > 0) {
            redoStack.current.push([...cells]);
            const previousState = undoStack.current.pop();
            setCells(previousState);
        }
    };

    // Redo 
    const redo = () => {
        if (redoStack.current.length > 0) {
            undoStack.current.push([...cells]);
            const nextState = redoStack.current.pop();
            setCells(nextState);
        }
    };

    // Handle pagination
    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const start = currentPage * cellsPerPage;
    const end = start + cellsPerPage;
    const paginatedCells = cells.slice(start, end);

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-2 border rounded"
                />
                <div>
                    <button onClick={undo} className="m-2 p-2 bg-gray-300 rounded">
                        Undo
                    </button>
                    <button onClick={redo} className="m-2 p-2 bg-gray-300 rounded">
                        Redo
                    </button>
                    <button onClick={() => applyFormatToSelected({ textAlign: 'left' })} className="m-2 p-2 bg-gray-300 rounded">
                        Align Left
                    </button>
                    <button onClick={() => applyFormatToSelected({ textAlign: 'center' })} className="m-2 p-2 bg-gray-300 rounded">
                        Align Center
                    </button>
                    <button onClick={() => applyFormatToSelected({ textAlign: 'right' })} className="m-2 p-2 bg-gray-300 rounded">
                        Align Right
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2  gap-1">
                {paginatedCells.map((cell, index) => (
                    <input
                        key={index}
                        type="text"
                        value={cell.value}
                        onChange={(e) => handleChange(start + index, e.target.value)}
                        onClick={() => handleCellClick(start + index)}
                        style={cell.formatting}
                        className={`w-full text-center p-2 border rounded ${selectedCell === start + index ? 'bg-yellow-100' : ''}`}
                    />
                ))}
            </div>

            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 0}
                    className="m-2 p-2 bg-blue-300 rounded disabled:bg-gray-300"
                >
                    Previous
                </button>
                <span>
                    Page {currentPage + 1} of {totalPages}
                </span>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages - 1}
                    className="m-2 p-2 bg-blue-300 rounded disabled:bg-gray-300"
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default Spreadsheet