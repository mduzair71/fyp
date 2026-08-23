import requests
import os

# Server URL
url = "http://localhost:8000/issues"

# Create a simple test image (1x1 pixel PNG)
image_data = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\x0cIDATx\x9cc\xf8\x0f\x00\x00\x01\x01\x00\x05\x18\r\xb0\x00\x00\x00\x00IEND\xaeB`\x82'

# Save test image
with open("test_image.png", "wb") as f:
    f.write(image_data)

# Prepare form data
files = {'file': ('test_image.png', open('test_image.png', 'rb'), 'image/png')}
data = {
    'title': 'Broken Water Pipe with Photo',
    'description': 'Water leaking from broken pipe near market',
    'location': 'Rajah Bazaar, Rawalpindi',
    'created_by': 'user789'
}

# Send request
try:
    response = requests.post(url, files=files, data=data)
    print("Status Code:", response.status_code)
    print("\nResponse:")
    import json
    print(json.dumps(response.json(), indent=2))
except Exception as e:
    print(f"Error: {e}")
finally:
    # Close file
    if 'file' in files:
        files['file'][1].close()