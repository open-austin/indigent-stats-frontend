import Head from 'next/head'
import useSWR from 'swr'
import { z } from 'zod'
import { Loading } from '../components/Loading'
import StackedBarChart from '../components/StackedBarChart'
import BarChartInteractive from '../components/BarChartInteractive'
import BarChartYears from '../components/BarChartYears'
import { caseSchema } from '../models/Case'
import styles from '../styles/Home.module.css'
import fetcher from '../lib/fetcher'
import { Hero } from '../components/Hero'
import styled from 'styled-components'

const SECRET = process.env.NEXT_PUBLIC_COSMOSDB_SECRET
// TODO: Update cosmos query later
// currently getting data with 'null'
const COSMOS_QUERY = `
SELECT * FROM c
  WHERE NOT ARRAY_CONTAINS(c['charge_category'], null)
  ORDER BY c['earliest_charge_date'] DESC
  OFFSET 0 LIMIT 8000
`

const Visualizations = styled.section`
    position: relative;
    min-height: 50vh;
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

    if (cosmosError) {
        console.error('Error loading cosmos data: ', cosmosError)
    }

    const d = cosmosData?.data
    const parsed = z.array(caseSchema).safeParse(d)
    const isLoading = !cosmosData && !cosmosError && !parsed.success

    if (!parsed.success && !!cosmosData?.data) {
        console.error(
            'Error parsing data: ',
            JSON.stringify(parsed.error.issues, null, 2)
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
                <Hero />
                <Visualizations>
                    {isLoading || !parsed.success ? (
                        <Loading />
                    ) : (
                        <div className={styles.charts}>
                            <BarChartInteractive data={parsed.data} />
                            <BarChartYears data={parsed?.data} />
                            <StackedBarChart cases={parsed?.data} />
                        </div>
                    )}
                </Visualizations>
            </main>

            <footer className={styles.footer}>Open Austin 2022</footer>
        </div>
    )
}
