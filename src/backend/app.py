from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
import time
from werkzeug.utils import secure_filename
from sklearn.metrics.pairwise import cosine_similarity
from utils.pca_utils import process_image, pca_using_svd
from utils.audio_utils import tone_distribution, process_audio, normalize, clean_features
import numpy as np

app = Flask(__name__)
CORS(app)

# Configurations
UPLOAD_FOLDER = 'src/backend/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'wav', 'mid', 'json', 'txt', 'zip'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Global dataset storage
dataset_images = []
dataset_audio = []
mappings = {}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload/dataset', methods=['POST'])
def upload_dataset():
    global dataset_images, dataset_audio, mappings

    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        if filename.endswith(('.png', '.jpg', '.jpeg')):
            dataset_images.append(process_image(file_path))
        elif filename.endswith(('.wav', '.mid')):
            dataset_audio.append({'path': file_path, 'name': filename})
        elif filename.endswith('.json'):
            with open(file_path, 'r') as f:
                mappings = json.load(f)
        return jsonify({'message': f'{filename} uploaded successfully'}), 200
    else:
        return jsonify({'error': 'Invalid file type'}), 400

@app.route('/query/image', methods=['POST'])
def query_image():
    start_time = time.time()

    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        # Proses query image
        query_image_vector = process_image(file_path).reshape(1, -1)

        # Hitung PCA
        images_matrix = np.array(dataset_images)
        mean_vector = np.mean(images_matrix, axis=0)
        pca_data, eigenvectors, _ = pca_using_svd(images_matrix, component=50)

        # Validasi dimensi query image
        if query_image_vector.shape[1] != mean_vector.shape[0]:
            return jsonify({'Error': 'Query image dimensions do not match dataset'}), 400

        # Proyeksikan query image
        centered_query = query_image_vector - mean_vector
        query_projection = np.dot(centered_query, eigenvectors)

        # Hitung jarak
        distances = [
            (idx, float(np.sqrt(np.sum((query_projection - db_projection.reshape(1, -1)) ** 2))))
            for idx, db_projection in enumerate(pca_data)
        ]

        min_distance = min(dist for _, dist in distances)
        max_distance = max(dist for _, dist in distances)

        filtered_results = [
            {'index': int(idx), 'similarity': (1 - (float(dist) - min_distance) / (max_distance - min_distance)) * 100}
            for idx, dist in distances
        ]

        execution_time_ms = (time.time() - start_time) * 1000
        return jsonify({'results': filtered_results, 'execution_time_ms': f"{execution_time_ms:.2f}"}), 200
    else:
        return jsonify({'error': 'Invalid file type'}), 400



@app.route('/query/audio', methods=['POST'])
def query_audio():
    start_time = time.time()
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        # Proses audio untuk ekstraksi fitur
        query_pitches = process_audio(file_path)
        if query_pitches is None or query_pitches.size == 0:
            return jsonify({'error': 'No valid pitches found in the query file.'}), 400

        print("Query Pitches:", query_pitches)  # Cek output process_audio

        try:
            calculate_atb, calculate_rtb, calculate_ftb = tone_distribution()
        except Exception as e:
            return jsonify({'error': f'Error in tone distribution functions: {str(e)}'}), 400

        # Normalisasi dan pengecekan setiap hasil normalisasi
        try:
            query_atb = normalize(calculate_atb(query_pitches))
            query_rtb = normalize(calculate_rtb(query_pitches))
            query_ftb = normalize(calculate_ftb(query_pitches))
        except Exception as e:
            return jsonify({'error': f'Error in normalizing features: {str(e)}'}), 400

        print("Normalized ATB:", query_atb)
        print("Normalized RTB:", query_rtb)
        print("Normalized FTB:", query_ftb)

        # Gabungkan fitur
        query_features = np.concatenate([query_atb, query_rtb, query_ftb])

        # Ekstraksi fitur dataset audio
        dataset_features = []
        for audio in dataset_audio:
            pitches = process_audio(audio['path'])
            if pitches is None or pitches.size == 0:
                continue

            print(f"Pitches for {audio['name']}:", pitches)

            try:
                features = np.concatenate([
                    normalize(calculate_atb(pitches)),
                    normalize(calculate_rtb(pitches)),
                    normalize(calculate_ftb(pitches)),
                ])
            except Exception as e:
                print(f"Error normalizing features for {audio['name']}: {str(e)}")
                continue

            dataset_features.append(features)

        # Perhitungan cosine similarity
        similarities = [
            cosine_similarity(
                clean_features(query_features).reshape(1, -1),
                clean_features(dataset_feat).reshape(1, -1)
            )[0][0]
            for dataset_feat in dataset_features
        ]

        min_sim = min(similarities)
        max_sim = max(similarities)

        filtered_results = [
            {'index': idx, 'similarity': (sim - min_sim) / (max_sim - min_sim) * 100, 'file': dataset_audio[idx]['name']}
            for idx, sim in enumerate(similarities)
        ]

        execution_time_ms = (time.time() - start_time) * 1000
        return jsonify({'results': filtered_results, 'execution_time_ms': f"{execution_time_ms:.2f}"}), 200
    else:
        return jsonify({'error': 'Invalid file type'}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5001)
