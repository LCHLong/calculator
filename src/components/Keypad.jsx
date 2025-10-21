import React from "react";
import "../styles/Keypad.css";
import Button from "./Button";

export default function Keypad({ actions }) {
    const {
        inputDigit, clearEntry, clearAll, backspace,
        toggleSign, handleUnary, handlePercent,
        handleOperator, handleEqual,
        memoryClear, memoryRecall, memoryStore, memoryAdd, memorySubtract
    } = actions;

    return (
        <div className="keypad">
            <div className="row">
                <Button label="%" className="func" onClick={handlePercent} />
                <Button label="CE" className="func" onClick={clearEntry} />
                <Button label="C" className="func" onClick={clearAll} />
                <Button label="←" className="func" onClick={backspace} />
            </div>

            <div className="row">
                <Button label="1/x" className="func" onClick={() => handleUnary("inverse")} />
                <Button label="x²" className="func" onClick={() => handleUnary("square")} />
                <Button label="√x" className="func" onClick={() => handleUnary("sqrt")} />
                <Button label="÷" className="op" onClick={() => handleOperator("÷")} />
            </div>

            <div className="row">
                <Button label="7" onClick={() => inputDigit("7")} />
                <Button label="8" onClick={() => inputDigit("8")} />
                <Button label="9" onClick={() => inputDigit("9")} />
                <Button label="×" className="op" onClick={() => handleOperator("×")} />
            </div>

            <div className="row">
                <Button label="4" onClick={() => inputDigit("4")} />
                <Button label="5" onClick={() => inputDigit("5")} />
                <Button label="6" onClick={() => inputDigit("6")} />
                <Button label="−" className="op" onClick={() => handleOperator("−")} />
            </div>

            <div className="row">
                <Button label="1" onClick={() => inputDigit("1")} />
                <Button label="2" onClick={() => inputDigit("2")} />
                <Button label="3" onClick={() => inputDigit("3")} />
                <Button label="+" className="op" onClick={() => handleOperator("+")} />
            </div>

            <div className="row">
                <Button label="+／−" className="func pretty-sign" onClick={toggleSign} />
                <Button label="0" onClick={() => inputDigit("0")} />
                <Button label="." onClick={() => inputDigit(".")} />
                <Button label="=" className="equals" onClick={handleEqual} />
            </div>
        </div>
    );
}
