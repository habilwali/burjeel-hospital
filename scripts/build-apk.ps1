# Local Android TV APK build (no EAS/Expo cloud)
# Run in PowerShell from project root: .\scripts\build-apk.ps1

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
if (-not (Test-Path (Join-Path $root "package.json"))) { $root = (Get-Location).Path }

Set-Location $root

# 1. Prebuild if android/ is missing (skip if folder exists to avoid EBUSY when locked)
if (-not (Test-Path "android")) {
    Write-Host "Running expo prebuild (EXPO_TV=1)..." -ForegroundColor Cyan
    $env:EXPO_TV = "1"
    npx expo prebuild --clean
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
} else {
    Write-Host "Using existing android/ folder. Run 'npx expo prebuild --clean' first if you need a fresh native project." -ForegroundColor Yellow
}

# 2. Build release APK
Write-Host "Building release APK (this may take 10-20 min)..." -ForegroundColor Cyan
Set-Location android
.\gradlew.bat assembleRelease
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
Set-Location $root

# 3. Copy APK to project root
$apk = "android\app\build\outputs\apk\release\app-release.apk"
$dest = "Burjeel-Hospital-Android-TV.apk"
if (Test-Path $apk) {
    Copy-Item $apk $dest -Force
    Write-Host "`nDone. APK: $root\$dest" -ForegroundColor Green
} else {
    Write-Host "APK not found at $apk" -ForegroundColor Red
    exit 1
}

