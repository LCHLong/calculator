import { test, expect } from "@playwright/test";

test.describe("Calculator UI", () => {

    test.beforeEach(async ({ page }) => {
        // Mở app
        await page.goto("/");
        // Chờ display xuất hiện
        await page.waitForSelector(".display");
    });

    test("addition: 2 + 3 = 5", async ({ page }) => {
        await page.click('text=2');
        await page.click('text=+');
        await page.click('text=3');
        await page.click('text==');
        const result = await page.locator(".display").innerText();
        expect(result.trim()).toBe("5");
    });

    test("subtraction: 9 − 4 = 5", async ({ page }) => {
        await page.click('text=9');
        await page.click('text=−');
        await page.click('text=4');
        await page.click('text==');
        const result = await page.locator(".display").innerText();
        expect(result.trim()).toBe("5");
    });

    test("multiplication: 6 × 7 = 42", async ({ page }) => {
        await page.click('text=6');
        await page.click('text=×');
        await page.click('text=7');
        await page.click('text==');
        const result = await page.locator(".display").innerText();
        expect(result.trim()).toBe("42");
    });

    test("division: 8 ÷ 2 = 4", async ({ page }) => {
        await page.click('text=8');
        await page.click('text=÷');
        await page.click('text=2');
        await page.click('text==');
        const result = await page.locator(".display").innerText();
        expect(result.trim()).toBe("4");
    });

    test("clear display using C", async ({ page }) => {
        await page.click('text=9');
        await page.click('text=C');
        const result = await page.locator(".display").innerText();
        expect(result.trim()).toBe("0");
    });

    test("backspace using ←", async ({ page }) => {
        await page.click('text=1');
        await page.click('text=2');
        await page.click('text=←');
        const result = await page.locator(".display").innerText();
        expect(result.trim()).toBe("1");
    });

    test("toggle sign using +/-", async ({ page }) => {
        await page.click('text=5');
        await page.click('text=+/-');
        const result = await page.locator(".display").innerText();
        expect(result.trim()).toBe("-5");
    });

    test("percent: 50 % = 0.5", async ({ page }) => {
        await page.click('text=5');
        await page.click('text=0');
        await page.click('text=%');
        const result = await page.locator(".display").innerText();
        expect(result.trim()).toBe("0.5");
    });

});
