# rdump tab export/import extension

This Chrome/Edge/Brave extension has two features:

1. Export list of currently open tabs to a text file, or copy them to clipboard.
2. Import a text file with a list of URLs, and it'll open them all for you.
3. (BONUS) Two themes: calm Light blue for regular people and animated Cyberpunk for ADHD zoomers.

I use this for sharing and/or saving URLs when researching a topic.

Sometimes I feed that list to my URL to markdown converter (coming soon!) and hand it over to my coding agents as documentation. Your only limited by your imagination.

## How to use

### Export URLs

1. Select the tabs you wish to export (skip this step if you want to export all of them)
2. Choose between newline separated and space separated
3. Choose output: save to file or copy to clipboard
4. Choose a filename (skip if you are copying to clipboard)
5. Click Export selected or Export all


<img width="600" alt="image" src="https://github.com/user-attachments/assets/9b9df9be-5490-4ab9-80d0-44af5896488b" />

### Import URLs

Click Choose File or drag and drop a text file with newline or space separated URLs. Preferably newline because space-separated or mixed files can be messy in my experience.

## Installation

- Download the latest `rdump-x.y-z.zip` from [GitHub Releases](https://github.com/claudejaune/rdump-prettified/releases).
- Unzip it — you'll get an `rdump/` folder.
- Go to `Settings` > `Extensions` in Chrome/Brave/Edge

<img width="344" alt="Screenshot 2024-07-19 at 4 33 26 PM" src="https://github.com/user-attachments/assets/ed483436-805d-4ffe-b572-286d37d055c7">

- Toggle on Developer mode in the top-right corner.
  
- Click **Load unpacked** and select the `rdump` folder.
  
<img width="494" alt="Screenshot 2024-07-19 at 4 34 10 PM" src="https://github.com/user-attachments/assets/a077b2da-f941-4541-b1e3-f86db45fea31"><br/>


You'll now have it in your extension list.

## Limitations

- The extension handles any whitespace-separated list of links (newlines, spaces, or mixed). However, _the input file is not sanitized in any way_. I have no idea what will happen if you feed it random text files. Your computer might explode idk
- Only detects the tabs open in the current browser window. If you want to export tabs from other windows, you'll need to go to each window individually and export.


**Original**: https://github.com/rohinish404/rdump
