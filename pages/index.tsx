import Head from 'next/head'
import Image from 'next/image'
import { Suspense } from 'react'
import useSWR from 'swr'
import BarChart from '../components/BarChart'
import { Loading } from '../components/Loading'
import StackedBarChart from '../components/StackedBarChart'
import { groupedChargesSchema } from '../models/schemas'
import styles from '../styles/Home.module.css'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function Home() {
    const { data, error } = useSWR('/api/data', fetcher)

    if (!data && !error) {
        return <Loading />
    }

    if (error) {
        return <div>Error fetching</div>
    }

    const parsed = groupedChargesSchema.safeParse(data)

    if (!parsed.success) {
        return (
            <div>
                <pre>{JSON.stringify(parsed.error.issues, null, 2)}</pre>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Open Austin | Indigent Defense Stats</title>
                <meta name="description" content="Indigent Defense Stats" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                {/* <Suspense fallback={<Loading />}> */}

                <div className={styles.charts}>
                    {/* <BarChart data={parsed.data} /> */}
                    <StackedBarChart data={parsed.data} />
                </div>
                {/* </Suspense> */}
            </main>

            <footer className={styles.footer}>Open Austin 2022</footer>
        </div>
    )
}
