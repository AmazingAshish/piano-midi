# PianoBar 🎹

A beautiful, interactive virtual piano application built with React and Web Audio API. Transform text requests into playable melodies and enjoy a premium piano experience right in your browser.

![PianoBar Screenshot](https://images.pexels.com/photos/164743/pexels-photo-164743.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop)

## ✨ Features

### 🎵 Interactive Piano
- **18-key virtual piano** (C4 to F5) with realistic design
- **Dual input methods**: Play with mouse clicks or keyboard keys
- **Visual feedback**: Keys light up with smooth animations and pulse effects
- **High-quality audio**: Web Audio API synthesis with triangle wave oscillators

### 🎼 Smart Song Parsing
- **AI-powered melody generation** from text requests
- **Pre-programmed classics**: Happy Birthday, Twinkle Twinkle Little Star, Mary Had a Little Lamb, and more
- **Automatic playback** with synchronized visual feedback
- **Customizable speed**: 1.25x default playback speed for optimal listening

### 🌍 Multi-Language Support
- **English and Spanish** interface translations
- **Automatic locale detection** based on browser settings
- **Localized song suggestions** and error messages

### 🎨 Premium Design
- **Glass-morphism effects** with backdrop blur and transparency
- **Gradient backgrounds** and smooth color transitions
- **Responsive layout** that works on all screen sizes
- **Micro-interactions** and hover states throughout the interface

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn package manager
- Modern web browser with Web Audio API support

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/piano-bar.git
   cd piano-bar
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to start playing!

## 🎹 How to Play

### Keyboard Controls
Use your computer keyboard to play piano notes:

| Key | Note | Key | Note | Key | Note |
|-----|------|-----|------|-----|------|
| A   | C4   | W   | C#4  | S   | D4   |
| E   | D#4  | D   | E4   | F   | F4   |
| T   | F#4  | G   | G4   | Y   | G#4  |
| H   | A4   | U   | A#4  | J   | B4   |
| K   | C5   | O   | C#5  | L   | D5   |
| P   | D#5  | ;   | E5   | '   | F5   |

### Song Requests
1. **Type a song name** in the input field (e.g., "Happy Birthday")
2. **Click "Parse song"** to generate the melody
3. **Enjoy automatic playback** with visual piano animations
4. **Use play/stop controls** to replay songs

### Quick Start Songs
Click any of the suggested songs at the bottom:
- Happy Birthday
- Twinkle Twinkle Little Star  
- Mary Had a Little Lamb
- Jingle Bells
- And more classics!

## 🛠️ Technical Details

### Architecture
- **React 18** with TypeScript for type safety
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for utility-first styling
- **Lucide React** for beautiful icons

### Audio Engine
- **Web Audio API** for real-time audio synthesis
- **Triangle wave oscillators** for warm, piano-like tones
- **ADSR envelope** for natural note attack and decay
- **Frequency mapping** for accurate musical notes

### Performance Optimizations
- **Memoized callbacks** to prevent unnecessary re-renders
- **Efficient state management** with React hooks
- **Optimized animations** using CSS transforms
- **Lazy audio context initialization** for better performance

## 🎵 Song Format

Songs are represented as JSON objects with this structure:

```json
{
  "title": "Song Name",
  "notes": [
    {
      "note": "C4",
      "duration": 0.5,
      "time": 0
    },
    {
      "note": "D4", 
      "duration": 0.5,
      "time": 0.5
    }
  ]
}
```

- **note**: Musical note (C4, C#4, D4, etc.)
- **duration**: Note length in seconds
- **time**: Start time in seconds from song beginning

## 🌐 Browser Support

PianoBar works in all modern browsers that support:
- Web Audio API
- ES6+ JavaScript features
- CSS Grid and Flexbox
- CSS Custom Properties

**Recommended browsers:**
- Chrome 66+
- Firefox 60+
- Safari 14+
- Edge 79+

## 🔧 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

### Project Structure

```
src/
├── components/
│   └── PianoPlayer.tsx    # Main piano component
├── App.tsx                # Root application component
├── main.tsx              # Application entry point
└── index.css             # Global styles
```

## 🎨 Customization

### Adding New Songs
Add pre-programmed songs to the `preProgrammedSongs` object in `PianoPlayer.tsx`:

```typescript
const preProgrammedSongs = {
  'Your Song Name': {
    title: 'Your Song Name',
    notes: [
      {note: 'C4', duration: 0.5, time: 0},
      // ... more notes
    ]
  }
};
```

### Styling
Customize the appearance by modifying Tailwind classes or adding custom CSS. Key design elements:
- Piano key colors and shadows
- Background gradients
- Animation timings
- Glass-morphism effects

### Audio Settings
Adjust audio parameters in the `playTone` function:
- Oscillator type (triangle, sine, square, sawtooth)
- Gain envelope (attack, decay, sustain, release)
- Note frequencies

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Maintain consistent code formatting
- Add comments for complex logic
- Test across different browsers
- Ensure responsive design

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Web Audio API** for enabling real-time audio synthesis
- **React team** for the excellent framework
- **Tailwind CSS** for the utility-first CSS framework
- **Lucide** for the beautiful icon set
- **Pexels** for high-quality stock photos

## 📞 Support

Having issues? Here are some common solutions:

### Audio Not Working
- **Click anywhere** on the page to initialize audio context
- **Check browser permissions** for audio playback
- **Try a different browser** if issues persist

### Performance Issues
- **Close other browser tabs** to free up resources
- **Disable browser extensions** that might interfere
- **Use Chrome or Firefox** for best performance

### Visual Glitches
- **Update your browser** to the latest version
- **Clear browser cache** and reload the page
- **Check if hardware acceleration** is enabled

---

**Made with ❤️ and lots of ☕**

Enjoy making music with PianoBar! 🎹✨
