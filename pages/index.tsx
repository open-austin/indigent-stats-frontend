import Head from 'next/head'
import useSWR from 'swr'
import { z } from 'zod'
import BarChart from '../components/BarChart'
import { Loading } from '../components/Loading'
import StackedBarChart from '../components/StackedBarChart'
import BarChartInteractive from '../components/BarChartInteractive'
import BarChartYears from '../components/BarChartYears'
import { caseSchema } from '../models/Case'
import styles from '../styles/Home.module.css'
import fetcher from '../lib/fetcher'
import { Props } from 'recharts/types/component/Legend'

const SECRET = process.env.NEXT_PUBLIC_COSMOSDB_SECRET
// TODO: Update cosmos query later
// currently getting data with 'null'
const COSMOS_QUERY = `
SELECT * FROM c
  WHERE NOT ARRAY_CONTAINS(c['charge_category'], null)
  ORDER BY c['earliest_charge_date'] DESC
  OFFSET 0 LIMIT 8000
`

export default function Home() {
    // TODO: Remove after switching to CosmosDB
    // const { data, error } = useSWR('/api/cases-subset-v2', fetcher)

    // if (!data && !error) {
    //     return <Loading />
    // }

    // if (error) {
    //     return <div>Error fetching</div>
    // }

    // const d = JSON.parse(data)
    // const parsed = z.array(caseSchema).safeParse(d)

    // TODO: Figure out why cosmos isn't working when hosted on Vercel
    const { data: cosmosData, error: cosmosError } = useSWR(
        `/api/cosmos?secret=${SECRET}&sql=${COSMOS_QUERY}`,
        fetcher
    )

    if (!cosmosData && !cosmosError) {
        return <Loading />
    }

    if (cosmosError) {
        return <div>Error fetching</div>
    }

    const d = cosmosData?.data
    const parsed = z.array(caseSchema).safeParse(d)

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
                    <BarChartInteractive data={parsed.data} />
                    <StackedBarChart cases={parsed.data} />
                    <BarChartYears data={parsed.data} />
                </div>
            </main>

            <footer className={styles.footer}>Open Austin 2022</footer>
        </div>
    )
}
