This is a Chrome Extenstion for F6S 
It helps to apply to accelerators faster
## 
## How to install the extension

1. **Download the ZIP file:** 
[Download the ZIP file](https://github.com/RusDyn/f6s_extension/releases) from the latest release and save it to a known location on your computer.

2. **Extract the ZIP file:** 
Extract the ZIP file to a known location on your computer. You can usually do this by right-clicking the ZIP file and selecting "Extract All" or "Unzip". Make sure to remember the location where you extract the files, you will need this in the next steps.

3. **Open Google Chrome:** 
Start the Google Chrome browser on your computer. 

4. **Access the Extensions page:** 
Click on the three-dot icon in the top-right corner of the browser (below the close button) to open the Chrome menu. From the dropdown menu, go to "More Tools" and then click on "Extensions". 

5. **Enable Developer Mode:** 
On the Extensions page, look for a toggle switch in the top-right corner labelled "Developer mode". Click on it to enable Developer mode. Enabling this mode allows you to load extensions from a folder.

6. **Load Unpacked Extension:** 
Now click on the "Load unpacked" button that has appeared in the top-left corner of the Extensions page. 

7. **Navigate to the Extension Folder:** 
A file selection dialog box will open. Navigate to the location where you extracted the ZIP file. Select the folder (not the ZIP file itself) and click on the "Select Folder" button. 

8. **Activate the Extension:** 
Once the extension has been loaded, you should see it in your list of installed extensions. If it is disabled, click the toggle button at the bottom right of the extension card to enable it.

> 

## How to use the extension
 Near every field you will see two buttons
 - Answer: Get answer from LLM
 - Save: Save answer to use later


## Run and build manually
This extension bootstrapped with [`Plasmo`](https://www.npmjs.com/package/plasmo).

Run the development server:

```bash
pnpm dev
# or
npm run dev
```

Open your browser and load the appropriate development build. For example, if you are developing for the chrome browser, using manifest v3, use: `build/chrome-mv3-dev`.
For further guidance to Plasmo, [visit our Documentation](https://docs.plasmo.com/)

## Making production build

Run the following:

```bash
pnpm build
# or
npm run build
```

This should create a production bundle for your extension, ready to be zipped and published to the stores.
