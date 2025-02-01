import axios from 'axios'
import { useEffect, useState } from 'react'
import { BuildingCard } from './Components/BuildingCard'

export default function App() {
  const [buildingsOptions, setBuildingsOptions] = useState<string[]>([])
  const [selectedBuilding, setSelectedBuilding] = useState<string>()

  useEffect(() => {
    fetchBuildings()
  }, [])

  const fetchBuildings = async () => {
    const response = await axios.get('http://localhost:3000/building/list')
    console.log(response.data)
    setBuildingsOptions(response.data)
  }

  const handleBuildingChange = (value: string) => {
    setSelectedBuilding(value)
  }

  return (
    <>
      <select 
        value={selectedBuilding} 
        onChange={(e) => handleBuildingChange(e.target.value)}
      >
        <option value="">Select a building</option>
        {buildingsOptions.map((building) => (
          <option key={building} value={building}>
            {building}
          </option>
        ))}
      </select>

      {selectedBuilding && <BuildingCard buildingName={selectedBuilding} />}
    </>
  )
}