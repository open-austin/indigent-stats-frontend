import Head from 'next/head'
import Image from 'next/image'
import BarChart from '../components/BarChart'
import styles from '../styles/Home.module.css'

export default function Home() {
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
                <BarChart />
            </main>

            <footer className={styles.footer}>
                Open Austin 2022
            </footer>
        </div>
    )
}
