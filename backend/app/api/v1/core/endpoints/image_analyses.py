from fastapi import FastAPI, UploadFile, File, Form, APIRouter
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
from tempfile import NamedTemporaryFile
import json
from typing import Dict, Any
import zipfile

# Fix the import by using relative import
from .image_to_tiff import convert_image_to_tiff
from .deepforest_3dm import generate_3dmfile

# Create the router (this was missing)
router = APIRouter()

# Change this from @app.post to @router.post


@router.post("/download-results/")
async def download_results(
    image: UploadFile = File(...),
    coordinates: str = Form(...)
):
    # Create temporary directory for processing
    os.makedirs("temp", exist_ok=True)

    # Save uploaded image
    temp_image_path = f"temp/map_capture_{image.filename}"
    with open(temp_image_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    # Save coordinates as JSON
    coordinates_dict = json.loads(coordinates)
    temp_json_path = f"temp/map-coordinates.json"
    with open(temp_json_path, "w") as f:
        json.dump(coordinates_dict, f)

    # Output path for the tiff file
    output_tiff_path = f"temp/map_capture_{os.path.splitext(image.filename)[0]}.tif"

    # Convert image to tiff
    convert_image_to_tiff(temp_image_path, output_tiff_path, temp_json_path)

    list_of_files = generate_3dmfile(
        temp_image_path, output_tiff_path, temp_json_path)

    list_of_files.extend([temp_image_path, temp_json_path])

    # Create a zip file containing all files
    zip_path = "temp/results.zip"
    with zipfile.ZipFile(zip_path, 'w') as zipf:
        for file in list_of_files:
            # Get just the filename without the path
            filename = os.path.basename(file)
            zipf.write(file, filename)

    return FileResponse(
        zip_path,
        media_type="application/zip",
        filename="map_results.zip"
    )
