import Head from 'next/head'
import useSWR from 'swr'
import { z } from 'zod'
import BarChart from '../components/BarChart'
import { Loading } from '../components/Loading'
import StackedBarChart from '../components/StackedBarChart'
import BarChartEventsInteractive from '../components/BarChartEventsInteractive'
import { caseSchema } from '../models/Case'
import styles from '../styles/Home.module.css'
import fetcher from '../lib/fetcher'

export default function Home() {
    const { data, error } = useSWR('/api/cases-subset', fetcher)

    if (!data && !error) {
        return <Loading />
    }

    if (error) {
        return <div>Error fetching</div>
    }

    const parsed = z.array(caseSchema).safeParse(data)

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
                <div className={styles.charts}>
                    <BarChartEventsInteractive data={parsed.data} />
                    {/* <BarChart data={parsed.data} /> */}
                    <StackedBarChart cases={parsed.data} />
                </div>
            </main>

            <footer className={styles.footer}>Open Austin 2022</footer>
        </div>
    )
}
