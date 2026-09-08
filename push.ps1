# Automated Git Push Script for Olflaz Website
# Repository: https://github.com/NotOlflaz/mywebsite

param (
    [string]$Message = "chore: update website and CMS content"
)

$gitExe = "git"
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    $minGit = "C:\Users\ahmed\AppData\Local\Programs\MinGit\cmd\git.exe"
    if (Test-Path $minGit) {
        $gitExe = $minGit
    }
}

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " Olflaz Website - Auto Push to GitHub" -ForegroundColor Green
Write-Host " Target: https://github.com/NotOlflaz/mywebsite" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Cyan

Set-Location $PSScriptRoot

# 1. Stage changes
Write-Host "1. Staging changes..." -ForegroundColor Gray
& $gitExe add .

# 2. Check if there are changes to commit
$status = & $gitExe status --porcelain
if ($status) {
    Write-Host "2. Committing changes: $Message" -ForegroundColor Gray
    & $gitExe commit -m $Message
} else {
    Write-Host "2. No new local changes to commit." -ForegroundColor Yellow
}

# 3. Push to GitHub
Write-Host "3. Pushing to origin/main..." -ForegroundColor Cyan
& $gitExe push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "Successfully pushed to https://github.com/NotOlflaz/mywebsite" -ForegroundColor Green
} else {
    Write-Host "Push failed or requires GitHub authentication token." -ForegroundColor Red
}
