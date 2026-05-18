# rdump tab export/import extension

This Chrome/Edge/Brave extension has two features:

- Export list of currently open tabs to a text file, or copy them.
- Import a text file with a list of URLs, and it'll open them all for you.

<img width="500" alt="rdump interface screenshot" src="https://github.com/user-attachments/assets/6ad72b86-3db8-48f1-969a-f857d6529b55">


## Installation

- Download the latest `rdump.zip` from [GitHub Releases](https://github.com/claudejaune/rdump-prettified/releases).
- Unzip it — you'll get a `rdump/` folder.
- Go to `Settings` > `Extensions` in Google Chrome 

<img width="344" alt="Screenshot 2024-07-19 at 4 33 26 PM" src="https://github.com/user-attachments/assets/ed483436-805d-4ffe-b572-286d37d055c7">

- Toggle on Developer mode in the top-right corner.
  
- Click **Load unpacked** and select the `rdump` folder.
  
<img width="494" alt="Screenshot 2024-07-19 at 4 34 10 PM" src="https://github.com/user-attachments/assets/a077b2da-f941-4541-b1e3-f86db45fea31"><br/>


You'll now have it in your extension list.

## How to use

### Export tab list

- Select the tabs you wish to export
- Enter the destination filename (**Important**: the app will silently fail if you don't write a filename)
- Click **Export selected**

Alternatively, enter a filename and click **Export all**.

You can also switch the output mode to **Copy to clipboard** instead of exporting to a file.

### Import URLs

- Click **Choose file** and select a text file with URLs (newline-separated, space-separated, or mixed)

## Caveats

- The extension handles any whitespace-separated list of links (newlines, spaces, or mixed). However, _the input file is not sanitized in any way_. I have no idea what will happen if you feed it random text files. Your computer might explode idk
- Only detects the tabs open in the current browser window. If you want to export tabs from other windows, you'll need to go to each window individually and export.


**Original**: https://github.com/rohinish404/rdump
