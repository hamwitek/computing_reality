import numpy as np
import rasterio
from rasterio.transform import from_bounds
from PIL import Image
import json


def convert_image_to_tiff(image_path, output_path, json_path):
    """
    Convert an image to GeoTIFF using coordinate data

    Args:
        image_path (str): Path to the input image
        json_path (str): Path to the coordinate JSON file
        output_path (str): Path to save the output GeoTIFF

    Returns:
        str: Path to the created GeoTIFF file
    """
    # Load the JSON metadata
    with open(json_path, "r") as f:
        google_maps_metadata = json.load(f)

    # Load the image and force RGB mode
    image = Image.open(image_path).convert("RGB")

    # Convert image to NumPy array
    image_array = np.array(image)
    print(f"Image array shape: {image_array.shape}")  # Debugging output

    # Handle grayscale images
    if len(image_array.shape) == 2:  # Grayscale image detected
        image_array = np.stack([image_array] * 3, axis=-1)  # Convert to RGB

    # Get image dimensions
    height, width, _ = image_array.shape

    # Extract bounds from JSON
    west, south, east, north = (
        google_maps_metadata["bounds"]["west"],
        google_maps_metadata["bounds"]["south"],
        google_maps_metadata["bounds"]["east"],
        google_maps_metadata["bounds"]["north"]
    )

    # Create transformation (maps pixel coordinates to geographic coordinates)
    transform = from_bounds(west, south, east, north, width, height)

    # Write as GeoTIFF
    with rasterio.open(
        output_path,
        "w",
        driver="GTiff",
        height=height,
        width=width,
        count=3,  # RGB image
        dtype=image_array.dtype,
        crs="EPSG:4326",  # WGS84 coordinate system (used by Google Maps)
        transform=transform
    ) as dst:
        for i in range(3):  # Write RGB channels
            dst.write(image_array[:, :, i], i + 1)

    print(f"GeoTIFF saved at {output_path}")
    return output_path


# # Allow script to be run directly for testing/debugging
# if __name__ == "__main__":
#     # File paths
#     image_path = "image_to_analyse/map_capture.png"
#     output_path = "image_to_analyse/map_capture.tif"
#     json_path = "image_to_analyse/map-coordinates.json"

#     convert_image_to_tiff(image_path, output_path, json_path)
