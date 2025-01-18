from typing import List, Tuple

# Retrieval and Output
def retrieve_similar_images(distances: List[Tuple[int, float]], 
                          limit: int = None, 
                          distance_threshold: float = None) -> List[Tuple[int, float]]:
    if not distances:
        return []
    
    # Sort distances if not already sorted
    sorted_distances = sorted(distances, key=lambda x: x[1])
    
    if distance_threshold is not None:
        # Filter by distance threshold
        return [pair for pair in sorted_distances if pair[1] <= distance_threshold]
    
    if limit is not None:
        # Limit number of results
        return sorted_distances[:limit]
    
    return sorted_distances

def format_results(similar_images: List[Tuple[int, float]], 
                  image_filenames: List[str] = None) -> None:

    print("\nRetrieved similar images:")
    print("-" * 40)
    
    for idx, (image_idx, distance) in enumerate(similar_images, 1):
        if image_filenames:
            filename = image_filenames[image_idx]
            print(f"{idx}. Image: {filename} (Distance: {distance:.4f})")
        else:
            print(f"{idx}. Image Index: {image_idx} (Distance: {distance:.4f})")