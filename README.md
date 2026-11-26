# 🇷🇼 Urugwiro Tours — Rwanda Tourism System

**Urugwiro Tours** is a complete tourism platform consisting of:

1. **Website** (`index.html` + `js/videos.js`) — a landing page that explains the app, showcases Rwanda videos (Mediafire / Terabox links), and provides a direct Android APK download.
2. **Mobile app** (`IkazeApp/`) — a React Native / Expo app with:
   - First-screen role selection (**Continue as a Tourist** / **Continue as a Tour Guide**), followed by nationality (**Rwandan** / **Foreigner**) and home district during registration
   - All **30 districts across 5 provinces**, with district-based discovery and RWF resident pricing for Rwandans
   - A directory of **36 curated tourist sites** with visitor pricing, categories, search, and GPS-based nearby sorting
   - Tour guide invitations, trip deliverables (itineraries, meeting points, permits, videos), and offline site data
   - EAS Build configuration (`eas.json`) ready to compile an Android `.apk`

---

## 1. Build the Android APK with EAS

From the repository root:

```powershell
cd IkazeApp
npm install -g eas-cli
eas login
eas build -p android --profile preview
```

EAS will output a downloadable `.apk` URL (or download the `.apk` file directly).

---

## 2. Mount APK & Video Links (Mediafire / Terabox)

### Website (`js/videos.js`)
Open `js/videos.js` and edit `window.URUGWIRO_CONFIG`:
- **`apkDownloadUrl`**: paste your EAS build `.apk` URL, a Mediafire/Terabox APK link, or drop `urugwiro-tours.apk` into `downloads/urugwiro-tours.apk`.
- **`videos`**: paste your Mediafire or Terabox video URLs into each `url: ""` field. Add more entries to the array at any time; cards render automatically.

### Mobile app (`IkazeApp/src/data/videos.js`)
Paste your Mediafire or Terabox video URLs into `SITE_VIDEOS` so each site's detail screen displays a **Watch Video Tour** button.

---

## 3. Run Locally

### Mobile app (Expo)
```powershell
cd IkazeApp
npx expo start
```

### Website
Open `index.html` in any browser, or serve the repository root with any static server (e.g. `npx serve .`).

---

## 4. Optional cloud sync

`supabase_schema.sql` contains a Supabase / PostgreSQL + PostGIS schema for districts, sites, profiles, guide invitations, deliverables, and trip plans, plus a `get_nearby_sites` function. It is not wired into the app yet — the app currently persists data on-device with AsyncStorage.
