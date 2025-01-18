import numpy as np

def norm(vector):
    squared_sum = np.sum(v ** 2 for v in vector)
    return np.sqrt(squared_sum)

def cosine_similarity(vectorA, vectorB):
    dotProduct = np.dot(vectorA, vectorB)
    normA = norm(vectorA)
    normB = norm(vectorB)
    if normA == 0 or normB == 0:
        return 0
    return dotProduct / (normA * normB)