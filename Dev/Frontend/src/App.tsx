import axios from 'axios'
import { useEffect, useState } from 'react'
import { BuildingCard } from './Components/BuildingCard'
import { CameraCard } from './Components/CameraCard'
import { BuildingCard } from './Components/BuildingCard'
import { CameraCard } from './Components/CameraCard'

export default function App() {
  const [buildingsOptions, setBuildingsOptions] = useState<string[]>([])
  const [selectedBuilding, setSelectedBuilding] = useState<string>('')
  const [cameras, setCameras] = useState<any[]>([])
  const [buildingsOptions, setBuildingsOptions] = useState<string[]>([])
  const [selectedBuilding, setSelectedBuilding] = useState<string>('')
  const [cameras, setCameras] = useState<any[]>([])

  useEffect(() => {
    fetchBuildings()
  }, [])

  const fetchCameraFromBuilding = async (building: string) => {
    console.log("fetching camera from building " + building)
    try {
      const response = await axios.get(`http://localhost:3000/building/cameras/${building}`)
      console.log("fetched camera " + response.data)
      setCameras(response.data)
    } catch (error) {
      console.error("Error fetching camera from building:", error)
    }
  }

  useEffect(() => {
    if (selectedBuilding) {
      fetchCameraFromBuilding(selectedBuilding)
    }
  }, [selectedBuilding])


  const fetchCameraFromBuilding = async (building: string) => {
    console.log("fetching camera from building " + building)
    try {
      const response = await axios.get(`http://localhost:3000/building/cameras/${building}`)
      console.log("fetched camera " + response.data)
      setCameras(response.data)
    } catch (error) {
      console.error("Error fetching camera from building:", error)
    }
  }

  useEffect(() => {
    if (selectedBuilding) {
      fetchCameraFromBuilding(selectedBuilding)
    }
  }, [selectedBuilding])


  const fetchBuildings = async () => {
    const response = await axios.get('http://localhost:3000/building/list')
    console.log(response.data)
    const response = await axios.get('http://localhost:3000/building/list')
    console.log(response.data)
    setBuildingsOptions(response.data)
  }


  useEffect(() => {
    console.log("selected " + selectedBuilding)
  }, [selectedBuilding])

  const handleBuildingChange = (value: string) => {

  useEffect(() => {
    console.log("selected " + selectedBuilding)
  }, [selectedBuilding])

  const handleBuildingChange = (value: string) => {
    setSelectedBuilding(value)
  }

  return (
    <>
      <div>
        <select
          name="building"
          id="building"
          value={selectedBuilding}
          onChange={(e) => handleBuildingChange(e.target.value)}
        >
          <option value="">Select a building</option>
          {buildingsOptions.map((building) => {
            return <option key={building} value={building}>{building}</option>
          })}
        </select>

        {selectedBuilding && <BuildingCard buildingName={selectedBuilding} />}
        {selectedBuilding && (
          <div className="grid grid-cols-2 gap-4 mt-8">
            {cameras.map((camera) => (
              <CameraCard key={camera.id} cameraId={camera} />
            ))}
          </div>
        )}
      </div>

    </>
  )
}