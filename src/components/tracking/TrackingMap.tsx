
import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Ambulance, Building, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";

interface LocationPoint {
  latitude: number;
  longitude: number;
  address?: string;
}

interface TrackingMapProps {
  patientLocation: LocationPoint;
  ambulanceLocation?: LocationPoint;
  hospitalLocation?: LocationPoint;
  eta?: number | null;
  className?: string;
}

const TrackingMap: React.FC<TrackingMapProps> = ({
  patientLocation,
  ambulanceLocation,
  hospitalLocation,
  eta,
  className
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  // In a real app, we would use a proper map library like Google Maps, Mapbox, or Leaflet
  // For this demo, we'll create a simple visualization
  
  useEffect(() => {
    if (mapRef.current) {
      setMapLoaded(true);
    }
  }, []);
  
  const formatETA = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h ${mins}min`;
    }
  };
  
  return (
    <div className={`flex flex-col ${className}`}>
      {/* ETA display */}
      {eta !== undefined && eta !== null && (
        <Card className="p-3 mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <Clock className="mr-2 text-supportlife-blue" size={18} />
            <span className="font-medium">Tempo estimado:</span>
          </div>
          <span className="font-bold text-supportlife-blue">{formatETA(eta)}</span>
        </Card>
      )}
      
      {/* Map container */}
      <div 
        ref={mapRef}
        className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden border border-gray-200"
      >
        {/* Simple map visualization */}
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-400">Visualização do mapa</p>
        </div>
        
        {/* Patient marker */}
        <div className="absolute left-1/4 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="bg-supportlife-red p-2 rounded-full mb-1">
            <MapPin className="text-white" size={20} />
          </div>
          <div className="bg-white text-xs p-1 rounded shadow-sm">
            Paciente
          </div>
        </div>
        
        {/* Ambulance marker (if available) */}
        {ambulanceLocation && (
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="bg-amber-500 p-2 rounded-full mb-1">
              <Ambulance className="text-white" size={20} />
            </div>
            <div className="bg-white text-xs p-1 rounded shadow-sm">
              Ambulância
            </div>
          </div>
        )}
        
        {/* Hospital marker (if available) */}
        {hospitalLocation && (
          <div className="absolute right-1/4 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="bg-green-600 p-2 rounded-full mb-1">
              <Building className="text-white" size={20} />
            </div>
            <div className="bg-white text-xs p-1 rounded shadow-sm">
              Hospital
            </div>
          </div>
        )}
        
        {/* Path visualization */}
        {ambulanceLocation && (
          <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-blue-300 z-0" />
        )}
      </div>
      
      {/* Location details */}
      <div className="mt-4 space-y-3">
        <div className="flex items-start">
          <MapPin size={18} className="mr-2 mt-1 text-supportlife-red" /> 
          <div>
            <p className="text-sm font-medium">Localização do Paciente</p>
            <p className="text-xs text-gray-500">{patientLocation.address}</p>
          </div>
        </div>
        
        {ambulanceLocation && (
          <div className="flex items-start">
            <Ambulance size={18} className="mr-2 mt-1 text-amber-500" /> 
            <div>
              <p className="text-sm font-medium">Ambulância</p>
              <p className="text-xs text-gray-500">A caminho</p>
            </div>
          </div>
        )}
        
        {hospitalLocation && (
          <div className="flex items-start">
            <Building size={18} className="mr-2 mt-1 text-green-600" /> 
            <div>
              <p className="text-sm font-medium">Hospital de Destino</p>
              <p className="text-xs text-gray-500">{hospitalLocation.address}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackingMap;
