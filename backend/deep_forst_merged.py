from pyproj import Proj, Transformer
# import cv2
import json
import rhino3dm
import os
import numpy as np
import rasterio
from deepforest import main
import matplotlib.pyplot as plt

# Image path
image_path = "image_to_analyse/map_capture.tif"
json_file = "image_to_analyse/map-coordinates.json"
image_file = "image_to_analyse/map_capture.png"

# Read image
with rasterio.open(image_path) as src:
    image = src.read()  # (Channels, Height, Width)

# Ensure correct format (Height, Width, Channels)
image = np.moveaxis(image, 0, -1)  # Convert (3, H, W) -> (H, W, 3)
print(f"Fixed Image shape: {image.shape}")  # Debugging output

# Load DeepForest model
model = main.deepforest()
# model.use_release()
model.load_model(model_name="weecology/deepforest-tree")
print("Model loaded successfully!")

# Run tree detection with lower threshold
boxes = model.predict_image(image.astype("float32"))
boxes.root_dir = os.path.dirname(image_path)

# Filter boxes with a score threshold (e.g., 0.1)
boxes = boxes[boxes["score"] > 0.1]  # Adjust the threshold as needed
print(f"Detected {len(boxes)} trees after filtering.")

# If no trees are detected, print a message
if boxes.empty:
    print("⚠️ No trees detected! Try lowering the threshold or using a different image.")
else:
    # Calculate center points for each box
    boxes['center_x'] = (boxes['xmin'] + boxes['xmax']) / 2
    boxes['center_y'] = (boxes['ymin'] + boxes['ymax']) / 2

    # Show detected trees on image
    fig, ax = plt.subplots(figsize=(10, 10))
    ax.imshow(image)

    for _, row in boxes.iterrows():
        # Draw rectangle
        x, y, w, h = row["xmin"], row["ymin"], row["xmax"] - \
            row["xmin"], row["ymax"] - row["ymin"]
        rect = plt.Rectangle((x, y), w, h, linewidth=2,
                             edgecolor="r", facecolor="none")
        ax.add_patch(rect)

        # Draw center point
        ax.plot(row['center_x'], row['center_y'], 'bo',
                markersize=2)  # Blue dot for center

    plt.title("Tree Detection Results with Center Points")

    # Save the figure in the "image_to_analyse" directory
    output_image_path = os.path.join(os.path.dirname(
        image_path), "tree_detection_results.png")
    plt.savefig(output_image_path)
    print(f"Result image saved at: {output_image_path}")

############################################ Rhino########################################

# Load JSON coordinate file

# image_file = "tree_detection_results.png"
output_rhino_file = "map_with_image.3dm"

with open(json_file, "r") as f:
    geo_data = json.load(f)

# Extract geographic bounds (WGS84)
lat_min = geo_data["bounds"]["south"]
lat_max = geo_data["bounds"]["north"]
lon_min = geo_data["bounds"]["west"]
lon_max = geo_data["bounds"]["east"]

# Convert Lat/Lon to UTM
proj_wgs84 = Proj(proj="latlong", datum="WGS84")
proj_utm = Proj(proj="utm", zone=33, ellps="WGS84",
                south=True)  # Adjust UTM zone

# Use Transformer instead of deprecated transform()
transformer = Transformer.from_proj(proj_wgs84, proj_utm, always_xy=True)
x_min, y_min = transformer.transform(lon_min, lat_min)
x_max, y_max = transformer.transform(lon_max, lat_max)

# Create Rhino model
model = rhino3dm.File3dm()

# Define surface corners
corner1 = rhino3dm.Point3d(x_min, y_min, 0)
corner2 = rhino3dm.Point3d(x_max, y_min, 0)
corner3 = rhino3dm.Point3d(x_max, y_max, 0)
corner4 = rhino3dm.Point3d(x_min, y_max, 0)

# Create a closed polyline curve from the corners
# Closing the curve by adding corner1 again
curve = rhino3dm.PolylineCurve([corner1, corner2, corner3, corner4, corner1])


# Create an extruded surface
surface = rhino3dm.Extrusion.Create(curve, -0.01, True)

# Convert the extrusion to a Brep, providing the required argument
box = surface.ToBrep(False)

# Access the top face of the Brep
top_face = box.Faces[5]
top_face = top_face.ToNurbsSurface()


# Rhino Material with Image Texture
material = rhino3dm.Material()
material.Name = "OrthoPhoto"
material.SetBitmapTexture(image_file)  # Attach image
model.Materials.Add(material)

# Assign material to object
attributes = rhino3dm.ObjectAttributes()
attributes.MaterialIndex = 0
attributes.MaterialSource = rhino3dm.ObjectMaterialSource.MaterialFromObject

# Add the top face to the model
model.Objects.AddSurface(top_face, attributes)

# MOVE the center points transformation HERE, after loading the JSON file
# Transform center points to geographic coordinates
center_points = []

for _, row in boxes.iterrows():
    # Calculate the normalized coordinates
    norm_x = (row['center_x'] / image.shape[1]) * (lon_max - lon_min) + lon_min
    # Fix the vertical mirroring by inverting the y-coordinate
    norm_y = ((image.shape[0] - row['center_y']) /
              image.shape[0]) * (lat_max - lat_min) + lat_min

    # Append the transformed coordinates
    center_points.append((norm_x, norm_y))

# Convert Lat/Lon to UTM and create points in Rhino
for lon, lat in center_points:
    x_utm, y_utm = transformer.transform(lon, lat)  # Transform to UTM
    point = rhino3dm.Point3d(x_utm, y_utm, 0)  # Create a point at Z=0
    model.Objects.AddPoint(point)  # Add point to the Rhino model

# Save Rhino file
model.Write(output_rhino_file, 6)
print(f"Rhino file saved: {output_rhino_file}")
