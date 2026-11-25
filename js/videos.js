/**
 * IKAZE — Central Mount Configuration (App APK + Mediafire / Terabox Videos)
 * =========================================================================
 * Edit this single file to mount your EAS APK download link and your
 * Mediafire or Terabox video links onto the Ikaze website.
 */

window.IKAZE_CONFIG = {
  /**
   * 1. ANDROID APK DOWNLOAD LINK
   * - Option A (EAS Build link): Paste the https://expo.dev/artifacts/eas/...apk URL from `eas build`
   * - Option B (Mediafire/Terabox APK): Paste your Mediafire or Terabox APK link
   * - Option C (Self-hosted): Keep "./downloads/ikaze.apk" and drop the file in /downloads/ikaze.apk
   */
  apkDownloadUrl: "./downloads/ikaze.apk",

  /**
   * 2. VIDEO LINKS (Mediafire or Terabox)
   * Paste your Mediafire or Terabox share links in `url` below.
   * You can also add more objects to this array — they automatically render on index.html!
   */
  videos: [
    {
      id: "vid1",
      emoji: "🦍",
      location: "Volcanoes National Park",
      title: "Gorilla Trekking Experience",
      subtitle: "Volcanoes NP · Northwest Rwanda",
      url: "", // ← Paste Mediafire or Terabox link here
    },
    {
      id: "vid2",
      emoji: "🦁",
      location: "Akagera National Park",
      title: "Big Five Safari Adventure",
      subtitle: "Akagera NP · Eastern Rwanda",
      url: "", // ← Paste Mediafire or Terabox link here
    },
    {
      id: "vid3",
      emoji: "🏖️",
      location: "Lake Kivu",
      title: "Lake Kivu & Congo Nile Trail",
      subtitle: "Lake Kivu · Western Rwanda",
      url: "", // ← Paste Mediafire or Terabox link here
    },
    {
      id: "vid4",
      emoji: "🌳",
      location: "Nyungwe Forest",
      title: "Canopy Walk & Chimps",
      subtitle: "Nyungwe NP · Southwest Rwanda",
      url: "", // ← Paste Mediafire or Terabox link here
    },
  ],
};
