"use client"

import { Header } from "@/components/Header";
import Image from "next/image";
import { useEffect, useState } from "react";

import arrow_down from "@/assets/icons/arrow-down.svg";

interface Car {
  MakeId: number,
  MakeName: string,
  VehicleTypeId: number,
  VehicleTypeName: string
}

interface Make{
  Make_ID: number,
  Make_Name: string
}

export default function Home() {

  const [carList, setCarList] = useState<Car[]>([]);
  const [makeList, setMakeList] = useState<Make[]>([]);
  const [filteredMakeList, setFilteredMakeList] = useState<Make[]>([]);
  const [makeSelectInput, setMakeSelectInput] = useState<string>("");
  const [selectedMake, setSelectedMake] = useState<Make>();

  const [showCareMakeDropdown, setShowCarMakeDropdown] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        //const response = await fetch("https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json");
        const [carResponse, makeResponse] = await Promise.all([
          fetch("https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json"),
          fetch("https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=json")
        ])

        if (carResponse.ok && makeResponse.ok) {

          const [carResult, makeResult] = await Promise.all([
            carResponse.json(),
            makeResponse.json()
          ])

          console.log(makeResult.Results);
          setCarList(carResult.Results);
          setMakeList(makeResult.Results);

        } else {
          throw Error();
        }
      }
      catch (error) {
        console.error("Error while loading cars: " + error);
      }
    }

    fetchData();
  }, [])

  useEffect(() => {
    setFilteredMakeList(makeList);
  }, [makeList])

  const capitalizeFirstLetter = (word: string): string => {
    if(word && word.length > 0){
      const firstLetter = word[0].toUpperCase();
      const secondPart = word.slice(1, word.length).toLowerCase();

      return firstLetter + secondPart
    }else{
      return "";
    }
  }

  const switchDropDownDisplay = () => {
    setShowCarMakeDropdown(!showCareMakeDropdown);
  }

  const onDropDownInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setShowCarMakeDropdown(true);

    const userInput = e.target.value;
    setMakeSelectInput(userInput);

    let updatedFilteredList = makeList;

    if(userInput.trim() != ""){
      updatedFilteredList = makeList.filter(m => 
        m.Make_Name.toLowerCase().includes(userInput.toLowerCase().trim())
      )
    }

    setFilteredMakeList(updatedFilteredList);
  }

  useEffect(() => {
    console.log(filteredMakeList);
  }, [filteredMakeList])

  const onMakeDropdownOptionClick = (make: Make) => {
    setShowCarMakeDropdown(false);
    setSelectedMake(make);
    setMakeSelectInput(make.Make_Name);
    console.log(make);
  }

  return (
    <section className="mt-9 mb-9">
      <div className="flex">
        <div className="relative border-2 border-black border-solid rounded-md mb-2">
          <div className="flex items-center gap-1">
            <input
            className="drop-down-item border-0 cursor-text"
             placeholder="Search car make"
             onChange={onDropDownInputChange}
             value={makeSelectInput}
             type="text" 
             />
            <Image 
            onClick={switchDropDownDisplay}
            src={arrow_down}
            alt="Arrow down"
            width={30}
            height={30}
            className="curson-pointer"/>
          </div>
          <ul className={`${showCareMakeDropdown ? "block" : "hidden"} 
          absolute border-2 
          border-black border-solid rounded-md bg-white max-h-96 overflow-scroll`}>
            {
              filteredMakeList.length > 0 ? 
                filteredMakeList.map((make, index) => (
                  <li 
                  key={make.Make_ID} 
                  className="drop-down-item"
                  onClick={() => onMakeDropdownOptionClick(make)}
                  >{make.Make_Name}</li>
                ))
                :
                <h1 className="text-xl p-1">No result</h1>
            }
          </ul>
        </div>
        <select 
        name="year-select" 
        id="year-select"
        >
          <option value="2024">2024</option>
          <option value="2024">2024</option>
          <option value="2024">2024</option>
        </select>
      </div>
      <div className="flex justify-center flex-col gap-4">
        {
          carList.length > 0 ?
            carList.map((car, index) => (
              <div key={index} 
                  className="p-1 border-2 border-black border-solid rounded-md">
                <h1 className="text-2xl font-bold">{capitalizeFirstLetter(car.MakeName)}</h1>
                <h2>Type: {car.VehicleTypeName}</h2>
              </div>
            ))
            :
            <h1>Loading</h1>
        }
      </div>
    </section>
  );
}
