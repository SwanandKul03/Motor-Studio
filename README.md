# Motor Studio — complete local project

This is the restored Motor Studio website with the original car proportions and current guided journey. It includes the source code, artwork, local font and original synthesized sounds. There is no ChatGPT login, iframe, API key, database or Framer requirement.

## Run in Visual Studio Code

1. Install Node.js 18 or newer if it is not installed.
2. Extract this ZIP completely.
3. Open the Motor-Studio-Local folder in VS Code (the folder containing package.json).
4. Open Terminal → New Terminal.
5. Run `npm start`.
6. Open http://localhost:3000 in your browser.

No `npm install` is required: the local server uses Node's built-in modules only.
Stop with Ctrl+C. After changing source code, save and refresh the browser.
You can also choose Terminal → Run Task → Run Motor Studio.

To open the app on a phone connected to the same Wi-Fi as your Mac, start the server with `HOST=0.0.0.0 PORT=3001 npm start`, then open `http://<Mac-IP>:3001` on the phone (for example, `http://192.168.1.20:3001`). Find the Mac's local IP in System Settings → Wi-Fi → Details → TCP/IP. This link works only while the server is running and both devices are on the same network.

If you use the full Visual Studio IDE, open this folder and run the same command in its terminal.

Alternative with Python 3: run `python3 -m http.server 3000 --directory public` (Windows: `py -m http.server 3000 --directory public`).

## Publish on GitHub Pages

The repository is configured to publish from the `main` branch root through GitHub Pages. The root `index.html` forwards visitors to the app in `public/`. If Pages is not yet enabled, open **Settings → Pages**, choose **Deploy from a branch**, select **main** and **/(root)**, then save.

The public concept URL will be:

**https://swanandkul03.github.io/Motor-Studio/**

Use that URL as the destination for a portfolio button, for example:

```html
<a href="https://swanandkul03.github.io/Motor-Studio/" target="_blank" rel="noopener noreferrer">
  Explore Motor Studio
</a>
```

## Experience

Enable sound using the on-screen button. Explore the exterior; pull doors or open the bonnet/boot. Close openings, switch to Cockpit, fasten your belt, press the brake and hold Start. Select D, release the parking brake and foot brake, then use the accelerator. The on-screen guidance follows your progress.

Automatic transmission only. Navigation and dashboard states are a simulated concept, not live navigation or a connection to a real vehicle. Sound is synthesized in the browser by studio-sound.js; it requires user interaction.

## Source map

- public/index.html — entry point and script/style load order.
- public/desktop.css, automatic.css, refinement.css, journey.css — appearance and responsive layout.
- public/studio.js — base vehicle state, actions and physics.
- public/schematic.js — physical gestures, road animation and controls.
- public/desktop.js — integrated cluster rendering and desktop views.
- public/automatic.js — automatic transmission cockpit.
- public/refinement.js — final steering/seats, dashboard/indicator fixes and warnings.
- public/journey.js — guided ride progression and feedback.
- public/compartments.js — engine/luggage visible only in opened exterior compartments.
- public/studio-sound.js — engine, horn, music and other audio.
- public/assets — included artwork and fonts.
- server.mjs — dependency-free local web server.

Keep the script order in index.html. These scripts share state and build on earlier layers.

## Version and validation

This package matches the restored live design after the compressed layout was removed. The original vertical scrolling is retained. A single-screen redesign is NOT included.

Verified local server responses, referenced assets and JavaScript syntax. Prior logic checks covered ignition interlocks, gears, acceleration and braking. This handoff has not received a full visual browser acceptance test.
