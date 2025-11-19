FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements first to leverage Docker cache
COPY requirements.txt .

# Upgrade pip and install dependencies
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Install spaCy model
RUN python -m spacy download en_core_web_sm

COPY . .

# Expose port (Render will provide PORT env var at runtime)
EXPOSE 8000

# Run migrations, collect static files, and start server
# Use PORT env var from Render, default to 8000 for local development
CMD ["sh", "-c", "python manage.py migrate && python manage.py collectstatic --noinput && gunicorn profilematch.wsgi:application --bind 0.0.0.0:${PORT:-8000} --timeout 120 --workers 1"]