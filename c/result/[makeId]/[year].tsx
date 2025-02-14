import { useRouter } from "next/router"


export const ResultPage = () => {
    const router = useRouter();
    const {makeId, year} = router.query;

    return(
        <section>
            <h1>{makeId}</h1>
            <h1>{year}</h1>
        </section>
    );
}