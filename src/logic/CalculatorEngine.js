const MAX_DECIMALS = 10; // chữ số tối đa
const MAX_NORMAL = 1e15;
const MIN_NORMAL = 1e-15;
/* --------- Định dạng số để hiển thị --------- */
export function formatNumberForDisplay(value) {
    if (["Error", "Cannot divide by zero", "Overflow"].includes(value)) return value;

    if (typeof value === "string" && value.endsWith(".")) return value;

    const n = Number(value);
    if (!isFinite(n)) return "Overflow"; // chỉ true overflow thực sự

    const absN = Math.abs(n);

    // số cực lớn → scientific
    if (absN >= MAX_NORMAL) return n.toExponential(MAX_DECIMALS);

    // số cực nhỏ nhưng khác 0 → scientific
    if (absN !== 0 && absN < MIN_NORMAL) return n.toExponential(MAX_DECIMALS);

    // số nguyên → format với comma
    if (Math.round(n) === n) return new Intl.NumberFormat("en-US").format(n);

    // số thập phân → tối đa MAX_DECIMALS chữ số có nghĩa
    let str = n.toPrecision(MAX_DECIMALS);
    if (str.includes(".")) str = str.replace(/\.?0+$/, ""); // bỏ số 0 thừa
    return str;
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
