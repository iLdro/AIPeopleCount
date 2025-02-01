import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, Camera } from "lucide-react";

interface CameraCardProps {
    cameraId: string;
}

export const CameraCard: React.FC<CameraCardProps> = ({ cameraId }) => {
    const [cameraPeopleCount, setCameraPeopleCount] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    const fetchCameraPeopleCount = async (isFirstLoad = false) => {
        console.log("called");
        try {
            if (isFirstLoad) setLoading(true); // Only show loading on first fetch
            console.log("trying to fetch");
            const response = await axios.get(`http://localhost:3000/camera/${cameraId}`);
            console.log("Successful fetch:", response.data);
            setCameraPeopleCount(response.data.count);
            setError(false);
        } catch (err) {
            setError(true);
            console.error("Error fetching camera people count:", err);
        } finally {
            if (isFirstLoad) setLoading(false);
        }
    };

    useEffect(() => {
        fetchCameraPeopleCount(true); // First load
        const interval = setInterval(() => fetchCameraPeopleCount(false), 5000);
        console.log("fetched camera " + cameraPeopleCount);
        return () => clearInterval(interval); // Cleanup on unmount
    }, [cameraId]);

    return (
        <div className="bg-wgite rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-transform transform hover:scale-105 duration-300 max-w-md">
            <div className="space-y-4 text-back">
                <div className="border-b border-white/20 pb-4 flex items-center justify-between">
                    <h5 className="text-2xl font-bold flex items-center space-x-2">
                        <Camera className="w-6 h-6 opacity-80" />
                        <span>Camera {cameraId}</span>
                    </h5>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                ) : error ? (
                    <p className="text-red-200 text-center">⚠️ Error fetching data</p>
                ) : (
                    <p className="text-lg text-center">
                        <span className="text-4xl font-bold">{cameraPeopleCount}</span> people detected
                    </p>
                )}
            </div>
        </div>
    );
};
