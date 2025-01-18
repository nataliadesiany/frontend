import numpy as np
import mido
from scipy.io import wavfile
from scipy.fft import fft
import os

def read_midi_file(midifile_path):
    midi = mido.MidiFile(midifile_path)
    pitches = []
    
    # Ekstraksi pitch dari Channel 1
    for track in midi.tracks:
        for msg in track:
            if msg.type == 'note_on' and msg.channel == 0 :     # Channel 1
                pitches.append(msg.note)
    
    return pitches

def read_wav_file(wavfile_path):
    sample_rate, data = wavfile.read(wavfile_path)

    if len(data.shape) > 1:
        data = data[:, 0]

    spectrum = np.abs(fft(data))
    frequencies = np.fft.fftfreq(len(data), d = 1/sample_rate)

    positive_frequencies = frequencies[:len(frequencies) // 2]
    positive_spectrum = spectrum[:len(spectrum) // 2]
    dominant_frequency = positive_frequencies[np.argmax(positive_spectrum)]

    return [dominant_frequency]

def normalize_pitch(pitches):
    pitches = np.array(pitches)

    if len(pitches) == 0:
        return []
    
    mean_pitch = np.mean(pitches)
    std_pitch = np.std(pitches)
    
    # Normalisasi pitches
    normalized_pitches = (pitches - mean_pitch) / std_pitch
    return normalized_pitches

def process_audio(file_path):
    ext = os.path.splitext(file_path)[1].lower()

    if ext == ".mid" or ext == ".midi":
        audioFormat = "MIDI"
        print("Processing MIDI file....")
        pitches = read_midi_file(file_path)
    elif ext == ".wav":
        audioFormat = "WAV"
        print("Processing WAV file....")
        pitches = read_wav_file(file_path)
    else:
        print("Unsupported file format. Please use a MIDI (.mid) or WAV (.wav) file.")
        return
    
    if not pitches:
        print(f"No notes found in the {audioFormat} file.")

    print("Normalizing pithces.....")
    normalized_pitches = normalize_pitch(pitches)
    print(f"Normalized pitches: {normalized_pitches}")

def main() :
    file_path = ""  # isi dengan file yang berisi MIDI atau WAV
    process_audio(file_path)

if __name__ == "__main__":
    main()