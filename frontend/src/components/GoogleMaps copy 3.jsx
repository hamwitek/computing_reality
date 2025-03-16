import React, { useRef, useState, useEffect } from "react";
import { Loader } from '@googlemaps/js-api-loader';

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
                zoomControl: true,
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

        const { center, zoom } = mapState;
        const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${center.lat},${center.lng}&zoom=${zoom}&size=800x600&maptype=satellite&key=${GOOGLE_API_KEY}`;
        
        fetch(staticMapUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                setCapturedImage(staticMapUrl);
                console.log('Map captured successfully!');
            })
            .catch(error => {
                if (!error.message.includes('Tracking Prevention')) {
                    console.error('Error capturing map:', error);
                }
            });
    };

    const downloadImage = async () => {
        if (capturedImage) {
            try {
                const response = await fetch(capturedImage);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const blob = await response.blob();
                const imageUrl = window.URL.createObjectURL(blob);
                
                const link = document.createElement('a');
                link.href = imageUrl;
                link.download = 'captured-map.png';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(imageUrl);
            } catch (error) {
                if (!error.message.includes('Tracking Prevention')) {
                    console.error('Error downloading map:', error);
                }
            }
        }
    };

    const exportCoordinates = () => {
        if (!mapBounds || !mapState.center) return;

        const coordinateData = {
            center: mapState.center,
            bounds: mapBounds,
            zoom: mapState.zoom,
            timestamp: new Date().toISOString()
        };

        const dataStr = JSON.stringify(coordinateData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = window.URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'map-coordinates.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    return (
        <section className="flex flex-col h-[70vh] items-center justify-center w-full bg-gray-200">
            <div ref={mapRef} className="w-[50%] h-[80%]">
                {/* Map will be rendered here */}
            </div>
            <div className="flex gap-4">
                <button 
                    onClick={captureMap}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Capture Map
                </button>
                <button 
                    onClick={exportCoordinates}
                    className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    Export Coordinates
                </button>
                {capturedImage && (
                    <button 
                        onClick={downloadImage}
                        className="mt-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                    >
                        Download Map
                    </button>
                )}
            </div>
            {mapBounds && (
                <div className="mt-4 text-sm text-gray-600">
                    <p>Center: {mapState.center.lat.toFixed(6)}, {mapState.center.lng.toFixed(6)}</p>
                    <p>Zoom: {mapState.zoom}</p>
                </div>
            )}
        </section>
    );
}
