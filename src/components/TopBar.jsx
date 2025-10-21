import React from "react";
import "../styles/TopBar.css";

export default function TopBar() {
    return (
        <div className="topbar">
            <div className="left">
                <button className="hamburger" aria-label="Menu">≡</button>
                <div className="mode">Standard</div>
            </div>
            <div className="right">
                <button className="window-btn" aria-label="History">🕒</button>
            </div>
        </div>
    );
}
