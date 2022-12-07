import Head from 'next/head'
import Image from 'next/image'
import useSWR from 'swr'
import BarChart from '../components/BarChart'
import StackedBarChart from '../components/StackedBarChart'
import styles from '../styles/Home.module.css'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function Home() {
  const { data, error } = useSWR('/api/data', fetcher)

  if (error) {
    return <div>{error}</div>
  }

    return (
        <div className={styles.container}>
            <Head>
                <title>Open Austin | Indigent Defense Stats</title>
                <meta
                    name="description"
                    content="Indigent Defense Stats"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
              <div className={styles.charts}>
                <BarChart data={data} />
                <StackedBarChart data={data} />
              </div>
            </main>

            <footer className={styles.footer}>
                Open Austin 2022
            </footer>
        </div>
    )
}
