$imagesDir = "frontend\src\assets\images"
$coversDir = "$imagesDir\habits card covers"
$sourceFile = "$imagesDir\habit_background_1.png"

$imagesToCreate = @(
    "habit-cover-bg.png",
    "habit-cover-bg-block-social-media.png",
    "habit-cover-bg-block-phone.png",
    "habit-cover-bg-meditate.png",
    "habit-cover-bg-block-porn-sites.png",
    "habit-cover-bg-drink-water.png",
    "habit-cover-bg-work-out.png",
    "habit-cover-bg-walk-run.png",
    "habit-cover-bg-brush-teeth.png",
    "habit-cover-bg-make-your-bed.png",
    "habit-cover-bg-organize-home-work.png"
)

foreach ($image in $imagesToCreate) {
    $destPath = Join-Path $coversDir $image
    if (-not (Test-Path $destPath)) {
        Copy-Item $sourceFile $destPath
        Write-Host "Created: $destPath"
    } else {
        Write-Host "Already exists: $destPath"
    }
}

