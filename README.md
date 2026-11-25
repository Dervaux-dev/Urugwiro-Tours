# 🇷🇼 Ikaze — Rwanda Tourism System

**Ikaze** is a complete tourism platform consisting of:
1. **Ikaze Website** (`index.html` + `js/videos.js`) — Landing page to showcase Rwanda videos (Mediafire / Terabox links) and provide direct APK download for Android users.
2. **Ikaze Mobile App** (`IkazeApp/`) — React Native / Expo app with:
   - First-screen role selection (**Ndi Umunyarwanda / Rwandan** vs **International Visitor**)
   - All **30 districts across 5 provinces** with district-based discovery & RWF resident pricing for Rwandans
   - Full tourist site directory with international USD pricing for visitors
   - EAS Build configuration (`eas.json`) ready to compile an Android `.apk`

---

## 1. Build the Android APK with EAS

From inside `IkazeApp/`:

```powershell
cd d:\ikaze\IkazeApp
npm install -g eas-cli
eas login
eas build -p android --profile preview
```

EAS will output a downloadable `.apk` URL (or download the `.apk` file).

---

## 2. Mount APK & Video Links (Mediafire / Terabox)

### On the Ikaze Website (`d:\ikaze\js\videos.js`)
Open `d:\ikaze\js\videos.js` and edit `window.IKAZE_CONFIG`:
- **`apkDownloadUrl`**: Paste your EAS build `.apk` URL, Mediafire/Terabox APK link, or drop `ikaze.apk` inside `d:\ikaze\downloads\ikaze.apk`.
- **`videos`**: Paste your Mediafire or Terabox video URLs into each `url: ""` field (and add more video entries to the array anytime).

### Inside the Mobile App (`d:\ikaze\IkazeApp\src\data\videos.js`)
Paste your Mediafire or Terabox video URLs into `SITE_VIDEOS` so each site's detail screen displays a **Watch Video Tour** button.

---

## 3. Run Locally

### Mobile App (Expo)
```powershell
cd d:\ikaze\IkazeApp
npx expo start
```

### Website (`index.html`)
Open `d:\ikaze\index.html` in any browser, or serve `d:\ikaze` with any static server (e.g., `npx serve d:\ikaze`).
