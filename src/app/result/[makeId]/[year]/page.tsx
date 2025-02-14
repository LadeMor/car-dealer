import CarList from "@/components/CarList";
import Link from "next/link";
import { Suspense } from "react";

export async function genereateStaticParams() {
    return [
        { makeId: 13053, year: "2018" },
        { makeId: 12989, year: "2021" },
        { makeId: 454, year: "2022" },
    ];
}

const ResultPage = async ({ params }: { params: Promise<{ makeId: string; year: string }> }) => {
    const { makeId, year } = await params;

    return (
        <section>
            <Link href="/">
                <button
                    className="mt-6 mb-3 
                    border-solid 
                    border-2 
                    border-black 
                    rounded-md
                    p-2
                    hover:bg-gray-400"
                >
                    Back
                </button>
            </Link>
            <Suspense fallback={<p>Loading data</p>}>
                <CarList makeId={makeId} year={year} />
            </Suspense>
        </section>
    );
}

export default ResultPage;