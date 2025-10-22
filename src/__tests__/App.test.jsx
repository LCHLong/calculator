/**
 * src/__tests__/App.detailed.test.jsx
 * Async-safe Vitest + React Testing Library tests for Calculator UI
 */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { describe, test, expect } from "vitest";
import {
    formatNumberForDisplay,
    evaluateExpression
} from "../logic/CalculatorEngine";

// helper: click a sequence of characters (digits and dot)
const clickSequence = async (seq, user) => {
    for (const ch of seq) {
        if (ch === " ") continue;
        await user.click(screen.getByText(ch));
    }
};

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
        expect(screen.getByTestId("display")).toHaveTextContent("13");
    });

    test("large number formatting with commas", async () => {
        const user = userEvent.setup();
        render(<App />);
        await clickSequence("1000000", user);
        expect(screen.getByTestId("display")).toHaveTextContent("1,000,000");
    });
});

// ===== Unit tests for CalculatorEngine =====
describe("CalculatorEngine (unit)", () => {
    test("evaluateExpression basic math", () => {
        expect(evaluateExpression("2+3")).toBe(5);
        expect(evaluateExpression("6 ÷ 2")).toBe(3);
    });

    test("formatNumberForDisplay large number scientific notation", () => {
        const out = formatNumberForDisplay(1e16);
        expect(typeof out).toBe("string");
        expect(out.toLowerCase()).toContain("e");
    });
});
