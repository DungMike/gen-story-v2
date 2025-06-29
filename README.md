# AI Story Generator - Next.js 14

A powerful AI-powered story generator built with Next.js 14, TypeScript, and Google Gemini AI.

## Features

- 🎭 **Multiple Story Genres**: Mystery, Romance, Sci-Fi, Fantasy, Horror, Adventure
- 🎨 **AI-Powered Generation**: Advanced story creation using Google Gemini AI
- 🎤 **Text-to-Speech**: Convert stories to natural-sounding audio
- 🖼️ **AI Illustrations**: Generate stunning visuals for your stories
- 🌐 **Multilingual**: Support for Vietnamese and English
- 📱 **Responsive Design**: Beautiful UI that works on all devices
- 💾 **Local Storage**: Save and manage your created stories

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: Google Gemini AI API
- **State Management**: React Hooks
- **Text-to-Speech**: Web Speech API
- **Image Generation**: AI-powered image generation

## Prerequisites

- Node.js 20.0.0 or higher
- npm, yarn, or pnpm
- Google Gemini API key

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/ai-story-generator.git
   cd ai-story-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your Google Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. **Select a Story Template**: Choose from various genres like Mystery, Romance, Sci-Fi, etc.
2. **Configure Story Parameters**: Set word count, narrative style, characters, and setting
3. **Generate Your Story**: Let AI create a unique story based on your preferences
4. **Enhance Your Story**: Add voice narration or AI-generated illustrations
5. **Save and Manage**: All stories are saved locally for future access

## API Configuration

### Google Gemini AI

To use the story generation feature, you need a Google Gemini API key:

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env.local` file

## Build and Deployment

### Build for Production

```bash
npm run build
npm run start
```

### Docker Deployment

```bash
# Build the Docker image
docker build -t ai-story-generator .

# Run the container
docker run -p 3000:3000 ai-story-generator
```

## Project Structure

```
ai-story-generator/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   ├── dashboard/         # Dashboard page
│   ├── template/[templateId]/  # Dynamic story creator
│   ├── voice/[storyId]/   # Voice generation
│   └── image/[storyId]/   # Image generation
├── components/            # Reusable components
├── lib/                   # Utility libraries
├── pages/                 # Page components
├── providers/             # React context providers
├── services/              # API services
├── types.ts              # TypeScript type definitions
└── constants.ts          # App constants
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/your-username/ai-story-generator/issues) on GitHub.
