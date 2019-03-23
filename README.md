# Shopify ThemeKit UI

As a developer on multiple client websites, I found it exhausting to easily swap between Shopify sites locally. As a result, I created a history-based UI which employs the Shopify Theme Kit.

## How does it work?

![Shopify Themekit UI Example](https://i.imgur.com/ZkXUHq8l.png)

Very simple.

1. It stores previous environments locally for a full year so you can swap between themes quickly and easily without keeping track of old credentials.
2. Just as simple as entering the Shopify URL + Password (only stored locally never over the web).
3. Choose your theme to download and get to work.

## Getting started

- Install the Shopify Themekit
- Run the Shopify Themekit UI executable
- Enter your page name, and password and then you can download any theme to the directory.
- These credentials are saved locally for 1 year and you can easily switch between websites and themes with ease.
- Every website will be added to the `themes/site.myshopify.com` folder next to the application.

## Download

To download visit our [release page](https://github.com/awhipp/shopify-themekit-ui/releases). You can find OSX and Win32 binaries here.

## Development

- This is built on Electron. 
- Run `npm install`
- Then run `npm start` to get the app open locally.

## Distribution Build

- Install electron-packager: `npm install electron-packager -g`
- Install stat: `npm install -g stat`
- Windows: `electron-packager . shopify-themekit-ui --overwrite --asar --platform=win32 --out=dist/win32 --arch=x64`
- OSX: `electron-packager . --platform=darwin --arch=x64 --prune=true --out=dist/osx --overwrite`
