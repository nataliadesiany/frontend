import numpy as np
import os
from typing import List, Tuple, Union
from PIL import Image

def rgb_to_greyscale(image) :
    # RGB to grayscale
    image_array = np.array(image)

    # identifikasi setiap R,G,B
    R = image_array[ :, :, 0]
    G = image_array[ :, :, 1]
    B = image_array[ :, :, 2]

    # RGB to greyscale
    greyscale = R * 0.2989 + G * 0.5870 + B * 0.1140

    # tampilkan greyscale 2D
    return greyscale


def resize_image(image: np.ndarray, target_size: Tuple[int, int]) -> np.ndarray:
    from scipy.ndimage import zoom
    
    pil_image = Image.fromarray(image.astype('uint8'))
    resized_image = pil_image.resize(target_size, Image.Resampling.LANCZOS)
    return np.array(resized_image)

def flatten_image(image: np.ndarray) -> np.ndarray:
    """
    Flatten 2D image array into 1D vector
    """
    return image.flatten()

def load_image(image_path: str) -> Image.Image:
    return Image.open(image_path)

def process_single_image(image_path: str, target_size: Tuple[int, int]) -> np.ndarray:
    """
    Process a single image: load, convert to grayscale, resize, and flatten
    """
    # Load image
    image = load_image(image_path)
    
    # Convert to grayscale
    grayscale = rgb_to_greyscale(image)
    
    # Resize
    resized = resize_image(grayscale, target_size)
    
    # Flatten
    flattened = flatten_image(resized)
    
    return flattened

def process_dataset(dataset_path: str, target_size: Tuple[int, int]) -> List[np.ndarray]:
    """
    Process all images in a dataset directory
    """
    processed_images = []
    
    # Get all image files
    image_files = [f for f in os.listdir(dataset_path) 
                  if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
    
    for image_file in image_files:
        image_path = os.path.join(dataset_path, image_file)
        processed_image = process_single_image(image_path, target_size)
        processed_images.append(processed_image)
        
    return processed_images