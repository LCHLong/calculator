import React from "react";
import "../styles/Display.css";
import { formatNumberForDisplay } from "../logic/CalculatorEngine";

export default function Display({ display, expression, memoryFlag, resultLocked }) {
    return (
        <div className="display-area">
            <div className="memory-indicator">{memoryFlag ? "M" : ""}</div>

            <div className="expression">
                {expression ? `${expression}${resultLocked ? " =" : ""}` : ""}
            </div>

            <div
                className="display"
                role="textbox"
                aria-live="polite"
                data-testid="display"
            >
                {formatNumberForDisplay(display)}
            </div>
        </div>
    );
}
