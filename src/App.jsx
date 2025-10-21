import React, { useState, useEffect } from "react";
import "./styles/App.css";
import TopBar from "./components/TopBar";
import Display from "./components/Display";
import Keypad from "./components/Keypad";
import MemoryBar from "./components/MemoryBar";
import HistoryItem from "./components/HistoryItem";
import MemoryItem from "./components/MemoryItem";

import {
    formatNumberForDisplay,
    evaluateExpression,
    applyUnary,
    applyPercent
} from "./logic/CalculatorEngine";

export default function App() {
    const [display, setDisplay] = useState("0");
    const [expression, setExpression] = useState("");
    const [memoryList, setMemoryList] = useState([]);
    const [memoryFlag, setMemoryFlag] = useState(false);
    const [historyList, setHistoryList] = useState([]);
    const [error, setError] = useState(null);
    const [lastOperator, setLastOperator] = useState(null);
    const [lastOperand, setLastOperand] = useState(null);
    const [resultLocked, setResultLocked] = useState(false);
    const [activePanel, setActivePanel] = useState("history");
    const [rightPanelVisible, setRightPanelVisible] = useState(true);

    // Mobile
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleRightPanel = () => {
        if (isMobile) setMobileMenuOpen(prev => !prev);
        else setRightPanelVisible(prev => !prev);
    };

    // Detect resize
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            if (!mobile) setMobileMenuOpen(false);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    /* ==========================
       Basic Input Handlers
    =========================== */
    const inputDigit = (d) => {
        if (error) return;
        if (display.length >= 15 && !resultLocked) {
            setError("Overflow");
            setDisplay("Overflow");
            return;
        }
        if (resultLocked) {
            setDisplay(d === "." ? "0." : d);
            setExpression("");
            setResultLocked(false);
            return;
        }
        if (d === ".") {
            if (display.includes(".")) return;
            setDisplay(display === "0" || display === "" ? "0." : display + ".");
            return;
        }
        setDisplay(display === "0" ? d : display + d);
    };

    const clearAll = () => {
        setDisplay("0");
        setExpression("");
        setError(null);
        setResultLocked(false);
        setLastOperator(null);
        setLastOperand(null);
    };

    const clearEntry = () => {
        if (error) return clearAll();
        setDisplay("0");
    };

    const backspace = () => {
        if (error) return clearAll();
        setResultLocked(false);
        setDisplay((prev) =>
            prev.length <= 1 || (prev.length === 2 && prev.startsWith("-")) ? "0" : prev.slice(0, -1)
        );
    };

    /* ==========================
       Unary / Percent / Operator
    =========================== */
    const handleUnary = (op) => {
        if (error) return;
        const result = applyUnary(op, display);
        if (["Error", "Cannot divide by zero", "Overflow"].includes(result)) {
            setError(result);
            setDisplay(result);
            return;
        }
        let exprText = "";
        switch (op) {
            case "sqrt": exprText = `√(${display})`; break;
            case "square": exprText = `sqr(${display})`; break;
            case "inverse": exprText = `1/(${display})`; break;
            default: exprText = `${op}(${display})`;
        }
        setExpression(exprText);
        setDisplay(String(result));
        setResultLocked(true);
        setHistoryList(prev => [{ expression: exprText.replace(" =", ""), result }, ...prev]);
    };

    const handlePercent = () => {
        if (error) return;
        const result = applyPercent(display);
        setDisplay(String(result));
    };

    const handleOperator = (op) => {
        if (error) return;
        if (resultLocked) {
            setExpression(display + " " + op);
            setResultLocked(false);
        } else {
            setExpression(prev => prev ? prev + " " + display + " " + op : display + " " + op);
        }
        setDisplay("0");
        setLastOperator(op);
    };

    const handleEqual = () => {
        if (error) return;
        let exprToEval = expression;
        if (!resultLocked) {
            exprToEval = expression ? expression + " " + display : display;
            setExpression(exprToEval);
        } else if (lastOperator && lastOperand) {
            exprToEval = display + " " + lastOperator + " " + lastOperand;
        }

        const result = evaluateExpression(exprToEval);
        if (["Cannot divide by zero", "Error"].includes(result)) {
            setError(result);
            setDisplay(result);
        } else {
            setDisplay(String(result));
            setResultLocked(true);
            setLastOperand(display);
            setHistoryList(prev => [{ expression: exprToEval, result }, ...prev]);
        }
    };

    /* ==========================
       Memory Functions
    =========================== */
    const recallMemoryItem = (val) => {
        setDisplay(String(val));
        setResultLocked(false);
    };

    const memoryClear = () => {
        setMemoryList([]);
        setMemoryFlag(false);
    };

    const memoryRecall = () => {
        if (memoryList.length === 0) return;
        setDisplay(String(memoryList[0]));
        setResultLocked(false);
    };

    const memoryStore = () => {
        const val = Number(display);
        setMemoryList(prev => [val, ...prev]);
        setMemoryFlag(true);
        setResultLocked(false);
    };

    const memoryAdd = () => {
        if (memoryList.length === 0) return memoryStore();
        const updated = [...memoryList];
        updated[0] += Number(display);
        setMemoryList(updated);
    };

    const memorySubtract = () => {
        if (memoryList.length === 0) return memoryStore();
        const updated = [...memoryList];
        updated[0] -= Number(display);
        setMemoryList(updated);
    };

    const togglePanel = (panel) => setActivePanel(panel);

    const recallHistoryItem = (item) => {
        setDisplay(String(item.result));
        setResultLocked(false);
    };

    /* ==========================
       Action Map
    =========================== */
    const actions = {
        inputDigit,
        clearAll,
        clearEntry,
        backspace,
        toggleSign: () =>
            setDisplay(display.startsWith("-") ? display.slice(1) : "-" + display),
        handleUnary,
        handlePercent,
        handleOperator,
        handleEqual,
        memoryClear,
        memoryRecall,
        memoryStore,
        memoryAdd,
        memorySubtract,
        togglePanel
    };

    /* ==========================
       JSX Layout
    =========================== */
    const showRightPanel = (!isMobile && rightPanelVisible) || (isMobile && mobileMenuOpen);

    return (
        <div className="calculator-root">
            <div className="calculator">
                {/* LEFT PANEL */}
                <div className="left-panel">
                    <TopBar activePanel={activePanel} togglePanel={togglePanel} toggleRightPanel={toggleRightPanel} />

                    <Display
                        display={display}
                        memoryFlag={memoryFlag}
                        formatNumberForDisplay={formatNumberForDisplay}
                        expression={expression}
                        resultLocked={resultLocked}
                    />

                    <MemoryBar actions={actions} />
                    <Keypad actions={actions} />
                </div>

                {/* RIGHT PANEL */}
                <div
                    className={`right-panel ${(!isMobile && rightPanelVisible) ||
                        (isMobile && mobileMenuOpen) ? "mobile-toggle" : "hidden"
                        }`}
                >
                    <div className="panel-toggle">
                        <button
                            className={activePanel === "history" ? "active" : ""}
                            onClick={() => togglePanel("history")}
                        >
                            History
                        </button>
                        <button
                            className={activePanel === "memory" ? "active" : ""}
                            onClick={() => togglePanel("memory")}
                        >
                            Memory
                        </button>
                    </div>

                    {/* HISTORY SECTION */}
                    <div className={`panel-section ${activePanel === "history" ? "show" : ""}`}>
                        <h3>History</h3>
                        {historyList.length === 0 ? (
                            <div className="history-empty">There's no history yet</div>
                        ) : (
                            historyList.map((item, idx) => (
                                <HistoryItem
                                    key={idx}
                                    item={item}
                                    onClick={() => recallHistoryItem(item)}
                                />
                            ))
                        )}
                    </div>

                    {/* MEMORY SECTION */}
                    <div className={`panel-section ${activePanel === "memory" ? "show" : ""}`}>
                        <h3>Memory</h3>
                        {memoryList.length === 0 ? (
                            <div className="memory-empty">No memory stored</div>
                        ) : (
                            memoryList.map((m, i) => (
                                <MemoryItem
                                    key={i}
                                    value={m}
                                    onClick={() => recallMemoryItem(m)}
                                />
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
