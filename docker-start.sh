#!/bin/bash

# AI Story Generator Docker Setup Script

echo "🚀 Starting AI Story Generator Docker Setup..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Please create one with your GEMINI_API_KEY"
    echo "Example:"
    echo "GEMINI_API_KEY=your_api_key_here"
    echo "API_KEY=your_api_key_here"
    exit 1
fi

# Stop and remove existing containers
echo "🧹 Cleaning up existing containers..."
docker-compose down --remove-orphans

# Remove existing images (optional, uncomment if needed)
# docker rmi ai-story-generator_ai-story-generator 2>/dev/null || true

# Build and start the application
echo "🏗️  Building and starting the application..."
docker-compose up --build -d

# Wait for the application to start
echo "⏳ Waiting for application to start..."
sleep 10

# Check if the application is running
if docker ps | grep -q "ai-story-generator"; then
    echo "✅ AI Story Generator is running!"
    echo "🌐 Application is available at: http://localhost:3000"
    echo "📊 To view logs: docker-compose logs -f"
    echo "🛑 To stop: docker-compose down"
else
    echo "❌ Failed to start AI Story Generator"
    echo "📋 Check logs: docker-compose logs"
    exit 1
fi 