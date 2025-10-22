import React, { useEffect, useRef, useState } from "react";
import "../styles/Display.css";
import { formatNumberForDisplay } from "../logic/CalculatorEngine";

export default function Display({ display, expression, memoryFlag, resultLocked }) {
    const containerRef = useRef(null);
    const contentRef = useRef(null);
    const [fontSize, setFontSize] = useState(64); // mặc định 4rem = 64px

    useEffect(() => {
        const container = containerRef.current;
        const content = contentRef.current;
        if (!container || !content) return;

        let minFont = 12;
        let maxFont = 64;
        let font = maxFont;

        content.style.fontSize = `${font}px`;

        // Binary search cho font-size phù hợp
        while (minFont <= maxFont) {
            content.style.fontSize = `${font}px`;
            const contentWidth = content.scrollWidth;
            const containerWidth = container.clientWidth;

            if (contentWidth > containerWidth) {
                maxFont = font - 1;
            } else {
                minFont = font + 1;
            }
            font = Math.floor((minFont + maxFont) / 2);
        }

        setFontSize(font);
    }, [display]);


    return (
        <div className="display-area">
            <div className="memory-indicator">{memoryFlag ? "M" : ""}</div>
            <div className="expression">{expression ? `${expression}${resultLocked ? " =" : ""}` : ""}</div>

            <div className="display-wrapper" ref={containerRef}>
                <div
                    className="display"
                    ref={contentRef}
                    style={{ fontSize: `${fontSize}px` }}
                    role="textbox"
                    aria-live="polite"
                    data-testid="display"
                >
                    {formatNumberForDisplay(display)}
                </div>
            </div>
        </div>
    );
}
