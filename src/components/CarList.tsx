"use client";

import { useEffect, useState } from "react";

interface Car {
    Make_Id: number;
    Make_Name: string;
    Model_Id: number;
    Model_Name: string;
}

export default function CarList({ makeId, year }: { makeId: string; year: string }) {
    const [carList, setCarList] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCars() {
            try {
                const response = await fetch(
                    `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeIdYear/makeId/${makeId}/modelyear/${year}?format=json`
                );

                if (response.ok) {
                    const data = await response.json();
                    setCarList(data.Results);
                }
            } catch (error) {
                console.error("Error while loading cars: ", error);
            } finally {
                setLoading(false);
            }
        }

        fetchCars();
    }, [makeId, year]);

    const capitalizeFirstLetter = (word: string): string => {
        if (word && word.length > 0) {
            const firstLetter = word[0].toUpperCase();
            const secondPart = word.slice(1, word.length).toLowerCase();

            return firstLetter + secondPart
        } else {
            return "";
        }
    }

    if (loading) {
        return <h1>Loading...</h1>;
    }

    if (carList.length === 0) {
        return <h1>No Results</h1>;
    }

    return (
        <div className="flex justify-center flex-col gap-4">
            {carList.map((car, index) => (
                <div key={index} className="p-1 border-2 border-black border-solid rounded-md">
                    <h1 className="text-2xl font-bold">{capitalizeFirstLetter(car.Make_Name)}</h1>
                    <h2 className="text-xl">Model: {car.Model_Name}</h2>
                </div>
            ))}
        </div>
    );
}
