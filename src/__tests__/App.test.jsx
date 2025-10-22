/**
 * src/__tests__/App.detailed.test.jsx
 * Async-safe Vitest + React Testing Library tests for Calculator UI
 */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { describe, test, expect } from "vitest";
import {
    evaluateExpression,
    applyUnary,
    applyPercent,
    formatNumberForDisplay
} from "../logic/CalculatorEngine";

// helper: click a sequence of characters (digits and dot)
const clickSequence = async (seq, user) => {
    for (const ch of seq) {
        if (ch === " ") continue;
        await user.click(screen.getByText(ch));
    }
};

// ===== Unit tests for CalculatorEngine =====
describe("CalculatorEngine (unit)", () => {
    test("evaluateExpression basic math", () => {
        expect(evaluateExpression("2+3")).toBe(5);
        expect(evaluateExpression("6 ÷ 2")).toBe(3);
        expect(evaluateExpression("7 × 8")).toBe(56);
        expect(evaluateExpression("9 − 4")).toBe(5);
    });

    test("evaluateExpression handles decimals", () => {
        expect(evaluateExpression("1.5+2")).toBeCloseTo(3.5);
        expect(evaluateExpression("5.5−2.2")).toBeCloseTo(3.3);
    });

    test("evaluateExpression handles basic arithmetic only", () => {
        expect(evaluateExpression("2+3")).toBe(5);
        expect(evaluateExpression("6 ÷ 2")).toBe(3);
    });

    test("applyUnary handles sqrt, square, inverse", () => {
        expect(applyUnary("sqrt", 9)).toBe(3);
        expect(applyUnary("square", 3)).toBe(9);
        expect(applyUnary("inverse", 4)).toBeCloseTo(0.25);
    });

    test("applyUnary handles negative input for sqrt as Error", () => {
        expect(applyUnary("sqrt", -9)).toBe("Error");
    });

    test("applyPercent converts number to fraction", () => {
        expect(applyPercent(50)).toBe(0.5);
        expect(applyPercent(0)).toBe(0);
    });

    test("evaluateExpression handles division by zero", () => {
        const result = evaluateExpression("5 ÷ 0");
        expect(result).toBe("Cannot divide by zero");
    });

    test("evaluateExpression handles negative numbers", () => {
        expect(evaluateExpression("-5+2")).toBe(-3);
        expect(evaluateExpression("−5 × 2")).toBe(-10);
    });

    test("formatNumberForDisplay formats with commas", () => {
        const out = formatNumberForDisplay(1234567);
        expect(out).toBe("1,234,567");
    });

    test("formatNumberForDisplay small numbers", () => {
        const out = formatNumberForDisplay(0.000000123);
        expect(out.toLowerCase()).toContain("e");
    });

    test("formatNumberForDisplay overflow and underflow", () => {
        const tooLarge = formatNumberForDisplay(1e100);
        expect(tooLarge).toMatch(/overflow|e\+/i);

        const tooSmall = formatNumberForDisplay(1e-20);
        expect(tooSmall.toLowerCase()).toContain("e");
    });

    test("formatNumberForDisplay trims long decimals", () => {
        const out = formatNumberForDisplay(1.234567891011);
        // nên chỉ còn 10 chữ số sau dấu .
        const decimalPart = out.split(".")[1];
        expect(decimalPart.length).toBeLessThanOrEqual(10);
    });

    test("formatNumberForDisplay handles string inputs gracefully", () => {
        expect(formatNumberForDisplay("Error")).toBe("Error");
        expect(formatNumberForDisplay("Cannot divide by zero")).toBe("Cannot divide by zero");
        expect(formatNumberForDisplay("Overflow")).toBe("Overflow");
    });
});

