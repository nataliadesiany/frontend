import numpy as np

def tone_distribution():
    def calculate_atb(pitch_list):
        histogram_atb, _ = np.histogram(pitch_list, bins=128, range=(0, 127))
        return histogram_atb

    def calculate_rtb(pitch_list):
        intervals = np.diff(pitch_list) # Hitung interval antar nada
        histogram_rtb, _ = np.histogram(intervals, bins=255, range=(-127, 127))
        return histogram_rtb

    def calculate_ftb(pitch_list):
        first_pitch = pitch_list[0] # Interval relatif terhadap pitch pertama
        intervals = [pitch - first_pitch for pitch in pitch_list]
        histogram_ftb, _ = np.histogram(intervals, bins=255, range=(-127, 127))
        return histogram_ftb
    
    return calculate_atb, calculate_rtb, calculate_ftb
    
def normalize(histogram):
    return histogram / np.sum(histogram)