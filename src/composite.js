const sharp = require('sharp');
const path = require('path');

async function composite(screenshotPath, mockupDir, compositeConfig, finalOutputPath) {
    const templatePath = path.join(mockupDir, 'template.png');

    // 1. Get the exact dimensions of your mockup template automatically
    const templateMeta = await sharp(templatePath).metadata();

    // 2. Resize the raw screenshot to fit the screen dimensions in config
    const resizedScreenshot = await sharp(screenshotPath)
        .resize(compositeConfig.width, compositeConfig.height, {
            fit: 'cover' // Ensures it fills the space perfectly without warping
        })
        .toBuffer();

    // 3. Create a blank transparent canvas the exact size of the template
    await sharp({
        create: {
            width: templateMeta.width,
            height: templateMeta.height,
            channels: 4,
            background: { r: 0, g: 0, b: 0, alpha: 0 }
        }
    })
    // 4. Stack the layers: Screenshot first (bottom), then Template (top)
    .composite([
        { 
            input: resizedScreenshot, 
            top: compositeConfig.y, 
            left: compositeConfig.x 
        },
        { 
            input: templatePath, 
            top: 0, 
            left: 0 
        }
    ])
    .toFile(finalOutputPath);
}

module.exports = composite;
