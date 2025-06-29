# AI Story Generator Docker Setup Script for Windows

Write-Host "🚀 Starting AI Story Generator Docker Setup..." -ForegroundColor Green

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  .env file not found. Please create one with your GEMINI_API_KEY" -ForegroundColor Yellow
    Write-Host "Example:" -ForegroundColor White
    Write-Host "GEMINI_API_KEY=your_api_key_here" -ForegroundColor Cyan
    Write-Host "API_KEY=your_api_key_here" -ForegroundColor Cyan
    exit 1
}

# Stop and remove existing containers
Write-Host "🧹 Cleaning up existing containers..." -ForegroundColor Blue
docker-compose down --remove-orphans

# Remove existing images (optional)
# docker rmi ai-story-generator_ai-story-generator 2>$null

# Build and start the application
Write-Host "🏗️  Building and starting the application..." -ForegroundColor Blue
docker-compose up --build -d

# Wait for the application to start
Write-Host "⏳ Waiting for application to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check if the application is running
$containerRunning = docker ps --format "table {{.Names}}" | Select-String "ai-story-generator"

if ($containerRunning) {
    Write-Host "✅ AI Story Generator is running!" -ForegroundColor Green
    Write-Host "🌐 Application is available at: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "📊 To view logs: docker-compose logs -f" -ForegroundColor White
    Write-Host "🛑 To stop: docker-compose down" -ForegroundColor White
} else {
    Write-Host "❌ Failed to start AI Story Generator" -ForegroundColor Red
    Write-Host "📋 Check logs: docker-compose logs" -ForegroundColor White
    exit 1
} 