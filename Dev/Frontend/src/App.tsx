import axios from 'axios'
import { useEffect, useState } from 'react'
import { BuildingCard } from './Components/BuildingCard'

export default function App() {
  const [buildingsOptions, setBuildingsOptions] = useState<string[]>([])
  const [selectedBuilding, setSelectedBuilding] = useState<string>('')

  useEffect(() => {
    fetchBuildings()
  }, [])

  const fetchBuildings = async () => {
    const response = await axios.get('http://localhost:3000/building/list')
    console.log(response.data)
    setBuildingsOptions(response.data)
  }

  useEffect(() => {
    console.log("selected " + selectedBuilding)
  }, [selectedBuilding])

  const handleBuildingChange = (value: string) => {
    setSelectedBuilding(value)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <select
            value={selectedBuilding}
            onChange={(e) => handleBuildingChange(e.target.value)}
            className="w-64 p-3 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="" className="text-gray-500">Select a building</option>
            {buildingsOptions.map((building) => (
              <option key={building} value={building} className="text-gray-700">
                {building}
              </option>
            ))}
          </select>
        </div>

        {selectedBuilding && <BuildingCard buildingName={selectedBuilding} />}
      </div>
    </div>
  )
}