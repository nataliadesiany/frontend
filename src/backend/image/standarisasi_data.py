import numpy as np

# standarisasi (data centering)
def standarisasi_data(data):
    # menghitung mean dan std dari data
    # μj = (1/N) * Σ(i=1 to N) xij
    mean = np.mean(data, axis=0)
    
    # xij' = xij - μj
    standard_data = data - mean
    return standard_data