from flask import Flask, request, jsonify
from PIL import Image
import io
import numpy as np
import tensorflow as tf

model = tf.keras.models.load_model('mohinhnhandanghoalan.h5')

app = Flask(__name__)

def transform_image(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    image = image.resize((224, 224))  # Resize đúng input của model
    image_array = np.array(image) / 255.0  # Normalize về [0, 1]
    return np.expand_dims(image_array, axis=0)  # Thêm batch dimension

@app.route('/')
def home():
    return "Ứng dụng nhận dạng hoa lan đã sẵn sàng Gửi ảnh POST đến /predict"

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    file = request.files['image']
    img_bytes = file.read()
    input_tensor = transform_image(img_bytes)

    predictions = model.predict(input_tensor)
    predicted_class = int(np.argmax(predictions))
    class_labels = ['Anoectochilus', 'Bulbophyllum auricomum', 'Bulbophyllum coweniorum', 'Bulbophyllum dayanum', 'Bulbophyllum lasiochilum', 'Bulbophyllum lindleyanum', 'Bulbophyllum lobbii', 'Bulbophyllum longissimum', 'Bulbophyllum medusae', 'Bulbophyllum patens', 'Calanthe', 'Chiloschista parishii', 'Chiloschista viridiflava', 'Cymbidium finlaysonianum', 'Dendrobium chrysotoxum', 'Dendrobium farmeri', 'Dendrobium fimbriatum', 'Dendrobium lindleyi', 'Dendrobium primulinum', 'Dendrobium pulchellum', 'Dendrobium secundum', 'Dendrobium senile', 'Dendrobium signatum', 'Dendrobium thyrsiflorum', 'Dendrobium tortile', 'Phalaenopsis subg. Hygrochilus']

    return jsonify({'result': class_labels[predicted_class]})

if __name__ == '__main__':
    app.run(port=5000)