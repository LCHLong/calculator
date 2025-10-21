import React from "react";
import "../styles/Display.css";

/**
 * Component hiển thị màn hình máy tính:
 *  - Dòng trên: phép toán hiện tại (expression)
 *  - Dòng dưới: giá trị đang nhập hoặc kết quả (display)
 *  - Góc trái: ký hiệu bộ nhớ (M)
 */
export default function Display({
    display,
    memoryFlag,
    formatNumberForDisplay,
    expression
}) {
    return (
        <div className="display-area">
            <div className="memory-indicator">{memoryFlag ? "M" : ""}</div>

            {/* Dòng trên - phép toán hiện tại */}
            <div className="expression">{expression}</div>

            {/* Dòng dưới - giá trị đang nhập / kết quả */}
            <div className="display" role="textbox" aria-live="polite">
                {formatNumberForDisplay(display)}
            </div>
        </div>
    );
}
