const puppeteer = require('puppeteer');

async function capture(url, browserConfig, outputPath, isVisible, rl) {
    const browser = await puppeteer.launch({ 
        headless: isVisible ? false : "new", 
        userDataDir: "./puppeteer_data",
        defaultViewport: null,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-gpu',           // Forces software rendering
            '--disable-dev-shm-usage'  // Prevents memory crashes on large pages
        ]
    });
    
    const page = await browser.newPage();

    await page.setViewport({
        width: browserConfig.viewportWidth,
        height: browserConfig.viewportHeight,
        deviceScaleFactor: browserConfig.deviceScaleFactor || 1,
        isMobile: browserConfig.isMobile || false
    });

    await page.goto(url, { waitUntil: 'networkidle2' });

    if (isVisible) {
        await rl.question('\n🛑 BROWSER PAUSED: Please log in if needed, dismiss any popups, then press ENTER to take the screenshot...');
    }

    await page.screenshot({ path: outputPath });

    await browser.close();
}

module.exports = capture;
