import Link from "next/link";

interface Car {
    Make_Id: number,
    Make_Name: string,
    Model_Id: number,
    Model_Name: string
}


export async function genereateStaticParams() {
    return [
        { makeId: 13053, year: "2018" },
        { makeId: 12989, year: "2021" },
        { makeId: 454, year: "2022" },
    ];
}

const ResultPage = async ({ params }: { params: Promise<{ makeId: string; year: string }> }) => {
    const { makeId, year } = await params;
    let carList: Car[] = [];

    try{
        const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeIdYear/makeId/${makeId}/modelyear/${year}?format=json`);

        if (response.ok) {
            const data = await response.json();
            console.log(data.Results);
            carList = data.Results;
        }else{
            throw Error();
        }

    }catch(error){
        console.error("Error while loading cars: " + error);
    }

    const capitalizeFirstLetter = (word: string): string => {
        if (word && word.length > 0) {
            const firstLetter = word[0].toUpperCase();
            const secondPart = word.slice(1, word.length).toLowerCase();

            return firstLetter + secondPart
        } else {
            return "";
        }
    }

    return (
        <section>
            <button
                className="mt-6 mb-3 
                    border-solid 
                    border-2 
                    border-black 
                    rounded-md
                    p-2
                    hover:bg-gray-400
            "
            >
                <Link href="/">
                    Back
                </Link>
            </button>
            <div className="flex justify-center flex-col gap-4 ">
                {
                    carList.length > 0 ?
                        carList.map((car, index) => (
                            <div key={index}
                                className="p-1 border-2 border-black border-solid rounded-md">
                                <h1 className="text-2xl font-bold">{capitalizeFirstLetter(car.Make_Name)}</h1>
                                <h2 className="text-xl">Model: {car.Model_Name}</h2>
                            </div>
                        ))
                        :
                        <h1>No Results</h1>
                }
            </div>
        </section>
    );
}

export default ResultPage;