import React from "react";
import { formatNumberForDisplay } from "../logic/CalculatorEngine";
import "../styles/HistoryItem.css";

export default function HistoryItem({ item, onClick }) {
    return (
        <div className="history-item" onClick={onClick}>
            <div className="expression">
                {item.expression} =
            </div>

            <div className="result">
                {formatNumberForDisplay(item.result)}
            </div>
        </div>
    );
}
