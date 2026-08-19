param(
    [switch]$Bundle,
    [switch]$NoSign
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path | Split-Path -Parent
$android = Join-Path $root "android"

Write-Host "==> Copying web assets to www/" -ForegroundColor Cyan
Push-Location $root
try {
    npm run build
} finally {
    Pop-Location
}

# Sync web assets into the Android project so web (HTML/CSS/JS) changes reach the APK.
# Without this, assembleRelease packages the STALE assets in android/app/src/main/assets/public.
Write-Host "==> Syncing web assets into Android (cap copy android)" -ForegroundColor Cyan
Push-Location $root
try {
    npx cap copy android
} finally {
    Pop-Location
}

Push-Location $android
try {
    if ($Bundle) {
        Write-Host "==> Building release AAB (and APK)" -ForegroundColor Cyan
        & .\gradlew.bat assembleRelease bundleRelease --no-daemon
    } else {
        Write-Host "==> Building release APK" -ForegroundColor Cyan
        & .\gradlew.bat assembleRelease --no-daemon
    }
} finally {
    Pop-Location
}

$apk = Join-Path $android "app\build\outputs\apk\release\app-release.apk"
if (Test-Path $apk) {
    $size = [math]::Round((Get-Item $apk).Length / 1MB, 2)
    Write-Host "==> APK ready: $apk ($size MB)" -ForegroundColor Green
}
if ($Bundle) {
    $aab = Join-Path $android "app\build\outputs\bundle\release\app-release.aab"
    if (Test-Path $aab) {
        $size = [math]::Round((Get-Item $aab).Length / 1MB, 2)
        Write-Host "==> AAB ready: $aab ($size MB)" -ForegroundColor Green
    }
}
Write-Host "==> Done." -ForegroundColor Green
