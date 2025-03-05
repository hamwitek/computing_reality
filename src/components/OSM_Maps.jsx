import React, { useRef, useState } from "react";
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import html2canvas from "html2canvas";

export default function OSM_Maps() {
    const mapRef = useRef(null);
    const [capturedImage, setCapturedImage] = useState(null);

    const captureMap = async () => {
        if (mapRef.current) {
            try {
                const options = {
                    useCORS: true,
                    scrollX: 0,
                    scrollY: 0
                };
                const canvas = await html2canvas(mapRef.current, options);
                const imageData = canvas.toDataURL('image/png');
                setCapturedImage(imageData);
                console.log('Map captured successfully!');
            } catch (error) {
                console.error('Error capturing map:', error);
            }
        }
    };

    const downloadImage = () => {
        if (capturedImage) {
            const link = document.createElement('a');
            link.href = capturedImage;
            link.download = 'captured-map.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <section className="flex flex-col h-[70vh] items-center justify-center w-full bg-gray-200">
            <div ref={mapRef} className="flex w-[50%] h-[80%] overflow-hidden">
                <MapContainer 
                    center={[59.31416, 18.06408]} 
                    zoom={17} 
                    style={{ width: '100%', height: '100%' }}
                >
                    <TileLayer
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
                        maxZoom={19}
                    />
                </MapContainer>
            </div>
            <div className="flex gap-4 mt-4">
                <button 
                    onClick={captureMap}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Capture Map
                </button>
                {capturedImage && (
                    <button 
                        onClick={downloadImage}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        Download Map
                    </button>
                )}
            </div>
        </section>
    );
} 