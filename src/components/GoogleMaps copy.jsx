import React, { useRef, useState } from "react";

export default function GoogleMaps() {
    const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
    const mapRef = useRef(null);
    const [capturedImage, setCapturedImage] = useState(null);

    const captureMap = () => {
        const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=59.31416,18.06408&zoom=17&size=800x600&maptype=satellite&key=${GOOGLE_API_KEY}`;
        setCapturedImage(staticMapUrl);
        console.log('Map captured successfully!');
    };

    const downloadImage = async () => {
        if (capturedImage) {
            try {
                const response = await fetch(capturedImage);
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
                console.error('Error downloading map:', error);
            }
        }
    };

    return (
        <section className="flex flex-col h-[70vh] items-center justify-center w-full bg-gray-200">
            <div ref={mapRef} className="flex w-[50%] h-[80%] overflow-hidden">
                <iframe
                    className="w-full h-full"
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps/embed/v1/view?key=${GOOGLE_API_KEY}&center=59.31416,18.06408&zoom=17&maptype=satellite`}
                >
                </iframe>
            </div>
            <div className="flex gap-4">
                <button 
                    onClick={captureMap}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Capture Map
                </button>
                {capturedImage && (
                    <button 
                        onClick={downloadImage}
                        className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        Download Map
                    </button>
                )}
            </div>
        </section>
    );
}
