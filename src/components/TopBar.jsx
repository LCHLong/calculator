import React from "react";
import "../styles/TopBar.css";

export default function TopBar({ activePanel, togglePanel, toggleRightPanel }) {
    return (
        <div className="topbar">
            <div className="left">
                <button className="hamburger" aria-label="Menu">≡</button>
                <div className="mode">Standard</div>
            </div>

            <div className="right">
                {/* Nút Kebab chỉ hiện trên mobile */}
                <button
                    className="kebab-btn mobile-only"
                    aria-label="More"
                    onClick={toggleRightPanel}
                >
                    ⋮
                </button>
            </div>
        </div>
    );
}
