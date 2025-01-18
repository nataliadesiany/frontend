import numpy as np
import os
from greyscale import process_dataset, process_single_image
from pca_with_svd import pca_using_svd
from similarity_computation import find_similar_images
from retrieval_output import retrieve_similar_images, format_results


def main():
    # Path untuk dataset dan gambar query
    current_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_path = os.path.abspath(os.path.join(current_dir, "..", "app", "dataset"))
    query_image_path = os.path.abspath(os.path.join(current_dir, "..", "app", "query_image.jpg"))
    
    # Ukuran target untuk resizing gambar
    target_size = (50, 50)
    
    # Jumlah komponen PCA
    pca_components = 50
    
    # Langkah 1: Proses dataset gambar
    print("Processing dataset images...")
    dataset_vectors = process_dataset(dataset_path, target_size)
    dataset_matrix = np.vstack(dataset_vectors)
    
    # Standarisasi dan PCA
    print("Performing PCA on dataset...")
    pca_projections, eigenvectors, _ = pca_using_svd(dataset_matrix, pca_components)
    mean_vector = np.mean(dataset_matrix, axis=0)
    
    # Langkah 2: Proses gambar query
    print("Processing query image...")
    query_vector = process_single_image(query_image_path, target_size)
    
    # Langkah 3: Cari gambar mirip
    print("Finding similar images...")
    distances = find_similar_images(query_vector, pca_projections, mean_vector, eigenvectors)
    
    # Langkah 4: Ambil hasil berdasarkan limit atau threshold jarak
    limit = 5
    similar_images = retrieve_similar_images(distances, limit=limit)
    
    # Format nama file dari dataset
    image_files = [f for f in os.listdir(dataset_path) 
                   if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
    
    # Langkah 5: Format dan tampilkan hasil
    format_results(similar_images, image_files)

if __name__ == "__main__":
    main()