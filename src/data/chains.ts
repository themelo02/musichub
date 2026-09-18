import { ChainMap } from '../types';

export const DEFAULT_CHAINS: ChainMap = {
  "Vocal Masculino": [
    { plugin: "Waves Scheps 73", params: { "HPF": "80 Hz", "10kHz": "+2 dB", "Mid": "3.2k +1dB" } },
    { plugin: "Waves CLA-2A", params: { "Peak Reduction": "5", "Gain": "+3 dB", "Mode": "Compress" } },
    { plugin: "Waves Renaissance DeEsser", params: { "Frequency": "7 kHz", "Threshold": "-24 dB", "Range": "-6 dB" } },
    { plugin: "Waves Kramer Master Tape", params: { "Input": "+3 dB", "Speed": "15 ips", "Flux": "185" } },
    { plugin: "Waves H-Delay", params: { "Time": "1/8", "Mix": "15%", "Feedback": "20%", "Filter": "HPF 200 / LPF 4k" } }
  ],
  "Vocal Feminino": [
    { plugin: "Waves SSL E-Channel", params: { "HPF": "100 Hz", "HF": "12 kHz +2dB", "LF": "80 Hz -2dB" } },
    { plugin: "Waves CLA-76", params: { "Ratio": "4:1", "Attack": "3", "Release": "5" } },
    { plugin: "Waves DeEsser", params: { "Frequency": "8 kHz", "Threshold": "-22 dB" } },
    { plugin: "Waves Aphex Vintage Aural Exciter", params: { "AX Mix": "25%", "Mode": "1" } },
    { plugin: "Waves TrueVerb", params: { "Decay": "1.2s", "Pre-delay": "25 ms", "Distance": "15" } }
  ],
  "Vocal Rap": [
    { plugin: "Waves Scheps 73", params: { "HPF": "80 Hz", "Low": "110 Hz -1dB", "High": "12 kHz +1.5dB" } },
    { plugin: "Waves CLA-76", params: { "Ratio": "8:1", "Attack": "4", "Release": "7" } },
    { plugin: "Waves DeEsser", params: { "Frequency": "6.5 kHz", "Threshold": "-20 dB" } },
    { plugin: "Waves Berzerk Distortion", params: { "Drive": "18%", "Mix": "25%", "Character": "Warm" } },
    { plugin: "Waves H-Delay", params: { "Time": "1/8 Ping-Pong", "Mix": "12%", "LPF": "3.5 kHz" } }
  ],
  "Vocal Trap": [
    { plugin: "Waves F6 Dynamic EQ", params: { "Band 1": "HPF 90 Hz", "Band 2": "250 Hz -2dB Dynamic", "Band 5": "4 kHz +2dB" } },
    { plugin: "Waves CLA-76", params: { "Ratio": "8:1", "Attack": "Fast", "Release": "Fast" } },
    { plugin: "Waves DeEsser", params: { "Frequency": "7.2 kHz", "Threshold": "-22 dB" } },
    { plugin: "Waves MaxxBass", params: { "Focus": "80 Hz", "Decay": "25%", "Original Bass": "-1 dB" } },
    { plugin: "Waves L3-16 Multimaximizer", params: { "Threshold": "-6 dB", "Ceiling": "-0.3 dB" } }
  ],
  "Vocal Afrobeat": [
    { plugin: "Waves Scheps 73", params: { "HPF": "80 Hz", "10 kHz": "+2.5 dB", "1.6 kHz": "+1 dB" } },
    { plugin: "Waves CLA-2A", params: { "Peak Reduction": "4", "Gain": "+2 dB" } },
    { plugin: "Waves Renaissance DeEsser", params: { "Frequency": "7 kHz", "Threshold": "-25 dB" } },
    { plugin: "Waves Vitamin Sonic Enhancer", params: { "Bass": "+2", "Low Mid": "0", "High Mid": "+2.5", "Treble": "+3" } },
    { plugin: "Waves H-Delay", params: { "Time": "1/8 Dotted", "Mix": "18%", "Ping-Pong": "On" } }
  ],
  "Vocal R&B": [
    { plugin: "Waves SSL E-Channel", params: { "HPF": "85 Hz", "1.5 kHz": "-1.5 dB", "8 kHz": "+2 dB" } },
    { plugin: "Waves CLA-2A", params: { "Peak Reduction": "5.5", "Gain": "+3.5 dB" } },
    { plugin: "Waves DeEsser", params: { "Frequency": "7 kHz", "Threshold": "-26 dB" } },
    { plugin: "Waves PuigTec EQP-1A", params: { "CPS 100": "+1.5", "KCS 10": "+2.5", "Bandwidth": "5" } },
    { plugin: "Waves TrueVerb", params: { "Decay": "1.8s", "Pre-delay": "35 ms", "Mix": "22%" } }
  ],
  "Kick Punchy": [
    { plugin: "Waves SSL E-Channel", params: { "60 Hz": "+3 dB", "300 Hz": "-3.5 dB (Q 2.5)", "4 kHz": "+3 dB" } },
    { plugin: "Waves CLA-76", params: { "Ratio": "4:1", "Attack": "Slow (3)", "Release": "Fast (7)" } },
    { plugin: "Waves Smack Attack", params: { "Attack": "+3.5 dB", "Sustain": "-1.5 dB", "Sensitivity": "60%" } },
    { plugin: "Waves Kramer Master Tape", params: { "Input": "+2 dB", "Speed": "15 ips", "Bias": "Over" } },
    { plugin: "Waves TrueVerb", params: { "Decay": "0.6s", "Mix": "8%", "Pre-delay": "0 ms" } }
  ],
  "Snare Agressiva": [
    { plugin: "Waves API 550", params: { "200 Hz": "+3 dB", "5 kHz": "+2 dB", "10 kHz": "+1.5 dB" } },
    { plugin: "Waves CLA-76", params: { "Ratio": "4:1", "Attack": "4", "Release": "6" } },
    { plugin: "Waves Smack Attack", params: { "Attack": "+2.5 dB", "Duration": "Normal" } },
    { plugin: "Waves Berzerk Distortion", params: { "Drive": "25%", "Mix": "20%", "Tone": "Bright" } },
    { plugin: "Waves Abbey Road Chambers", params: { "Decay": "1.2s", "Filter": "HPF 150 / LPF 6k" } }
  ],
  "808 Forte": [
    { plugin: "Waves F6 Dynamic EQ", params: { "HPF": "28 Hz", "80 Hz": "-2 dB Dynamic", "160 Hz": "+1 dB" } },
    { plugin: "Waves CLA-76", params: { "Ratio": "4:1", "Attack": "Medium", "Release": "Fast" } },
    { plugin: "Waves MaxxBass", params: { "Focus": "80 Hz", "Intensity": "35%", "High Pass": "On" } },
    { plugin: "Waves LoAir", params: { "Frequency": "32 Hz", "Lo": "40%", "Align": "0 ms" } },
    { plugin: "Waves API 2500", params: { "Ratio": "4:1", "Thrust": "Loud", "Knee": "Hard" } }
  ],
  "Drum Bus Moderno": [
    { plugin: "Waves API 2500", params: { "Ratio": "4:1", "Attack": "30 ms", "Release": "Auto", "Thrust": "Medium" } },
    { plugin: "Waves Smack Attack", params: { "Attack": "+2 dB", "Sustain": "+1 dB" } },
    { plugin: "Waves C6 Multiband", params: { "Low Band 30-120 Hz": "Threshold -18dB", "Mid Band": "Dynamic control" } },
    { plugin: "Waves Vitamin Sonic Enhancer", params: { "Bass": "+2 dB", "Mid": "0 dB", "Treble": "+1.5 dB" } },
    { plugin: "Waves L3-16 Multimaximizer", params: { "Threshold": "-6 dB", "Ceiling": "-0.3 dB", "Release": "Auto" } }
  ],
  "Percussão Afrobeat": [
    { plugin: "Waves Maserati DRM", params: { "Mode": "Percussion", "Top": "+2", "Bottom": "+1", "Air": "+3" } },
    { plugin: "Waves CLA-2A", params: { "Peak Reduction": "4", "Gain": "+1 dB" } },
    { plugin: "Waves MaxxBass", params: { "Focus": "60 Hz", "Original Bass": "-1 dB" } },
    { plugin: "Waves H-Delay", params: { "Time": "1/8 Dotted", "Mix": "14%", "Lo-Fi": "On" } },
    { plugin: "Waves TrueVerb", params: { "Decay": "1.2s", "Pre-delay": "15 ms", "Distance": "20" } }
  ],
  "Master Transparente": [
    { plugin: "Waves Linear Phase EQ", params: { "HPF": "20 Hz (18dB/oct)", "250 Hz": "-0.5 dB", "12 kHz": "+0.8 dB Shelf" } },
    { plugin: "Waves C4 Multiband", params: { "Ratio": "1.5:1", "Range": "-2 dB", "Attack": "Slow" } },
    { plugin: "Waves Abbey Road TG Mastering", params: { "Comp Ratio": "2:1", "Presence": "0.5 dB", "Spread": "105%" } },
    { plugin: "Waves L2 Ultramaximizer", params: { "Threshold": "-3 dB", "Ceiling": "-0.3 dB", "Release": "Auto" } }
  ],
  "Master Comercial": [
    { plugin: "Waves F6 Dynamic EQ", params: { "200-400 Hz": "-1.5 dB Dynamic", "3.5 kHz": "+1 dB Dynamic" } },
    { plugin: "Waves SSL G-Master", params: { "Ratio": "4:1", "Attack": "30 ms", "Release": "Auto (0.1s)", "Threshold": "+2 dB GR" } },
    { plugin: "Waves Vitamin Sonic Enhancer", params: { "Bass": "+1.5 dB", "Low Mid": "0", "High Mid": "+1 dB", "Treble": "+2 dB" } },
    { plugin: "Waves L3-16 Multimaximizer", params: { "Threshold": "-8 dB", "Ceiling": "-0.2 dB", "Profile": "Loud & Clean" } },
    { plugin: "Waves WLM Plus Loudness Meter", params: { "Target": "-14 LUFS", "True Peak Max": "-1.0 dBTP" } }
  ],
  "Master Loud": [
    { plugin: "Waves F6 Dynamic EQ", params: { "300 Hz": "-1.8 dB Cut", "60 Hz": "+1 dB Control" } },
    { plugin: "Waves SSL G-Master", params: { "Ratio": "4:1", "Attack": "30 ms", "Release": "0.1s" } },
    { plugin: "Waves MaxxBass", params: { "Focus": "80 Hz", "Intensity": "20%" } },
    { plugin: "Waves L3-16 Multimaximizer", params: { "Threshold": "-10 dB", "Ceiling": "-0.1 dB", "Priority": "Low end preserved" } }
  ],
  "Master Streaming": [
    { plugin: "Waves Linear Phase EQ", params: { "HPF": "25 Hz", "150 Hz": "-0.5 dB", "10 kHz": "+0.5 dB" } },
    { plugin: "Waves C4 Multiband", params: { "Band 1": "1.5:1", "Band 2": "1.5:1", "Band 3": "1.5:1", "Band 4": "1.5:1" } },
    { plugin: "Waves L2 Ultramaximizer", params: { "Threshold": "-4 dB", "Ceiling": "-1.0 dBTP" } },
    { plugin: "Waves WLM Plus Loudness Meter", params: { "Target": "-14 LUFS Integrated", "True Peak": "-1.0 dBTP" } }
  ]
};
