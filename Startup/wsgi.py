from pro1 import app
import os
from dotenv import load_dotenv

load_dotenv()

if __name__ == "__main__":
    # If running on Windows directly
    if os.name == 'nt':
        from waitress import serve
        serve(app, host='0.0.0.0', port=5000)
    else:
        # Gunicorn should be used on Linux/Docker
        app.run(host='0.0.0.0', port=5000)
