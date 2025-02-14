"use client"

import { Header } from "@/components/Header";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";

import arrow_down from "@/assets/icons/arrow-down.svg";

interface Car {
  MakeId: number,
  MakeName: string,
  VehicleTypeId: number,
  VehicleTypeName: string
}

interface Make {
  Make_ID: number,
  Make_Name: string
}

export default function Home() {

  const [carList, setCarList] = useState<Car[]>([]);
  const [makeList, setMakeList] = useState<Make[]>([]);

  const [filteredMakeList, setFilteredMakeList] = useState<Make[]>([]);
  const [makeSelectInput, setMakeSelectInput] = useState<string>("");
  const [selectedMake, setSelectedMake] = useState<Make>();
  const [selectYear, setSelectYear] = useState<string>("2015");
  const [isCarDataOk, setIsCarDataOk] = useState<boolean>(false);

  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const [showCareMakeDropdown, setShowCarMakeDropdown] = useState<boolean>(false);

  const startYear = 2015;
  const endYear = new Date().getFullYear();

  const yearsArray = Array.from({ length: endYear - startYear + 1 }, (_, index) => startYear + index);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [carResponse, makeResponse] = await Promise.all([
          fetch("https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json"),
          fetch("https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=json")
        ])

        if (carResponse.ok && makeResponse.ok) {

          const [carResult, makeResult] = await Promise.all([
            carResponse.json(),
            makeResponse.json()
          ])

          setCarList(carResult.Results);
          setMakeList(makeResult.Results);
          setFilteredMakeList(makeResult.Results);

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
    if (selectedMake && selectYear) {
      setIsCarDataOk(true);
    }
  }, [selectedMake, selectYear])

  useEffect(() => {
    if (carList.length === 0 && makeList.length === 0) {
      setIsLoaded(false);
    } else {
      setIsLoaded(true);
    }
  }, [carList, makeList])



  const switchDropDownDisplay = () => {
    setShowCarMakeDropdown(!showCareMakeDropdown);
  }

  const onDropDownInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setShowCarMakeDropdown(true);

    const userInput = e.target.value;
    setMakeSelectInput(userInput);

    let updatedFilteredList = makeList;

    if (userInput.trim() != "") {
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

  const onSelectYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();

    setSelectYear(e.target.value);
  }

  return (
    <section className="mt-9 mb-9 flex justify-center">
      {isLoaded ?
        <div className="flex w-96 gap-2 flex-col">
          <h1 className="text-xl font-bold">Select car make or type it below</h1>
          <div className="z-10 relative border-2 border-black border-solid rounded-md mb-2">
            <div className="flex items-center justify-between">
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
                className="curson-pointer" />
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
          <h1 className="text-xl font-bold">Select car year</h1>
          <select
            onChange={onSelectYearChange}
            name="year-select"
            id="year-select"
            className="border-2 border-solid border-black rounded-md h-9"
          >
            {yearsArray ?
              yearsArray.map((year, index) => (
                <option value={year} key={index}>{year}</option>
              ))
              :
              <h1>Loading</h1>
            }

          </select>


          <Link href={`/result/${selectedMake?.Make_ID}/${selectYear}`}>
            <button className={`
          ${isCarDataOk ? "cursor-pointer hover:bg-gray-200" : "cursor-not-allowed opacity-50"} min-w-20 p-1 
          border-2 
          border-solid border-black
          rounded-md
          `}
              disabled={!isCarDataOk}
            >
              Next
            </button>
          </Link>
        </div>
        :
        <h1 className="font-bold text-4xl">Loading...</h1>
      }
    </section>
  );
}
