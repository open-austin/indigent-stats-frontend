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
import { Hero } from '../components/HeroAlt'
import styled from 'styled-components'
import { Section } from '../components/Section'
import { H3 } from '../components/Typography/Headings'
import { Container, TextContainer } from '../components/Container'
import { Highlight } from '../components/Typography/Highlight'
import { countPerYearSchema } from '../models/schemas'
import { Paragraph, Small } from '../components/Typography/Body'
import { bp } from '../lib/breakpoints'
import { InlineLink } from '../components/Link'
import FadeInSection from '../components/FadeInSection'
import Spacer from '../components/Spacer'

const SECRET = process.env.NEXT_PUBLIC_COSMOSDB_SECRET
// TODO: Update cosmos query later
// currently getting data with 'null'
const COSMOS_QUERY = `
SELECT * FROM c
  WHERE NOT ARRAY_CONTAINS(c['charge_category'], null)
  ORDER BY c['earliest_charge_date'] DESC
  OFFSET 0 LIMIT 6000
`

const REPRESENTATION_BY_YEAR_QUERY = `
SELECT
  c.attorney_type,
  c.has_evidence_of_representation,
  DateTimePart("year", c.earliest_charge_date) AS year,
  COUNT(1) AS case_count
 FROM c
 WHERE
  IS_DEFINED(c.has_evidence_of_representation)
  AND DateTimePart("year", c.earliest_charge_date) > 2007
  AND (
       c.attorney_type = "Court Appointed"
    OR c.attorney_type = "Retained"
  )
 GROUP BY
  DateTimePart("year", c.earliest_charge_date),
  c.has_evidence_of_representation,
  c.attorney_type
`

const Visualizations = styled.section`
    position: relative;
    min-height: 50vh;
    margin: 2rem 0 6rem;

    @media ${bp.lg} {
        margin: 6rem 0;
    }
`

