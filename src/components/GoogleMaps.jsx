import React from "react";

export default function GoogleMaps() {
    const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
    return (
        <section className="flex h-[70vh] items-center justify-center w-full bg-gray-200">
            <div className="flex w-[80%] h-[80%] overflow-hidden">
                <iframe
                    className="w-full h-full"
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps/embed/v1/view?key=${GOOGLE_API_KEY}&center=59.31416,18.06408&zoom=17&maptype=satellite`}
                >
                </iframe>
            </div>
        </section>
    );
}