describe("Calculator UI — detailed (async-safe)", () => {
    test("basic addition 1 + 2 = 3", async () => {
        const user = userEvent.setup();
        render(<App />);
        await user.click(screen.getByText("1"));
        await user.click(screen.getByText("+"));
        await user.click(screen.getByText("2"));
        await user.click(screen.getByText("="));
        expect(screen.getByTestId("display")).toHaveTextContent("3");
    });

    test("basic subtraction 5 − 3 = 2", async () => {
        const user = userEvent.setup();
        render(<App />);
        await user.click(screen.getByText("5"));
        await user.click(screen.getByText("−"));
        await user.click(screen.getByText("3"));
        await user.click(screen.getByText("="));
        expect(screen.getByTestId("display")).toHaveTextContent("2");
    });

    test("basic multiply 7 × 8 = 56", async () => {
        const user = userEvent.setup();
        render(<App />);
        await user.click(screen.getByText("7"));
        await user.click(screen.getByText("×"));
        await user.click(screen.getByText("8"));
        await user.click(screen.getByText("="));
        expect(screen.getByTestId("display")).toHaveTextContent("56");
    });

    test("basic divide 9 ÷ 3 = 3", async () => {
        const user = userEvent.setup();
        render(<App />);
        await user.click(screen.getByText("9"));
        await user.click(screen.getByText("÷"));
        await user.click(screen.getByText("3"));
        await user.click(screen.getByText("="));
        expect(screen.getByTestId("display")).toHaveTextContent("3");
    });

    test("decimal calculation 1.5 + 2 = 3.5", async () => {
        const user = userEvent.setup();
        render(<App />);
        await clickSequence("1.5+2=", user);
        expect(screen.getByTestId("display")).toHaveTextContent("3.5");
    });

    test("pressing operator first should not crash (starts with 0)", async () => {
        const user = userEvent.setup();
        render(<App />);
        await user.click(screen.getByText("+"));
        await user.click(screen.getByText("5"));
        await user.click(screen.getByText("="));
        expect(screen.getByTestId("display")).toHaveTextContent("5");
    });

    test("chaining multiple operations (2 + 3 × 4 = 14)", async () => {
        const user = userEvent.setup();
        render(<App />);
        await user.click(screen.getByText("2"));
        await user.click(screen.getByText("+"));
        await user.click(screen.getByText("3"));
        await user.click(screen.getByText("×"));
        await user.click(screen.getByText("4"));
        await user.click(screen.getByText("="));
        expect(screen.getByTestId("display")).toHaveTextContent("14");
    });

    test("handles mixed operations with decimals correctly (5.5 × 2 − 1 = 10)", async () => {
        const user = userEvent.setup();
        render(<App />);
        await user.click(screen.getByText("5"));
        await user.click(screen.getByText("."));
        await user.click(screen.getByText("5"));
        await user.click(screen.getByText("×"));
        await user.click(screen.getByText("2"));
        await user.click(screen.getByText("−"));
        await user.click(screen.getByText("1"));
        await user.click(screen.getByText("="));
        expect(screen.getByTestId("display")).toHaveTextContent("10");
    });

    test("pressing multiple zeros before a number shows only one leading zero", async () => {
        const user = userEvent.setup();
        render(<App />);
        await user.click(screen.getAllByText("0")[0]);
        await user.click(screen.getAllByText("0")[0]);
        await user.click(screen.getByText("5"));
        expect(screen.getByTestId("display")).toHaveTextContent("5");
    });

    test("toggle sign (+/-) works", async () => {
        const user = userEvent.setup();
        render(<App />);
        await user.click(screen.getByText("5"));
        await user.click(screen.getByText("+/-"));
        expect(screen.getByTestId("display")).toHaveTextContent("-5");
        await user.click(screen.getByText("+/-"));
        expect(screen.getByTestId("display")).toHaveTextContent("5");
    });

    test("percent % converts 50 → 0.5", async () => {
        const user = userEvent.setup();
        render(<App />);
        await clickSequence("50%", user);
        expect(screen.getByTestId("display")).toHaveTextContent("0.5");
    });

    test("square root (√9 = 3)", async () => {
        const user = userEvent.setup();
        render(<App />);

        await user.click(screen.getByText("9"));
        await user.click(screen.getByText("√x"));

        const display = await screen.findByTestId("display");
        expect(display.textContent).toMatch(3);
    });

    test("square (3² = 9)", async () => {
        const user = userEvent.setup();
        render(<App />);

        await user.click(screen.getByText("3"));
        await user.click(screen.getByText("x²"));

        const display = await screen.findByTestId("display");
        expect(display.textContent).toMatch(9);
    });

    test("inverse (1/2 = 0.5)", async () => {
        const user = userEvent.setup();
        render(<App />);

        await user.click(screen.getByText("2"));
        await user.click(screen.getByText("1/x"));

        const display = await screen.findByTestId("display");
        expect(display.textContent).toMatch(/0\.5/);
    });

    test("division by zero shows error", async () => {
        const user = userEvent.setup();
        render(<App />);

        await user.click(screen.getByText("5"));
        await user.click(screen.getByText("÷"));
        await user.click(screen.getAllByText("0")[0]);
        await user.click(screen.getByText("="));

        const display = await screen.findByTestId("display");
        expect(display).toHaveTextContent(/Cannot divide by zero/i);
    });


    test("CE (clear entry) vs C (clear all)", async () => {
        const user = userEvent.setup();
        render(<App />);
        await clickSequence("12", user);
        await user.click(screen.getByText("CE"));
        expect(screen.getByTestId("display")).toHaveTextContent("0");

        await clickSequence("9+1", user);
        await user.click(screen.getByText("C"));
        expect(screen.getByTestId("display")).toHaveTextContent("0");
    });

    test("backspace removes last digit", async () => {
        const user = userEvent.setup();
        render(<App />);
        await clickSequence("123", user);
        await user.click(screen.getByText("←"));
        expect(screen.getByTestId("display")).toHaveTextContent("12");
        await user.click(screen.getByText("←"));
        await user.click(screen.getByText("←"));
        expect(screen.getByTestId("display")).toHaveTextContent("0");
    });

    test("memory store / recall / add / subtract / clear", async () => {
        const user = userEvent.setup();
        render(<App />);

        await user.click(screen.getByText("7"));
        await user.click(screen.getByText("MS"));
        await user.click(screen.getByText("MR"));
        expect(screen.getByTestId("display")).toHaveTextContent("7");

        await user.click(screen.getByText("C"));
        await user.click(screen.getByText("3"));
        await user.click(screen.getByText("M+"));
        await user.click(screen.getByText("MR"));
        expect(screen.getByTestId("display")).toHaveTextContent(/10/);

        await user.click(screen.getByText("C"));
        await user.click(screen.getByText("4"));
        await user.click(screen.getByText("M-"));
        await user.click(screen.getByText("MR"));
        expect(screen.getByTestId("display")).toHaveTextContent(/6/);

        await user.click(screen.getByText("MC"));
        await user.click(screen.getByText("MR"));
        expect(screen.getByTestId("display")).toBeTruthy();
    });

    test("memory recall after clear entry still works", async () => {
        const user = userEvent.setup();
        render(<App />);
        await user.click(screen.getByText("9"));
        await user.click(screen.getByText("MS"));
        await user.click(screen.getByText("C"));
        await user.click(screen.getByText("MR"));
        expect(screen.getByTestId("display")).toHaveTextContent("9");
    });

    test("history records expressions and recall", async () => {
        const user = userEvent.setup();
        render(<App />);

        await user.click(screen.getByText("1"));
        await user.click(screen.getByText("+"));
        await user.click(screen.getByText("2"));
        await user.click(screen.getByText("="));

        const matches = screen.getAllByText(/1\s*\+\s*2\s*=/);
        const historyItem = matches[matches.length - 1];

        await user.click(historyItem);
        expect(screen.getByTestId("display")).toHaveTextContent("3");
    });


    test("repeat = repeats last operation", async () => {
        const user = userEvent.setup();
        render(<App />);
        await user.click(screen.getByText("2"));
        await user.click(screen.getByText("+"));
        await user.click(screen.getByText("3"));
        await user.click(screen.getByText("="));
        expect(screen.getByTestId("display")).toHaveTextContent("5");
        await user.click(screen.getByText("="));
        expect(screen.getByTestId("display")).toHaveTextContent("8");
        await user.click(screen.getByText("="));
        expect(screen.getByTestId("display")).toHaveTextContent("11");
    });

    test("large number formatting with commas", async () => {
        const user = userEvent.setup();
        render(<App />);
        await clickSequence("1000000", user);
        expect(screen.getByTestId("display")).toHaveTextContent("1,000,000");
    });

    test("shows large numbers in scientific notation", async () => {
        const user = userEvent.setup();
        render(<App />);

        await user.click(screen.getByText("1"));
        for (let i = 0; i < 20; i++) {
            await user.click(screen.getByText("×"));
            await user.click(screen.getByText("1"));
            await user.click(screen.getByText("0"));
            await user.click(screen.getByText("="));
        }

        const displayText = screen.getByTestId("display").textContent;
        expect(displayText).toMatch(/e\+/i); // có dạng khoa học, ví dụ "1.0000000000e+20"
    });


    test("applies +/- mid-expression", async () => {
        const user = userEvent.setup();
        render(<App />);
        await clickSequence("9+", user);
        await user.click(screen.getByText("3"));
        await user.click(screen.getByText("+/-"));
        await user.click(screen.getByText("="));
        expect(screen.getByTestId("display")).toHaveTextContent("6");
    });

    test("very small numbers use scientific notation", async () => {
        const small = 1e-12;
        const out = formatNumberForDisplay(small);
        expect(out.toLowerCase()).toContain("e");
    });


});



