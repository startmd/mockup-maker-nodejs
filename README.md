# 📸 Automated Mockup Generator

A blazing-fast, Node.js-based CLI tool that automatically captures high-resolution website screenshots and seamlessly composites them into device mockups. Built with **Puppeteer** for robust headless browsing and **Sharp** for lightning-fast image processing.

## ✨ Features

* **Batch Processing:** Feed it a single URL, a comma-separated list, or a `.txt` file to generate dozens of mockups in seconds.
* **Smart Compositing:** Uses a blank-canvas layering system for flawless edge-to-edge transparent `.png` integration.
* **Interactive Auth Mode:** Built-in "pause" feature allows you to run a visible browser, log into web apps manually, and capture authenticated dashboards.
* **Persistent Sessions:** Saves your browser cookies/sessions locally so you only have to log in once.
* **Modular Templates:** Easily drop in new device mockups (iMacs, iPhones, laptops) with a simple JSON config.
* **Organized Outputs:** Automatically tags finished mockups with a timestamp to prevent overwriting.

---

## 🚀 Installation

### Prerequisites

* **Node.js** (v18 or higher recommended)
* **Git**

### Setup

1. Clone this repository or download the source code.
2. Open your terminal and navigate to the project directory:
```bash
cd your-repo-name

```


3. Install the required dependencies:
```bash
npm install puppeteer sharp

```



---

## 💻 How to Use

Run the main script from your terminal:

```bash
node src/index.js

```

The CLI will walk you through three simple prompts:

1. **Mockup Selection:** Enter the name of the folder inside the `/mockups` directory you want to use (e.g., `imac`).
2. **Interactive Mode:** Type `y` if you need the browser to open visibly so you can log into a website before the screenshot is taken. Type `n` to run it invisibly in the background.
3. **Target URLs:** You can provide URLs in two ways:
* **Comma-separated:** `https://apple.com, https://github.com`
* **Text file:** Create a `urls.txt` file in the root directory with one URL per line, and simply type `urls.txt` into the prompt.



Your finished, high-res mockups will be saved in the root directory with a timestamp!

---

## 🛠 How to Add a New Mockup

Adding a new device template (like a MacBook or an iPhone) requires zero changes to the core code.

### Step 1: Prepare Your Image

Find a flat, straight-on photo of a device. Using a tool like Photoshop or Photopea, delete the screen area so it becomes a transparent checkerboard. Save this file exactly as `template.png`. **Note: JPEGs do not support transparency.**

### Step 2: Create the Directory

Inside the `/mockups` folder, create a new directory for your device (e.g., `/macbook-pro`) and place your `template.png` inside it.

### Step 3: Measure and Configure

Create a `config.json` file in that same folder. You need to map exactly where the transparent "hole" is on your template.

Here is the required blueprint for your `config.json`:

```json
{
  "name": "MacBook Pro",
  "browser": {
    "viewportWidth": 1920,
    "viewportHeight": 1080,
    "deviceScaleFactor": 2, 
    "isMobile": false 
  },
  "compositing": {
    "x": 300,        
    "y": 150,        
    "width": 1320,   
    "height": 840,   
    "layering": "under"
  }
}

```

#### Configuration Guide:

* **`viewportWidth` & `viewportHeight**`: The size of the browser window Puppeteer will open.
* **`deviceScaleFactor`**: Set to `2` or `3` for Retina/High-Res screenshots. `1` for standard resolution.
* **`isMobile`**: Set to `true` if you are mapping a phone mockup to force mobile layouts.
* **`x` & `y**`: The exact pixel coordinates (from the top-left of your template) where the transparent screen hole begins.
* **`width` & `height**`: The exact dimensions of the transparent screen hole.

---

## 🧠 Advanced: Handling Logins & Authentication

Some sites require you to be logged in to view a dashboard.

1. Run the script and answer `y` to the visible browser prompt.
2. The script will pause.
3. Use the visible Chromium browser to log into the site.
4. Once logged in, return to your terminal and press **ENTER**.
5. The script will take the screenshot and save your session cookies to the local `/puppeteer_data` folder. Next time, you can run the script headlessly (`n`) and you will still be logged in!

---

## ⚠️ Troubleshooting

* **Blank/Black Screenshots:** If the output image is mostly black, Puppeteer might be struggling with hardware acceleration on your OS. The script includes fallback flags (`--disable-gpu`) to force software rendering.
* **Screenshot Overlapping the Bezel:** Double-check your `x`, `y`, `width`, and `height` in your `config.json`. If they are off by even a few pixels, the screenshot will bleed over the edges of your device frame.
* **Mobile Menu on Desktop Mockup:** Ensure `"isMobile"` is set to `false` in your `config.json` for desktop templates like iMacs or laptops.

---
