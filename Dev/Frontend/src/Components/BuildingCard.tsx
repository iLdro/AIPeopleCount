import axios from "axios";
import { useEffect, useState } from "react";
import { building } from "../type/types";
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface BuildingCardProps {
    buildingName: string;
}

export const BuildingCard: React.FC<BuildingCardProps> = ({ buildingName }) => {
    const [buildngPeopleCount, setBuildingPeopleCount] = useState<number>(0)
    const [buildingData, setBuildingData] = useState<building[]>([])

    const fetchBuildingPeopleCount = async () => {
        const response = await axios.get(`http://localhost:3000/building/${buildingName}/people`)
        console.log(response.data.count)
        setBuildingPeopleCount(response.data.count)
    }

    const fetchhBuildingData = async () => {
        const response = await axios.get(`http://localhost:3000/building/allLogs/${buildingName}`)
        setBuildingData(response.data)
    }

    useEffect(() => {
        fetchBuildingPeopleCount();
        fetchhBuildingData();
    }, [buildingName])

    useEffect(() => {
        console.log(buildingData)
    }, [buildingData])

    const chartData = {
        labels: buildingData.map(data => new Date(data.lastUpdated).toLocaleTimeString()),
        datasets: [
            {
                label: 'People Count',
                data: buildingData.map(data => data.counter),
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.2,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: `People Count Evolution - ${buildingName}`,
            },
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="space-y-6">
                <div className="border-b pb-4">
                    <div className="flex justify-between items-center">
                        <h5 className="text-2xl font-semibold text-gray-800 capitalize">
                            Building: {buildingName}
                        </h5>
                        <div className="text-lg text-gray-600">
                            Current occupancy: <span className="font-medium">{buildngPeopleCount}</span> people
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                    <Line options={options} data={chartData} />
                </div>
            </div>
        </div>
    )
}