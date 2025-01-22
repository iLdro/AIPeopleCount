import axios from 'axios'
import { building } from './type/types'
import { useEffect, useState } from 'react'

export default function App() {
  const [buildingsOptions, setBuildingsOptions] = useState<building[]>([])
  const [selectedBuilding, setSelectedBuilding] = useState<building>()

  useEffect(() => {
    fetchBuildings()
  }, [])

  const fetchBuildings = async () => {
    const response = await axios.get('http://localhost:3000/building/building')
    console.log(response)
    setBuildingsOptions(response.data)
  }

  const handleBuildingChange = (value: building) => {
    setSelectedBuilding(value)
  }

  return (
    <>
      <select name="" id="">
        {buildingsOptions.map((building) => {
          return <option key={building.id} value={building.id} onClick={() => handleBuildingChange(building)}>{building.name}</option>
        })}
      </select>

    </>
  )
}