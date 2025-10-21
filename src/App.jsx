import React, { useState, useRef } from "react";
import "./styles/App.css";
import TopBar from "./components/TopBar";
import Display from "./components/Display";
import Keypad from "./components/Keypad";
import {
    formatNumberForDisplay,
    evaluateExpression,
    applyUnary,
    applyPercent
} from "./logic/CalculatorEngine";

export default function App() {
    const [display, setDisplay] = useState("0");
    const [expression, setExpression] = useState("");
    const [memoryFlag, setMemoryFlag] = useState(false);
    const memoryRef = useRef(0);
    const [error, setError] = useState(null);
    const [lastOperator, setLastOperator] = useState(null);
    const [lastOperand, setLastOperand] = useState(null);
    const [resultLocked, setResultLocked] = useState(false);

    /* ======== INPUT ======== */
    const inputDigit = (d) => {
        if (error) return;
        if (resultLocked) {
            setDisplay(d === "." ? "0." : d);
            setExpression("");
            setResultLocked(false);
            return;
        }
        if (display === "0" && d !== ".") setDisplay(d);
        else if (d === "." && display.includes(".")) return;
        else setDisplay((prev) => prev + d);
    };

    /* ======== CLEAR ======== */
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

    /* ======== BACKSPACE ======== */
    const backspace = () => {
        if (error) return clearAll();
        setResultLocked(false); // <-- thêm dòng này để cho phép xóa sau khi nhấn =
        setDisplay((prev) =>
            prev.length <= 1 || (prev.length === 2 && prev.startsWith("-")) ? "0" : prev.slice(0, -1)
        );
    };


    /* ======== TOÁN TỬ 1 NGÔI ======== */
    const handleUnary = (op) => {
        if (error) return;
        const result = applyUnary(op, display);
        if (["Error", "Cannot divide by zero", "Overflow"].includes(result)) {
            setError(result);
            setDisplay(result);
            return;
        }
        setDisplay(String(result));
    };

    /* ======== PERCENT ======== */
    const handlePercent = () => {
        if (error) return;
        const result = applyPercent(display);
        setDisplay(String(result));
    };

    /* ======== TOÁN TỬ 2 NGÔI ======== */
    const handleOperator = (op) => {
        if (error) return;
        if (resultLocked) {
            setExpression(display + " " + op);
            setResultLocked(false);
        } else {
            setExpression((prev) => (prev ? prev + " " + display + " " + op : display + " " + op));
        }
        setDisplay("0");
        setLastOperator(op);
    };

    /* ======== DẤU = ======== */
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
        }
    };

    /* ======== BỘ NHỚ ======== */
    const memoryClear = () => { memoryRef.current = 0; setMemoryFlag(false); };
    const memoryRecall = () => { setDisplay(String(memoryRef.current)); setResultLocked(false); };
    const memoryStore = () => { memoryRef.current = Number(display); setMemoryFlag(true); setResultLocked(false); };
    const memoryAdd = () => { memoryRef.current += Number(display); setMemoryFlag(true); };
    const memorySubtract = () => { memoryRef.current -= Number(display); setMemoryFlag(true); };

    /* ======== ACTIONS ======== */
    const actions = {
        inputDigit, clearAll, clearEntry, backspace,
        toggleSign: () => setDisplay(display.startsWith("-") ? display.slice(1) : "-" + display),
        handleUnary, handlePercent,
        handleOperator, handleEqual,
        memoryClear, memoryRecall, memoryStore, memoryAdd, memorySubtract
    };

    return (
        <div className="calculator-root">
            <div className="calculator">
                <TopBar />
                <Display
                    display={display}
                    memoryFlag={memoryFlag}
                    formatNumberForDisplay={formatNumberForDisplay}
                    expression={expression}
                />
                <Keypad actions={actions} />
                <div className="footer-note">
                    Calculator_IA — <span>Scientific</span> Mode
                </div>
            </div>
        </div>
    );
}