export default function Home() {
    const { data: cosmosData, error: cosmosError } = useSWR(
        `/api/cosmos?secret=${SECRET}&sql=${COSMOS_QUERY}`,
        fetcher
    )

    const { data: repByYearsRaw, error: repByYearsErr } = useSWR(
        `/api/cosmos?secret=${SECRET}&sql=${REPRESENTATION_BY_YEAR_QUERY}`,
        fetcher
    )

    if (cosmosError || repByYearsErr) {
        console.error('Error loading cosmos data: ', cosmosError)
        return <div>Error fetching</div>
    }

    const parsed = z.array(caseSchema).safeParse(cosmosData?.data)
    const repByYears = countPerYearSchema.safeParse(repByYearsRaw?.data)

    if (!parsed.success && !!cosmosData) {
        console.error(
            'Error parsing data: ',
            JSON.stringify(parsed.error.issues, null, 2)
        )
    }

    const isLoading =
        !cosmosData && !cosmosError && !repByYearsRaw && !repByYearsErr

    return (
        <div className={styles.container}>
            <Head>
                <title>Open Austin | Indigent Defense Data Visualization</title>
                <meta name="description" content="Indigent Defense Stats" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <Hero />
                <Spacer lgHeight='8rem' />
                <FadeInSection>
                    <Container>
                        <Section>
                            <H3>
                                How are we determining{' '}
                                <em>evidence of representation</em>?
                            </H3>
                            <TextContainer align="left">
                                <Paragraph>
                                    As determined by our legal experts, filing
                                    significant motions, such as{' '}
                                    <Highlight>motion in limine</Highlight>,
                                    &nbsp;
                                    <Highlight>
                                        motion for speedy trial
                                    </Highlight>
                                    , &nbsp;
                                    <Highlight>motion to suppress</Highlight>,
                                    &nbsp;&nbsp;
                                    <Highlight>motion for production</Highlight>
                                    ,&nbsp; and{' '}
                                    <Highlight>
                                        motion to reduce bond
                                    </Highlight>{' '}
                                    is evidence of adequate legal
                                    representation.
                                </Paragraph>
                            </TextContainer>
                            <br></br>
                            <br></br>
                            <TextContainer align="left">
                                <Small>
                                    <b>Note:</b> We are in the process of
                                    scraping case outcomes, but we do not have
                                    this data available yet.
                                    <br></br>
                                    In the future, we intend to compare outcomes
                                    with attorney type.
                                </Small>
                            </TextContainer>
                        </Section>
                        <Visualizations>
                            {isLoading || !parsed.success ? (
                                <Loading />
                            ) : (
                                <div className={styles.charts}>
                                    <BarChartInteractive data={parsed.data} />
                                </div>
                            )}
                        </Visualizations>
                    </Container>
                </FadeInSection>
                <Spacer />
                <FadeInSection>
                    <Container>
                        <Section>
                            <H3>
                                How does this disparity look like over time?
                            </H3>
                            <TextContainer align="left">
                                <Paragraph>
                                    This description will change once we have
                                    more recent data.
                                </Paragraph>
                                <Paragraph>
                                    Lorem ipsum dolor sit amet, consectetur
                                    adipiscing elit. Nullam vel mi arcu. In
                                    molestie, ex quis venenatis viverra, nulla
                                    justo consectetur metus, sit amet iaculis
                                    sem arcu vitae erat. Quisque viverra neque
                                    at leo posuere posuere. In ut efficitur
                                    nulla. Nullam et massa malesuada, mollis
                                    massa et, fringilla magna. Integer tellus
                                    nibh, mattis in elit eget, aliquet pulvinar
                                    quam.
                                </Paragraph>
                            </TextContainer>
                        </Section>
                        <Visualizations>
                            {isLoading || !repByYears.success ? (
                                <Loading />
                            ) : (
                                <div className={styles.charts}>
                                    <BarChartYears data={repByYears.data} />
                                </div>
                            )}
                        </Visualizations>
                    </Container>
                </FadeInSection>
                <Spacer lgHeight='4rem' />
                <FadeInSection>
                    <Container>
                        <Section>
                            <H3>
                                Differences in charge category based on attorney
                                type
                            </H3>
                            <TextContainer align="left">
                                <Paragraph>
                                    We noticed that with all the cases grouped
                                    by their charge category, there is a higher
                                    representation of DUI offenses in cases with
                                    retained attorneys compared to those with
                                    court-appointed attorneys. Similarly, there
                                    is a higher representation of property
                                    charges within cases with court-appointed
                                    attorneys.
                                </Paragraph>
                            </TextContainer>
                        </Section>
                        <Visualizations>
                            {isLoading || !parsed.success ? (
                                <Loading />
                            ) : (
                                <div className={styles.charts}>
                                    <StackedBarChart cases={parsed?.data} />
                                </div>
                            )}
                        </Visualizations>
                    </Container>
                </FadeInSection>
                <Spacer />
                <FadeInSection>
                    <Container>
                        <Section>
                            <H3>What&apos;s next for this project?</H3>
                            <TextContainer align="left">
                                <ul>
                                    <li>
                                        <Paragraph>
                                            We currently only have data from
                                            Hayes County, but intend to expand
                                            that to all Texas counties.
                                        </Paragraph>
                                    </li>
                                    <li>
                                        <Paragraph>
                                            Because of the difficulty in
                                            formatting for outcomes among all
                                            case records, we are still working
                                            on scraping final verdicts.
                                        </Paragraph>
                                    </li>
                                    <li>
                                        <Paragraph>
                                            Race and gender data is limited in
                                            our current dataset. In the future,
                                            we plan to publish this aggregate
                                            demographic information.
                                        </Paragraph>
                                    </li>
                                </ul>
                            </TextContainer>
                        </Section>
                    </Container>
                </FadeInSection>
            </main>
            <Spacer />

            <footer className={styles.footer}>
                    <span>
                        <InlineLink
                            href="https://www.open-austin.org"
                            isExternal={true}
                        >
                            Open Austin
                        </InlineLink>
                        &nbsp;+&nbsp;
                        <InlineLink
                            href="https://www.fairdefense.org/"
                            isExternal={true}
                        >
                            Texas Fair Defense Project
                        </InlineLink>
                        &nbsp;&nbsp; 2023
                    </span>
            </footer>
        </div>
    )
}
