import { test, expect } from "@playwright/test";

test.describe("Calculator UI", () => {

    test.beforeEach(async ({ page }) => {
        await page.goto("/");
        await page.waitForSelector('[data-testid="display"]');
    });

    test("addition: 2 + 3 = 5", async ({ page }) => {
        const display = page.getByTestId("display");
        await page.click('text=2');
        await page.click('text=+');
        await page.click('text=3');
        await page.click('text==');
        await expect(display).toHaveText("5");
    });

    test("subtraction: 9 − 4 = 5", async ({ page }) => {
        const display = page.getByTestId("display");
        await page.click('text=9');
        await page.click('text=−');
        await page.click('text=4');
        await page.click('text==');
        await expect(display).toHaveText("5");
    });

    test("multiplication: 6 × 7 = 42", async ({ page }) => {
        const display = page.getByTestId("display");
        await page.click('text=6');
        await page.click('text=×');
        await page.click('text=7');
        await page.click('text==');
        await expect(display).toHaveText("42");
    });

    test("division: 8 ÷ 2 = 4", async ({ page }) => {
        const display = page.getByTestId("display");
        await page.click('text=8');
        await page.click('text=÷');
        await page.click('text=2');
        await page.click('text==');
        await expect(display).toHaveText("4");
    });

    test("clear display using C", async ({ page }) => {
        const display = page.getByTestId("display");
        await page.click('text=9');
        await page.click('text=C');
        await expect(display).toHaveText("0");
    });


    test("toggle sign using +/-", async ({ page }) => {
        const display = page.getByTestId("display");
        await page.click('text=5');
        await page.click('text=+/-');
        await expect(display).toHaveText("-5");
    });

    test("percent: 50 % = 0.5", async ({ page }) => {
        const display = page.getByTestId("display");
        await page.click('text=5');
        await page.click('text=0');
        await page.click('text=%');
        await expect(display).toHaveText("0.5");
    });

});
