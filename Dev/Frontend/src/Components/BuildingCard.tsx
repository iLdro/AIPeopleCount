import { useEffect } from "react"

export interface BuildingCardProps {
    selectedBuilding: string
}

export const BuildingCard = ({ selectedBuilding }: BuildingCardProps) => {
    const fetchBuildingInfo = async () => {
        console.log(selectedBuilding)
        // const response = await axios.get(`http://localhost:3000/building/${selectedBuilding}`)
        // console.log(response)
    }

    useEffect(() => {
        fetchBuildingInfo()
    }, [selectedBuilding])

    return (
        <div className="card">
            <img src="https://via.placeholder.com/150" alt="Building" />
            <div className="card-body">
                <h5 className="card-title">Name : {selectedBuilding}</h5>
                <p className="card-text">Building Description</p>
                <a href="#" className="btn btn-primary">Select</a>
            </div>
        </div>
    )
}