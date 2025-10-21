import { describe, it, expect } from "vitest";
import {
    evaluateExpression,
    applyUnary,
    applyPercent,
    formatNumberForDisplay
} from "../logic/CalculatorEngine.js";

describe("CalculatorEngine", () => {
    // ====== evaluateExpression() ======
    describe("evaluateExpression()", () => {
        it("thực hiện phép cộng trừ nhân chia cơ bản", () => {
            expect(evaluateExpression("2 + 3")).toBe(5);
            expect(evaluateExpression("10 - 4")).toBe(6);
            expect(evaluateExpression("5 × 6")).toBe(30);
            expect(evaluateExpression("8 ÷ 2")).toBe(4);
        });

        it("tính theo thứ tự toán học (BODMAS)", () => {
            expect(evaluateExpression("2 + 3 × 4")).toBe(14);
            expect(evaluateExpression("10 - 6 ÷ 3")).toBe(8);
            expect(evaluateExpression("5 + 10 ÷ 2")).toBe(10);
        });

        it("xử lý chia cho 0", () => {
            expect(evaluateExpression("5 ÷ 0")).toBe("Cannot divide by zero");
        });

        it("trả về Error nếu biểu thức không hợp lệ", () => {
            expect(evaluateExpression("5 + * 3")).toBe("Error");
        });
    });

    // ====== applyUnary() ======
    describe("applyUnary()", () => {
        it("tính căn bậc hai, bình phương, nghịch đảo", () => {
            expect(applyUnary("sqrt", 16)).toBe(4);
            expect(applyUnary("square", 5)).toBe(25);
            expect(applyUnary("inverse", 4)).toBeCloseTo(0.25, 10);
        });

        it("báo lỗi khi căn số âm hoặc chia 0", () => {
            expect(applyUnary("sqrt", -9)).toBe("Error");
            expect(applyUnary("inverse", 0)).toBe("Cannot divide by zero");
        });
    });

    // ====== applyPercent() ======
    describe("applyPercent()", () => {
        it("chuyển giá trị thành phần trăm", () => {
            expect(applyPercent(50)).toBe(0.5);
            expect(applyPercent(5)).toBe(0.05);
        });
    });

    // ====== formatNumberForDisplay() ======
    describe("formatNumberForDisplay()", () => {
        it("định dạng số nguyên", () => {
            expect(formatNumberForDisplay(1234567)).toBe("1,234,567");
        });

        it("định dạng số thập phân và bỏ 0 thừa", () => {
            expect(formatNumberForDisplay(12.3400)).toBe("12.34");
        });

        it("hiển thị lỗi chính xác", () => {
            expect(formatNumberForDisplay("Cannot divide by zero")).toBe("Cannot divide by zero");
        });
    });
});
