# download-resources.ps1 · scarica in locale font Google e immagini CDN
# Eseguire dalla root del frontend:   powershell -ExecutionPolicy Bypass -File .\assets\download-resources.ps1

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
$ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

Write-Host '-- Fonts --' -ForegroundColor Cyan
$fontsUrl = 'https://fonts.googleapis.com/css2?' +
  'family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&' +
  'family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&' +
  'family=DM+Mono:ital,wght@0,300;0,400;1,300&' +
  'family=Cinzel:wght@400;600;700&' +
  'family=DM+Sans:wght@300;400;500&display=swap'

$css = (Invoke-WebRequest -UserAgent $ua -Uri $fontsUrl -UseBasicParsing).Content
$fontsDir = 'assets\fonts'
New-Item -ItemType Directory -Force -Path $fontsDir | Out-Null

$pattern = 'url\((https://[^)]+)\)'
$urlMatches = [regex]::Matches($css, $pattern)
$rewritten = $css
$count = 0
foreach ($m in $urlMatches) {
  $full = $m.Value
  $url  = $m.Groups[1].Value
  $name = [System.IO.Path]::GetFileName(($url -split '\?')[0])
  $out  = Join-Path $fontsDir $name
  if (-not (Test-Path $out)) {
    Write-Host ("  DL " + $name) -ForegroundColor DarkGray
    Invoke-WebRequest -UserAgent $ua -Uri $url -OutFile $out -UseBasicParsing
  }
  $rewritten = $rewritten.Replace($full, "url('./$name')")
  $count++
}
Set-Content -Path (Join-Path $fontsDir 'fonts.css') -Value $rewritten -Encoding UTF8
Write-Host ("  OK fonts.css scritto con {0} riferimenti locali" -f $count) -ForegroundColor Green

Write-Host ''
Write-Host '-- Immagini --' -ForegroundColor Cyan
$images = @{
  'doisneau\hero-autoportrait.jpeg' = 'https://www.robert-doisneau.com/ressources/imageBank/cache/26/320x-4891-Autoportrait-jules-ferry.jpeg'
  'doisneau\landing-hero.png'       = 'https://www.robert-doisneau.com/ressources/imageBank/cache/66/480x-5005-Doisneau_Pordenone.png'
  'doisneau\card-paris.jpg'         = 'https://image.jimcdn.com/app/cms/image/transf/none/path/s55fe77d416bad7bc/image/iab63d00d703e1806/version/1397545185/image.jpg'
  'doisneau\card-valse.jpg'         = 'https://uploads.lebonbon.fr/source/2025/february/2074553/robert-doisneau-derniere-valse-14-juillet-expo-mus_1_2000.jpg'
  'doisneau\card-children.jpg'      = 'https://i.ebayimg.com/images/g/qroAAOSwBahVO9Xl/s-l1200.jpg'
  'doisneau\mosaic-bacio.jpg'       = 'https://compass-media.vogue.it/photos/645cf22e69fb9735214322b2/4:3/w_699,h_524,c_limit/Bacio.jpg'
  'doisneau\mosaic-doisneau.jpg'    = 'https://ilfotografo.it/wp-content/uploads/2022/10/Doisneau-875x1024.jpg'
  'doisneau\mosaic-portrait.jpg'    = 'https://d7hftxdivxxvm.cloudfront.net/?height=800&quality=80&resize_to=fit&src=https://d32dm0rphc51dk.cloudfront.net/U8kWWWHRWS4BOdgA64k1JA/normalized.jpg&width=787'
  'people\giulia.jpg'               = 'https://picsum.photos/seed/giulia/200/200'
  'people\marco.jpg'                = 'https://picsum.photos/seed/marco/200/200'
  'people\serena.jpg'               = 'https://picsum.photos/seed/serena/200/200'
}
$imgBase = 'assets\img'
foreach ($rel in $images.Keys) {
  $target = Join-Path $imgBase $rel
  if (Test-Path $target) {
    Write-Host "  = $rel" -ForegroundColor DarkGray
    continue
  }
  $dir = Split-Path $target -Parent
  New-Item -ItemType Directory -Force -Path $dir | Out-Null
  try {
    Invoke-WebRequest -UserAgent $ua -Uri $images[$rel] -OutFile $target -UseBasicParsing
    Write-Host ("  DL " + $rel) -ForegroundColor DarkGray
  } catch {
    $msg = $_.Exception.Message
    Write-Warning ("  FAIL " + $rel + "  ::  " + $msg)
  }
}

Write-Host ''
Write-Host '-- Logo --' -ForegroundColor Cyan
$logoSrc = 'logosenzabg.png'
$logoDst = 'assets\img\logo.png'
if ((Test-Path $logoSrc) -and -not (Test-Path $logoDst)) {
  Copy-Item $logoSrc $logoDst
  Write-Host '  OK logo.png copiato da logosenzabg.png' -ForegroundColor Green
} else {
  Write-Host '  = logo.png' -ForegroundColor DarkGray
}

Write-Host ''
Write-Host 'Fatto.' -ForegroundColor Green
