import { defineConfig } from "@playwright/test";

export default defineConfig({
    testDir: "./tests/ui",
    timeout: 10000,
    retries: 0,
    use: {
        headless: true,
        baseURL: "http://localhost:5173",
    },
    webServer: {
        command: "npm run dev",
        port: 5173,
        reuseExistingServer: !process.env.CI,
    },
});
