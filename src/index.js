const readline = require('readline/promises');
const fs = require('fs');
const path = require('path');
const capture = require('./capture');
const composite = require('./composite');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function main() {
    console.log("=== Automated Mockup Generator ===\n");

    const mockupName = await rl.question('Enter the mockup folder name (e.g., iphone-15): ');
    const mockupDir = path.join(__dirname, '..', 'mockups', mockupName);

    if (!fs.existsSync(mockupDir)) {
        console.error(`❌ Error: Mockup directory '${mockupName}' not found.`);
        process.exit(1);
    }

    const configPath = path.join(mockupDir, 'config.json');
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

    const visiblePrompt = await rl.question('\nRun with browser visible to log in manually? (y/n): ');
    const isVisible = visiblePrompt.toLowerCase() === 'y';

    const urlsInput = await rl.question('\nEnter URLs (comma-separated) OR type the name of a .txt file (e.g., urls.txt): ');
    
    let urls = [];
    
    // Check if the input is a text file that actually exists
    if (urlsInput.endsWith('.txt') && fs.existsSync(urlsInput)) {
        const fileContent = fs.readFileSync(urlsInput, 'utf-8');
        // Split by new line and clean up whitespace
        urls = fileContent.split(/\r?\n/).map(u => u.trim()).filter(u => u);
        console.log(`\n📄 Loaded ${urls.length} URLs from ${urlsInput}`);
    } else {
        // Fallback to the standard comma-separated string
        urls = urlsInput.split(',').map(u => u.trim()).filter(u => u);
    }

    if (urls.length === 0) {
        console.error("❌ Error: No URLs provided.");
        process.exit(1);
    }

    console.log(`\n🚀 Starting process for ${urls.length} URLs...`);

    console.log(`\n🚀 Starting process for ${urls.length} URLs...`);

    // NEW: Create a clean, file-safe timestamp for this batch (YYYYMMDD-HHMMSS)
    const now = new Date();
    const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;

    for (const url of urls) {
        try {
            // Clean up the URL to make it a valid filename
            const urlSlug = url.replace(/[^a-zA-Z0-9]/g, '-').replace(/^https?-+/, '');
            
            // Temporary raw screenshot
            const screenshotPath = path.join(__dirname, '..', `${urlSlug}-raw.png`);
            
            // NEW: Append the timestamp to the final output file
            const finalPath = path.join(__dirname, '..', `${urlSlug}-${mockupName}-${timestamp}.png`);

            console.log(`\n📸 Loading: ${url}`);
            
            await capture(url, config.browser, screenshotPath, isVisible, rl);

            console.log(`🎨 Compositing: ${url}`);
            await composite(screenshotPath, mockupDir, config.compositing, finalPath);

            // Cleanup the raw screenshot
            if (fs.existsSync(screenshotPath)) {
                fs.unlinkSync(screenshotPath);
            }
            console.log(`✅ Finished: ${finalPath}`);
            
        } catch (err) {
            console.error(`❌ Failed processing ${url}:`, err.message);
        }
    }

    console.log("\n🎉 All done!");
    rl.close();
}

main();
