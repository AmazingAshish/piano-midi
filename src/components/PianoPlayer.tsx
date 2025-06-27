import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Square, Music } from 'lucide-react';

const TRANSLATIONS = {
  "en-US": {
    "appTitle": "PianoBar",
    "songInputPlaceholder": "Request a song...",
    "parseSongButton": "Parse song",
    "processingButton": "Processing...",
    "playingPrefix": "Playing: ",
    "readyToPlayPrefix": "Ready to play: ",
    "playButton": "Play",
    "stopButton": "Stop",
    "parseErrorMessage": "Sorry, I had trouble parsing that song. Please try a different request.",
    "happyBirthday": "Happy birthday",
    "twinkleTwinkle": "Twinkle twinkle little star",
    "maryHadLamb": "Mary had a little lamb",
    "jingleBells": "Jingle bells",
    "sadMelody": "Sad melody",
    "amazingGrace": "Amazing grace",
    "silentNight": "Silent night",
    "auldLangSyne": "Auld lang syne"
  },
  "es-ES": {
    "appTitle": "PianoBar",
    "songInputPlaceholder": "Solicita una canción...",
    "parseSongButton": "Analizar canción",
    "processingButton": "Procesando...",
    "playingPrefix": "Reproduciendo: ",
    "readyToPlayPrefix": "Listo para reproducir: ",
    "playButton": "Reproducir",
    "stopButton": "Detener",
    "parseErrorMessage": "Lo siento, tuve problemas analizando esa canción. Por favor intenta con una solicitud diferente.",
    "happyBirthday": "Cumpleaños feliz",
    "twinkleTwinkle": "Estrellita dónde estás",
    "maryHadLamb": "María tenía un corderito",
    "jingleBells": "Cascabeles",
    "sadMelody": "Melodía triste",
    "amazingGrace": "Sublime gracia",
    "silentNight": "Noche de paz",
    "auldLangSyne": "Auld lang syne"
  }
};

const browserLocale = navigator.languages?.[0] || navigator.language || 'en-US';
const findMatchingLocale = (locale: string) => {
  if (TRANSLATIONS[locale as keyof typeof TRANSLATIONS]) return locale;
  const lang = locale.split('-')[0];
  const match = Object.keys(TRANSLATIONS).find(key => key.startsWith(lang + '-'));
  return match || 'en-US';
};
const locale = findMatchingLocale(browserLocale);
const t = (key: string) => TRANSLATIONS[locale as keyof typeof TRANSLATIONS]?.[key as keyof typeof TRANSLATIONS['en-US']] || TRANSLATIONS['en-US'][key as keyof typeof TRANSLATIONS['en-US']] || key;

