import numpy as np
from typing import List, Tuple

def project_query_image(query_image: np.ndarray, mean_vector: np.ndarray, eigenvectors: np.ndarray) -> np.ndarray :
    centered_query = query_image - mean_vector
    return np.dot(centered_query, eigenvectors)

def compute_euclidean_distance(query_vector: np.ndarray, 
                             database_vector: np.ndarray) -> float:

    return np.sqrt(np.sum((query_vector - database_vector) ** 2))

def find_similar_images(query_image: np.ndarray,
                       database_projections: np.ndarray,
                       mean_vector: np.ndarray,
                       eigenvectors: np.ndarray) -> List[Tuple[int, float]]:
    
    # Project query image into PCA space
    query_projection = project_query_image(query_image, mean_vector, eigenvectors)
    
    # Compute distances between query and all database images
    distances = []
    for idx, db_projection in enumerate(database_projections):
        dist = compute_euclidean_distance(query_projection, db_projection)
        distances.append((idx, dist))
    
    # Sort by distance (ascending)
    return sorted(distances, key=lambda x: x[1])