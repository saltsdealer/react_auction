// DynamicTable.jsx
import React from 'react';

const DynamicTable = ({ data }) => {
    if (!data || data.length === 0 || typeof data !== 'object') {
        return <p>No data to display.</p>;
    }

    const headers = Object.keys(data[0]);

    return (
        <table>
            <thead>
                <tr>
                    {headers.map((header, index) => (
                        <th key={index}>{header}</th> // JSX - dynamic creation of <th> elements
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {headers.map((header, colIndex) => (
                            <td key={colIndex}>{row[header]}</td> // JSX - dynamic creation of <td> elements
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default DynamicTable;