const PianoPlayer = () => {
  const [activeKeys, setActiveKeys] = useState(new Set<string>());
  const [keyAnimations, setKeyAnimations] = useState(new Map<string, number>());
  const [songInput, setSongInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentSong, setCurrentSong] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed] = useState(1.25);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sequenceRef = useRef<NodeJS.Timeout[]>([]);

  // Note frequencies (Web Audio API)
  const noteFrequencies: Record<string, number> = {
    'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63,
    'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00,
    'A#4': 466.16, 'B4': 493.88, 'C5': 523.25, 'C#5': 554.37, 'D5': 587.33,
    'D#5': 622.25, 'E5': 659.25, 'F5': 698.46, 'F#5': 739.99, 'G5': 783.99
  };

  // Piano key mappings - computer keyboard to notes
  const keyMappings: Record<string, string> = {
    'a': 'C4', 'w': 'C#4', 's': 'D4', 'e': 'D#4', 'd': 'E4',
    'f': 'F4', 't': 'F#4', 'g': 'G4', 'y': 'G#4', 'h': 'A4', 
    'u': 'A#4', 'j': 'B4', 'k': 'C5', 'o': 'C#5', 'l': 'D5',
    'p': 'D#5', ';': 'E5', "'": 'F5'
  };

  // All piano keys for display
  const pianoKeys = [
    { note: 'C4', type: 'white', key: 'a' },
    { note: 'C#4', type: 'black', key: 'w' },
    { note: 'D4', type: 'white', key: 's' },
    { note: 'D#4', type: 'black', key: 'e' },
    { note: 'E4', type: 'white', key: 'd' },
    { note: 'F4', type: 'white', key: 'f' },
    { note: 'F#4', type: 'black', key: 't' },
    { note: 'G4', type: 'white', key: 'g' },
    { note: 'G#4', type: 'black', key: 'y' },
    { note: 'A4', type: 'white', key: 'h' },
    { note: 'A#4', type: 'black', key: 'u' },
    { note: 'B4', type: 'white', key: 'j' },
    { note: 'C5', type: 'white', key: 'k' },
    { note: 'C#5', type: 'black', key: 'o' },
    { note: 'D5', type: 'white', key: 'l' },
    { note: 'D#5', type: 'black', key: 'p' },
    { note: 'E5', type: 'white', key: ';' },
    { note: 'F5', type: 'white', key: "'" }
  ];

  // Pre-programmed songs
  const preProgrammedSongs: Record<string, any> = {
    'Happy birthday': {
      title: 'Happy Birthday',
      notes: [
        {note: 'C4', duration: 0.5, time: 0},
        {note: 'C4', duration: 0.5, time: 0.5},
        {note: 'D4', duration: 1, time: 1},
        {note: 'C4', duration: 1, time: 2},
        {note: 'F4', duration: 1, time: 3},
        {note: 'E4', duration: 2, time: 4},
        {note: 'C4', duration: 0.5, time: 6.5},
        {note: 'C4', duration: 0.5, time: 7},
        {note: 'D4', duration: 1, time: 7.5},
        {note: 'C4', duration: 1, time: 8.5},
        {note: 'G4', duration: 1, time: 9.5},
        {note: 'F4', duration: 2, time: 10.5}
      ]
    },
    'Twinkle twinkle little star': {
      title: 'Twinkle Twinkle Little Star',
      notes: [
        {note: 'C4', duration: 0.5, time: 0},
        {note: 'C4', duration: 0.5, time: 0.5},
        {note: 'G4', duration: 0.5, time: 1},
        {note: 'G4', duration: 0.5, time: 1.5},
        {note: 'A4', duration: 0.5, time: 2},
        {note: 'A4', duration: 0.5, time: 2.5},
        {note: 'G4', duration: 1, time: 3},
        {note: 'F4', duration: 0.5, time: 4.5},
        {note: 'F4', duration: 0.5, time: 5},
        {note: 'E4', duration: 0.5, time: 5.5},
        {note: 'E4', duration: 0.5, time: 6},
        {note: 'D4', duration: 0.5, time: 6.5},
        {note: 'D4', duration: 0.5, time: 7},
        {note: 'C4', duration: 1, time: 7.5}
      ]
    },
    'Mary had a little lamb': {
      title: 'Mary Had a Little Lamb',
      notes: [
        {note: 'E4', duration: 0.5, time: 0},
        {note: 'D4', duration: 0.5, time: 0.5},
        {note: 'C4', duration: 0.5, time: 1},
        {note: 'D4', duration: 0.5, time: 1.5},
        {note: 'E4', duration: 0.5, time: 2},
        {note: 'E4', duration: 0.5, time: 2.5},
        {note: 'E4', duration: 1, time: 3},
        {note: 'D4', duration: 0.5, time: 4.5},
        {note: 'D4', duration: 0.5, time: 5},
        {note: 'D4', duration: 1, time: 5.5},
        {note: 'E4', duration: 0.5, time: 7},
        {note: 'G4', duration: 0.5, time: 7.5},
        {note: 'G4', duration: 1, time: 8}
      ]
    }
  };

  // Initialize Web Audio API
  useEffect(() => {
    const initAudio = () => {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        console.log("Web Audio API initialized successfully");
      } catch (error) {
        console.error('Failed to initialize Web Audio API:', error);
      }
    };

    const handleFirstInteraction = () => {
      initAudio();
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Play note using Web Audio API
  const playTone = (frequency: number, duration = 0.5) => {
    if (!audioContextRef.current) return;

    const context = audioContextRef.current;
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.frequency.setValueAtTime(frequency, context.currentTime);
    oscillator.type = 'triangle';

    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, context.currentTime + 0.02);
    gainNode.gain.linearRampToValueAtTime(0.2, context.currentTime + duration * 0.1);
    gainNode.gain.linearRampToValueAtTime(0.15, context.currentTime + duration * 0.8);
    gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);

    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + duration);
  };

  // Play note
  const playNote = useCallback((note: string) => {
    const frequency = noteFrequencies[note];
    if (frequency) {
      playTone(frequency, 0.8);
      
      const noteKey = `${note}-${Date.now()}`;
      setActiveKeys(prev => new Set([...prev, noteKey]));
      
      setKeyAnimations(prev => new Map(prev.set(note, Date.now())));
      
      setTimeout(() => {
        setActiveKeys(prev => {
          const newSet = new Set(prev);
          newSet.delete(noteKey);
          return newSet;
        });
      }, 300);
    }
  }, []);

  // Keyboard event handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isInputFocused) return;
      
      const note = keyMappings[e.key.toLowerCase()];
      if (note && !activeKeys.has(note)) {
        playNote(note);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playNote, activeKeys, isInputFocused]);

  // Mock song parsing function
  const parseSong = async (songText: string) => {
    setIsProcessing(true);
    try {
      // Check if it's a pre-programmed song
      const preProgrammed = preProgrammedSongs[songText];
      if (preProgrammed) {
        setCurrentSong(preProgrammed);
        setTimeout(() => {
          playParsedSong(preProgrammed);
        }, 100);
        return preProgrammed;
      }

      // For other songs, create a simple melody
      const basicMelody = {
        title: songText,
        notes: [
          {note: 'C4', duration: 0.5, time: 0},
          {note: 'D4', duration: 0.5, time: 0.5},
          {note: 'E4', duration: 0.5, time: 1},
          {note: 'F4', duration: 0.5, time: 1.5},
          {note: 'G4', duration: 1, time: 2}
        ]
      };
      
      setCurrentSong(basicMelody);
      setTimeout(() => {
        playParsedSong(basicMelody);
      }, 100);
      
      return basicMelody;
    } catch (error) {
      console.error('Error parsing song:', error);
      alert(t('parseErrorMessage'));
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  const playParsedSong = (songData: any) => {
    if (!songData || !audioContextRef.current) return;

    setIsPlaying(true);
    
    if (sequenceRef.current.length > 0) {
      sequenceRef.current.forEach(clearTimeout);
      sequenceRef.current = [];
    }

    const adjustedNotes = songData.notes.map((note: any) => ({
      ...note,
      time: note.time / playbackSpeed,
      duration: note.duration / playbackSpeed
    }));

    let noteTimeouts: NodeJS.Timeout[] = [];
    
    adjustedNotes.forEach((note: any, index: number) => {
      const timeout = setTimeout(() => {
        const frequency = noteFrequencies[note.note];
        if (frequency) {
          playTone(frequency, note.duration);
        }
        
        const noteKey = `${note.note}-${index}-${Date.now()}`;
        setActiveKeys(prev => new Set([...prev, noteKey]));
        
        setKeyAnimations(prev => new Map(prev.set(note.note, Date.now())));
        
        setTimeout(() => {
          setActiveKeys(prev => {
            const newSet = new Set(prev);
            newSet.delete(noteKey);
            return newSet;
          });
        }, note.duration * 1000);
      }, note.time * 1000);
      
      noteTimeouts.push(timeout);
    });

    sequenceRef.current = noteTimeouts;

    const totalDuration = Math.max(...adjustedNotes.map((n: any) => n.time + n.duration));
    
    const completionTimeout = setTimeout(() => {
      setIsPlaying(false);
      setActiveKeys(new Set());
    }, (totalDuration + 0.5) * 1000);
    
    noteTimeouts.push(completionTimeout);
  };

  const playSong = () => {
    if (!currentSong) return;
    playParsedSong(currentSong);
  };

  const stopSong = () => {
    setIsPlaying(false);
    if (sequenceRef.current.length > 0) {
      sequenceRef.current.forEach(clearTimeout);
      sequenceRef.current = [];
    }
    setActiveKeys(new Set());
  };

  const handleSongSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!songInput.trim()) return;
    
    const songData = await parseSong(songInput);
    if (songData) {
      setSongInput('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 mt-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Music className="w-8 h-8 text-blue-600" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t('appTitle')}
            </h1>
          </div>
          <p className="text-lg text-gray-600">Virtual Piano Experience</p>
        </div>
        
        {/* Song Input Section */}
        <div className="flex justify-center px-8 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20" style={{width: '736px'}}>
            <form onSubmit={handleSongSubmit} className="flex gap-3 items-center">
              <input
                type="text"
                value={songInput}
                onChange={(e) => setSongInput(e.target.value)}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                placeholder={t('songInputPlaceholder')}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none text-gray-700 bg-white/70 backdrop-blur-sm transition-all"
                disabled={isProcessing}
              />
              <button
                type="submit"
                disabled={isProcessing || !songInput.trim()}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
              >
                {isProcessing ? t('processingButton') : t('parseSongButton')}
              </button>
            </form>

            {/* Song Controls */}
            {currentSong && (
              <div className="mt-6 pt-6 border-t border-gray-200/50">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                    <Music className="w-5 h-5" />
                    {isPlaying ? `${t('playingPrefix')}${currentSong.title}` : `${t('readyToPlayPrefix')}${currentSong.title}`}
                  </h3>
                  <div className="flex gap-2">
                    {!isPlaying ? (
                      <button
                        onClick={playSong}
                        className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
                      >
                        <Play className="w-4 h-4" />
                        {t('playButton')}
                      </button>
                    ) : (
                      <button
                        onClick={stopSong}
                        className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
                      >
                        <Square className="w-4 h-4" />
                        {t('stopButton')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Piano Keyboard */}
        <div className="flex justify-center px-8 mb-12">
          <div className="relative bg-gradient-to-b from-gray-100 to-gray-200 p-6 rounded-3xl shadow-2xl border border-gray-300" style={{width: '736px'}}>
            <div className="relative">
              {/* White keys */}
              <div className="flex">
                {pianoKeys.filter(key => key.type === 'white').map((key) => {
                  const isActive = Array.from(activeKeys).some(activeKey => activeKey.startsWith(key.note));
                  const animationKey = keyAnimations.get(key.note) || 0;
                  
                  return (
                    <button
                      key={key.note}
                      onMouseDown={() => playNote(key.note)}
                      className={`
                        w-16 h-64 border-2 border-gray-300 rounded-b-2xl shadow-lg
                        hover:bg-gray-50 active:bg-gray-100 hover:shadow-xl
                        transition-all duration-200 flex flex-col justify-end items-center pb-4
                        transform hover:scale-105 active:scale-95
                        ${isActive ? 'bg-blue-200 border-blue-400 shadow-blue-300 animate-pulse scale-105' : 'bg-white'}
                      `}
                      style={{
                        animationDuration: '0.6s',
                        animationIterationCount: '1',
                        animationKey: animationKey
                      }}
                    >
                      <span className="text-sm text-gray-800 font-bold mb-1 bg-gray-100 px-2 py-1 rounded-full">
                        {key.key?.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-600 font-medium">{key.note}</span>
                    </button>
                  );
                })}
              </div>

              {/* Black keys */}
              <div className="absolute top-0 left-0 flex">
                {pianoKeys.filter(key => key.type === 'black').map((key) => {
                  const whiteKeyIndex = pianoKeys.filter(k => k.type === 'white' && 
                    pianoKeys.indexOf(k) < pianoKeys.indexOf(key)).length;
                  
                  let leftOffset = (whiteKeyIndex * 64) - 24;
                  
                  const isActive = Array.from(activeKeys).some(activeKey => activeKey.startsWith(key.note));
                  const animationKey = keyAnimations.get(key.note) || 0;
                  
                  return (
                    <button
                      key={key.note}
                      onMouseDown={() => playNote(key.note)}
                      style={{ left: `${leftOffset + 6}px`, animationKey: animationKey }}
                      className={`
                        absolute w-12 h-40 bg-gradient-to-b from-gray-800 to-black border-2 border-gray-700 rounded-b-xl shadow-2xl text-white
                        hover:from-gray-700 hover:to-gray-900 active:from-gray-900 active:to-black
                        transition-all duration-200 flex flex-col justify-end items-center pb-4 z-10
                        transform hover:scale-105 active:scale-95
                        ${isActive ? 'from-blue-600 to-blue-800 border-blue-500 animate-pulse scale-105 shadow-blue-400' : ''}
                      `}
                    >
                      <span className="text-xs font-bold bg-black/50 px-1.5 py-1 rounded text-white mb-1">
                        {key.key?.toUpperCase()}
                      </span>
                      <span className="text-xs opacity-90 font-medium">{key.note}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Song Suggestions */}
        <div className="flex justify-center px-8">
          <div style={{width: '736px'}}>
            <h2 className="text-xl font-semibold text-gray-700 text-center mb-4">Try these popular songs:</h2>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                { key: 'happyBirthday', value: 'Happy birthday' },
                { key: 'twinkleTwinkle', value: 'Twinkle twinkle little star' },
                { key: 'maryHadLamb', value: 'Mary had a little lamb' },
                { key: 'jingleBells', value: 'Jingle bells' },
                { key: 'sadMelody', value: 'Sad melody' },
                { key: 'amazingGrace', value: 'Amazing grace' },
                { key: 'silentNight', value: 'Silent night' },
                { key: 'auldLangSyne', value: 'Auld lang syne' }
              ].map((suggestion) => (
                <button
                  key={suggestion.key}
                  onClick={async () => {
                    setCurrentSong(null);
                    setIsPlaying(false);
                    if (sequenceRef.current.length > 0) {
                      sequenceRef.current.forEach(clearTimeout);
                      sequenceRef.current = [];
                    }
                    setActiveKeys(new Set());
                    
                    setSongInput(suggestion.value);
                    await parseSong(suggestion.value);
                  }}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-white/70 text-gray-700 rounded-full text-sm hover:bg-white hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 backdrop-blur-sm"
                >
                  {t(suggestion.key)}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PianoPlayer;