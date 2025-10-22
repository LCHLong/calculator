import React, { useEffect, useRef, useState } from "react";
import "../styles/Display.css";
import { formatNumberForDisplay } from "../logic/CalculatorEngine";

export default function Display({ display, expression, memoryFlag, resultLocked }) {
    const containerRef = useRef(null);
    const contentRef = useRef(null);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const container = containerRef.current;
        const content = contentRef.current;
        if (!container || !content) return;

        // chiều rộng container và nội dung
        const containerWidth = container.clientWidth;
        const contentWidth = content.scrollWidth;

        const newScale = contentWidth > containerWidth ? containerWidth / contentWidth : 1;
        setScale(newScale);
    }, [display]);

    return (
        <div className="display-area">
            <div className="memory-indicator">{memoryFlag ? "M" : ""}</div>
            <div className="expression">{expression ? `${expression}${resultLocked ? " =" : ""}` : ""}</div>

            <div className="display-wrapper" ref={containerRef}>
                <div
                    className="display"
                    ref={contentRef}
                    style={{ transform: `scale(${scale})`, transformOrigin: "right center" }}
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
