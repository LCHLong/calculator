import React from "react";
import "../styles/MemoryBar.css";

export default function MemoryBar({ actions }) {
    const { memoryClear, memoryRecall, memoryAdd, memorySubtract, memoryStore } = actions;

    return (
        <div className="memory-bar">
            <button onClick={memoryClear}>MC</button>
            <button onClick={memoryRecall}>MR</button>
            <button onClick={memoryAdd}>M+</button>
            <button onClick={memorySubtract}>M-</button>
            <button onClick={memoryStore}>MS</button>
        </div>
    );
}
