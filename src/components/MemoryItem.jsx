import React from "react";
import { formatNumberForDisplay } from "../logic/CalculatorEngine";
import "../styles/MemoryItem.css";

export default function MemoryItem({ value, onClick }) {
    return (
        <div className="memory-item" onClick={onClick}>
            {formatNumberForDisplay(value)}
        </div>
    );
}
