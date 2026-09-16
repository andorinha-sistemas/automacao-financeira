$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$browser = Join-Path $root 'dist\automacao-tmp\browser'
$stageDir = Join-Path $root 'protheus\resource\_stage'
$appDir = Join-Path $stageDir 'automacao-financeira'
$zipPath = Join-Path $root 'protheus\resource\automacao-financeira.zip'
$appPath = Join-Path $root 'protheus\resource\automacao-financeira.app'

if (-not (Test-Path (Join-Path $browser 'index.html'))) {
    throw "Build not found at $browser. Run ng build first."
}

if (Test-Path $stageDir) { Remove-Item $stageDir -Recurse -Force }
New-Item -ItemType Directory -Path $appDir | Out-Null
Copy-Item -Path (Join-Path $browser '*') -Destination $appDir -Recurse -Force

if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
if (Test-Path $appPath) { Remove-Item $appPath -Force }

Compress-Archive -Path $appDir -DestinationPath $zipPath -Force
Move-Item -Path $zipPath -Destination $appPath -Force
Remove-Item $stageDir -Recurse -Force

Write-Output "Created $appPath ($((Get-Item $appPath).Length) bytes)"
