import React, { useRef, useState, useEffect } from "react";
import { Loader } from '@googlemaps/js-api-loader';
import html2canvas from "html2canvas";

export default function GoogleMaps() {
    const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
    const mapRef = useRef(null);
    const googleMapRef = useRef(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [mapState, setMapState] = useState({
        center: { lat: 59.31416, lng: 18.06408 },
        zoom: 17
    });
    const [mapBounds, setMapBounds] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const loader = new Loader({
            apiKey: GOOGLE_API_KEY,
            version: 'weekly'
        });

        loader.load().then(() => {
            const map = new window.google.maps.Map(mapRef.current, {
                center: mapState.center,
                zoom: mapState.zoom,
                mapTypeId: 'satellite',
                disableDefaultUI: true,
                zoomControl: false,
                mapTypeControl: false,
                scaleControl: true,
                streetViewControl: false,
                rotateControl: false,
                fullscreenControl: false,
                draggable: true,
                scrollwheel: true,
                gestureHandling: 'greedy'
            });

            googleMapRef.current = map;

            map.addListener('bounds_changed', () => {
                const bounds = map.getBounds();
                const ne = bounds.getNorthEast();
                const sw = bounds.getSouthWest();
                
                setMapBounds({
                    north: ne.lat(),
                    east: ne.lng(),
                    south: sw.lat(),
                    west: sw.lng()
                });
            });

            map.addListener('idle', () => {
                const center = map.getCenter();
                setMapState({
                    center: { lat: center.lat(), lng: center.lng() },
                    zoom: map.getZoom()
                });
            });
        });
    }, []);
    
    const captureMap = () => {
        if (!googleMapRef.current) return;
    
        const bounds = googleMapRef.current.getBounds();
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();
        const center = {
            lat: (ne.lat() + sw.lat()) / 2,
            lng: (ne.lng() + sw.lng()) / 2
        };
    
        // Get pixel dimensions
        const mapDiv = mapRef.current;
        const width = mapDiv.clientWidth;
        const height = mapDiv.clientHeight;
    
        // Earth's circumference at the equator in meters
        const EARTH_CIRCUMFERENCE = 40075016.686; // meters
    
        // Convert lat/lng degrees to meters (approximate)
        const metersPerDegreeLat = EARTH_CIRCUMFERENCE / 360;
        const metersPerDegreeLng = metersPerDegreeLat * Math.cos(center.lat * Math.PI / 180);
    
        // Calculate the real-world distances in meters
        const realWorldWidth = Math.abs(ne.lng() - sw.lng()) * metersPerDegreeLng;
        const realWorldHeight = Math.abs(ne.lat() - sw.lat()) * metersPerDegreeLat;
    
        // Find the appropriate zoom level
        const TILE_SIZE = 256; // Google Maps tile size
        const MAX_ZOOM = 21;
        const SCALE_FACTOR = 2; // Using scale=2 to improve resolution
    
        const zoomWidth = Math.log2((EARTH_CIRCUMFERENCE / realWorldWidth) * (width / TILE_SIZE));
        const zoomHeight = Math.log2((EARTH_CIRCUMFERENCE / realWorldHeight) * (height / TILE_SIZE));
        const bestZoom = Math.min(zoomWidth, zoomHeight, MAX_ZOOM); // Choose the lower zoom
    
        // Adjust the static map size to match the aspect ratio
        const staticWidth = Math.min(640, width); // Google's max width per scale=1
        const staticHeight = Math.round((staticWidth * height) / width);
    
        // Generate the static map URL
        const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?`
            + `center=${center.lat},${center.lng}`
            + `&zoom=${Math.floor(bestZoom)}` // Use computed zoom
            + `&size=${staticWidth}x${staticHeight}`
            + `&maptype=satellite`
            + `&scale=${SCALE_FACTOR}`
            + `&key=${GOOGLE_API_KEY}`;
    
        // Store image data
        setCapturedImage({
            url: staticMapUrl,
            scale: {
                metersPerPixelLat: realWorldHeight / height,
                metersPerPixelLng: realWorldWidth / width,
                pixelWidth: width,
                pixelHeight: height,
                realWorldWidth: realWorldWidth,
                realWorldHeight: realWorldHeight
            },
            bounds: {
                north: ne.lat(),
                south: sw.lat(),
                east: ne.lng(),
                west: sw.lng()
            }
        });
    };
    

    const exportCoordinates = () => {
        if (!mapBounds || !mapState.center || !capturedImage) return;

        const coordinateData = {
            center: mapState.center,
            bounds: mapBounds,
            zoom: mapState.zoom,
            scale: capturedImage.scale,
            timestamp: new Date().toISOString(),
            imageProperties: {
                width: capturedImage.scale.pixelWidth,
                height: capturedImage.scale.pixelHeight,
                resolution: {
                    metersPerPixelLat: capturedImage.scale.metersPerPixelLat,
                    metersPerPixelLng: capturedImage.scale.metersPerPixelLng
                },
                realWorldDimensions: {
                    width: capturedImage.scale.realWorldWidth,
                    height: capturedImage.scale.realWorldHeight,
                    units: 'meters'
                }
            }
        };

        const dataStr = JSON.stringify(coordinateData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = window.URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `map-coordinates_${mapState.center.lat.toFixed(4)}_${mapState.center.lng.toFixed(4)}_zoom${mapState.zoom}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    const downloadImage = async () => {
        if (!mapRef.current) return;
    
        try {
            // Capture the map div as a canvas
            const canvas = await html2canvas(mapRef.current, {
                useCORS: true, // Helps with cross-origin images
                logging: false,
                allowTaint: true
            });
    
            // Convert the canvas to a data URL
            const imageUrl = canvas.toDataURL("image/png");
    
            // Create a download link
            const link = document.createElement("a");
            link.href = imageUrl;
            link.download = `map_capture_${mapState.center.lat.toFixed(4)}_${mapState.center.lng.toFixed(4)}.png`;
    
            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error capturing map:", error);
            alert("Failed to capture the map. Make sure the map is fully loaded.");
        }
    };
    

    const convertToGeoTIFF = async () => {
        if (!mapRef.current || !mapBounds || !capturedImage) return;
    
        try {
            // Capture the map as canvas
            const canvas = await html2canvas(mapRef.current, {
                useCORS: true,
                logging: false,
                allowTaint: true
            });
            
            // Convert canvas to blob
            const blob = await new Promise(resolve => {
                canvas.toBlob(resolve, 'image/png');
            });
            
            // Create coordinate data
            const coordinateData = {
                center: mapState.center,
                bounds: mapBounds,
                zoom: mapState.zoom,
                scale: capturedImage.scale,
                timestamp: new Date().toISOString(),
                imageProperties: {
                    width: capturedImage.scale.pixelWidth,
                    height: capturedImage.scale.pixelHeight,
                    resolution: {
                        metersPerPixelLat: capturedImage.scale.metersPerPixelLat,
                        metersPerPixelLng: capturedImage.scale.metersPerPixelLng
                    },
                    realWorldDimensions: {
                        width: capturedImage.scale.realWorldWidth,
                        height: capturedImage.scale.realWorldHeight,
                        units: 'meters'
                    }
                }
            };
            
            // Create FormData
            const formData = new FormData();
            formData.append('image', blob, `map_${mapState.center.lat.toFixed(4)}_${mapState.center.lng.toFixed(4)}.png`);
            formData.append('coordinates', JSON.stringify(coordinateData));
            
            console.log("Sending request to backend...");
            
            // Modified fetch request
            const response = await fetch('http://localhost:8000/v1/convert-to-tiff/', {
                method: 'POST',
                headers: {
                },
                body: formData,
            });
            
            console.log("Response status:", response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server returned ${response.status}: ${errorText}`);
            }
            
            // Get the GeoTIFF file and download it
            const tiffBlob = await response.blob();
            const url = window.URL.createObjectURL(tiffBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `map_${mapState.center.lat.toFixed(4)}_${mapState.center.lng.toFixed(4)}.tif`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
        } catch (error) {
            console.error("Error converting to GeoTIFF:", error);
            alert(`Failed to convert image to GeoTIFF: ${error.message}`);
        }
    };

    return (
        <section className="flex flex-col h-[90vh] items-center justify-center w-full bg-gray-200">
            <div ref={mapRef} className="w-[70%] h-[90%]">
                {/* Map will be rendered here */}
            </div>
            <div className="flex gap-4">
                <button 
                    onClick={captureMap}
                    className="mt-4 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors duration-200"
                >
                    Capture Map
                </button>
                <button 
                    onClick={exportCoordinates}
                    className="mt-4 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors duration-200"
                >
                    Export Coordinates
                </button>
                {capturedImage && (
                    <>
                        <button 
                            onClick={downloadImage}
                            className="mt-4 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors duration-200"
                        >
                            Download Map
                        </button>
                        <button 
                            onClick={convertToGeoTIFF}
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
                        >
                            Convert to GeoTIFF
                        </button>
                    </>
                )}
            </div>
            {/* {mapBounds && (
                <div className="mt-4 text-sm text-gray-600">
                    <p>Center: {mapState.center.lat.toFixed(6)}, {mapState.center.lng.toFixed(6)}</p>
                    <p>Zoom: {mapState.zoom}</p>
                </div>
            )} */}
        </section>
    );
}
