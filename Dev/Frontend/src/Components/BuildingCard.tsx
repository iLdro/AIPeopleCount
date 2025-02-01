import axios from "axios";
import { useEffect } from "react";

interface BuildingCardProps {
    buildingName: string;
}

export const BuildingCard: React.FC<BuildingCardProps> = ({ buildingName }) => {

    const fetchBuildingData = async () => {
        console.log(`http://localhost:3000/building/${buildingName}/people`)
        const response = await axios.get(`http://localhost:3000/building/${buildingName}/people`)
        console.log(response.data.count)
    }

    useEffect(() => {
        fetchBuildingData()
    }, [buildingName])

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">{buildingName}</h5>
                <p className="card-text">number in building : </p>
                <p className="card-text">Building Description</p>
            </div>
        </div>
    )
}