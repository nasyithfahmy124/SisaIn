import React from 'react';
import Map, { NavigationControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function SisainMap({ 
    children, 
    initialViewState, 
    interactive = true,
    mapStyle = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
    ...props 
}) {
    // Pengaturan default berpusat di Candisari, Semarang
    const defaultViewState = {
        longitude: 110.422,
        latitude: -7.025,
        zoom: 13.5
    };

    return (
        <Map
            initialViewState={initialViewState || defaultViewState}
            mapStyle={mapStyle}
            style={{ width: '100%', height: '100%', borderRadius: 'inherit' }}
            interactive={interactive}
            {...props}
        >
            {/* Menambahkan kontrol navigasi (zoom in/out) hanya jika peta interaktif */}
            {interactive && <NavigationControl position="bottom-right" />}
            
            {/* Children digunakan untuk melempar Marker, Source, atau Layer dari komponen induk */}
            {children}
        </Map>
    );
}