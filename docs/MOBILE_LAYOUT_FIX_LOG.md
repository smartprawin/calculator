# Mobile Layout Fix — Issue & Discussion Log

**Project:** Simple Calculators (Capacitor Android app)
**Package:** `in.simplecalculator.app`
**App name:** Calculators
**Pages affected:** EMI Calculator (`emi.html`) — right side cut off / page shifts horizontally on phone
**Date:** 2026-08-19
**Device used for testing:** Xiaomi/MIUI phone, physical 1080×2400 px, density 440 (≈ 392 CSS px wide), adb serial `ea9da2f3cb94`

---

## 1. The Problem (as reported by user)

- Opening the EMI Calculator on the phone, the **right side was cut off** — only the left portion was visible.
- The layout "expanded" / shifted when moving the **Loan Tenure slider** (e.g. increasing tenure by ~2 years made the whole page slide sideways and revealed hidden content on the right).
- The header (`EMI Calculator`) and `home`/`personal`/`car` loan tabs were fine after the first fix; the content **below** the header was the problem.

---

## 2. Root Causes (two distinct problems)

### A. The real UI bug — horizontal overflow of the page
The EMI page uses a responsive layout that, on a narrow phone, let a child element become wider than the viewport, producing horizontal page scroll. The usual suspects in this codebase:
- A CSS **grid/flex blowout**: a flex/grid child defaulting to `min-width: auto` refuses to shrink below its content's intrinsic width.
- The **payment schedule `<table>`** with `white-space: nowrap` columns (currency values like `₹25,00,000`) is intrinsically wide and cannot fit a phone screen.

### B. The hidden build bug — web assets were never reaching the device (the real time-sink)
`npm run build` (script `scripts/copy-web.js`) copies source files into `www/`.
**But `gradlew assembleRelease` does NOT copy `www/` into the Android assets** (`android/app/src/main/assets/public/`). The APK is packaged from whatever already sits in `assets/public/`.

Consequence: every APK we built shipped the **original, stale web code**. None of the CSS/JS fixes (the `min-width:0` rules, the table `overflow` fix, the diagnostic box) ever reached the phone — so:
- the page kept overflowing,
- the `alert()`/console diagnostics never fired (the script with them wasn't on the device),
- we spent many cycles debugging a non-existent (on-device) version of the code.

Only changes to **Java** (`MainActivity`) took effect, because Gradle always recompiles Java into the APK.

**Fix for the build:** run `npx cap copy android` (or `npx cap sync android`) **between** `npm run build` and `gradlew assembleRelease` so `www/` is synced into `assets/public/` before packaging.

---

## 3. The Actual Fix (UI)

Files changed: `style.css`, `android/app/src/main/java/in/simplecalculator/app/MainActivity.java`

### `MainActivity.java` (native WebView viewport)
Added in `onCreate` so the WebView respects the `width=device-width` meta and renders at real device width (not a wide desktop viewport):
```java
settings.setUseWideViewPort(true);
settings.setLoadWithOverviewMode(true);
```
This is what made the header render correctly (centered, fully visible) at device width.

### `style.css` (responsive containment)
- `.layout`, `.layout > *`, `.card` → `min-width: 0;` (lets flex/grid children shrink instead of blowing out).
- `.table-wrap` → `overflow: auto; max-width: 100%;` (the schedule table scrolls *inside its card* instead of pushing the whole page wide). Applied in both the base rule and the `@media (max-width: 640px)` block.
- Mobile table tweaks: smaller font/`padding`, `white-space: nowrap` on `th, td`, and a sticky first column (`position: sticky; left: 0`) so the Year column stays visible while the rest scrolls.

**Result:** page fits the screen; the schedule table scrolls horizontally *within its card* when needed (expected and correct on mobile). User confirmed: *"that issue is fixed when I scrolled the loan, it's working as expected."*

---

## 4. Correct Build & Install Sequence (use this from now on)

```powershell
# 1. copy sources into www/
npm run build
# 2. sync www/ into the Android assets (REQUIRED — this was the missing step)
npx cap copy android
# 3. build the APK
cd android
.\gradlew.bat assembleRelease --no-daemon
cd ..
# 4. install on device
adb install -r android\app\build\outputs\apk\release\app-release.apk
# 5. bust WebView HTTP cache (survives reinstall) so the new assets actually load
adb shell pm clear in.simplecalculator.app
adb shell am force-stop in.simplecalculator.app
adb shell am start -n in.simplecalculator.app/.MainActivity
```
> `scripts/rebuild.ps1` currently does steps 1 + 3 only. **Add `npx cap copy android` to it** so future rebuilds include web changes. (Or just run `npm run rebuild`.)

To install the APK directly on the phone (no cable-less transfer needed) the device must allow USB installs:
Settings → Additional settings → Developer options → **"Install via USB"** → ON (MIUI shows a system dialog "Install canceled by user" → `INSTALL_FAILED_USER_RESTRICTED` if it's off).

---

## 5. Debugging Journey — What Was Tried & Why It Failed (lessons for next time)

| Attempt | Why it failed |
|---|---|
| `alert()` popup from JS | `alert()` *is* supported (Capacitor `BridgeWebChromeClient.onJsAlert` shows a native dialog), but the script containing it was never on the device (build bug B). |
| `console.error(...)` + `adb logcat` | WebView console messages do **not** surface to `logcat` on this Chromium build (verified `onConsoleMessage` exists in source but nothing appeared). Unreliable channel here. |
| `adb exec-out screencap -p` screenshot | Model cannot read image input; also large 1080×2400 PNGs crashed the local image tools. Useless. |
| `uiautomator dump` | Does **not** capture WebView DOM (only ~3 KB, no page text). Useless for web layout. |
| `am start -d capacitor://localhost/emi.html` | The deep-link intent does **not** navigate the SPA to `emi.html`; app stays on home. So `emi.js` never ran via that route. |
| WebView HTTP cache | Survives `adb install -r` and even app restart. Required `adb shell pm clear` to force fresh assets. |
| **On-page visible `<div>` (green DIAG box)** | ✅ FINALLY worked. Rendered measurements as on-screen text the user could read back. This is the reliable diagnostic channel for this setup. |

**Key realization:** once we confirmed `www/common.js` had the new code but `assets/public/common.js` did **not**, the entire "why don't my fixes show up" mystery was solved — it was never a CSS/logic problem on the device, it was a packaging problem.

---

## 6. The DIAG box (temporary diagnostic, now removed)

Added to `common.js` a fixed green box at the bottom printing `innerW`, `visualW`, `docScrollW`, `bodyScrollW`, `worst` element, and its `right`. Replaced with a visible box after `console.log` proved unreliable. **Removed** in the final clean build (see commit/state after this log). If layout issues return, re-adding this box is the fastest way to read live measurements.

---

## 7. Skills Created

- **`app-distribute`** at `.opencode/skills/app-distribute/SKILL.md` — documents the three install/distribute options: (A) share the APK file directly, (B) `adb install` over USB, (C) Google Play Store release (AAB + version bump). Created after the user asked how to "get the app on my phone."

---

## 8. Remaining Notes / TODO

- Add `npx cap copy android` into `scripts/rebuild.ps1` so web changes are always packaged.
- The schedule table still scrolls horizontally inside its card on very small screens — this is intended. If a true no-scroll mobile layout is wanted later, switch the table to a stacked/card layout on `@media (max-width: 640px)`.
- MIUI USB install requires "Install via USB" enabled in Developer options.
