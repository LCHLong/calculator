const MAX_DECIMALS = 10;

/* --------- Định dạng số để hiển thị --------- */
export function formatNumberForDisplay(value) {
    if (["Error", "Cannot divide by zero", "Overflow"].includes(value)) return value;
    const n = Number(value);
    if (!isFinite(n)) return "Overflow";
    const hasFraction = Math.round(n) !== n;
    if (!hasFraction) return new Intl.NumberFormat("en-US").format(n);
    const fixed = Number(n.toFixed(MAX_DECIMALS));
    const parts = fixed.toString().split(".");
    if (parts.length === 1) return new Intl.NumberFormat("en-US").format(fixed);
    return `${new Intl.NumberFormat("en-US").format(Number(parts[0]))}.${parts[1].replace(/0+$/, "")}`;
}

/* --------- Đánh giá biểu thức theo chuẩn toán học (BODMAS) --------- */
export function evaluateExpression(expr) {
    try {
        const sanitized = expr
            .replace(/×/g, "*")
            .replace(/÷/g, "/")
            .replace(/−/g, "-");
        // eslint-disable-next-line no-eval
        const result = eval(sanitized);
        if (!isFinite(result)) return "Cannot divide by zero";
        return Number(result.toFixed(MAX_DECIMALS));
    } catch {
        return "Error";
    }
}

/* --------- Toán tử một ngôi --------- */
export function applyUnary(op, val) {
    const n = Number(val);
    if (!isFinite(n)) return "Overflow";
    switch (op) {
        case "sqrt":
            if (n < 0) return "Error";
            return Math.sqrt(n);
        case "square":
            return n * n;
        case "inverse":
            if (n === 0) return "Cannot divide by zero";
            return 1 / n;
        default:
            return n;
    }
}

/* --------- Tính phần trăm --------- */
export function applyPercent(val) {
    const n = Number(val);
    return Number((n / 100).toFixed(MAX_DECIMALS));
}
