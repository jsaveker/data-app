# Use the official Python image.
FROM python:3.10

# Set the working directory.
WORKDIR /code

# Install dependencies.
COPY requirements.txt /code/
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Copy the project code.
COPY . /code/

# Expose port 8000.
EXPOSE 8000

# Run the Django development server.
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
