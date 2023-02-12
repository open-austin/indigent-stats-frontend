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
import Hero from '../components/Hero'
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
import { ErrorComponent } from '../components/ErrorComponent'
import CounselPerChargeCategoryBarChart from '../components/CounselPerChargeCategoryBarChart'

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
    const {
        data: cosmosData,
        error: cosmosError,
        isLoading: isLoadingCosmos,
    } = useSWR(`/api/cosmos?secret=${SECRET}&sql=${COSMOS_QUERY}`, fetcher)

    const {
        data: repByYearsRaw,
        error: repByYearsErr,
        isLoading: isLoadingRepsByYear,
    } = useSWR(
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

    return (
        <div className={styles.container}>
            <Head>
                <title>Open Austin | Indigent Defense Data Visualization</title>
                <meta name="description" content="Indigent Defense Stats" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <Hero />
                <Spacer lgHeight="8rem" />
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
                                    motions, such as{' '}
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
                                    are forms of legal representation.
                                </Paragraph>
                                <br></br>
                                <Paragraph>
                                    Keep in mind that we are only looking at
                                    records from a court file, which will never
                                    be able to tell the whole story about the
                                    attorney-client relationship. It is possible
                                    for a person to get great representation
                                    without their lawyer filing any of these
                                    motions, or for a lawyer to neglect their
                                    client’s case even if one of these motions
                                    is filed. We are using motions as a proxy
                                    because most of the time, filing at least
                                    one of these motions is a good indicator
                                    that a lawyer is putting effort into their
                                    client’s case.
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
                    </Container>
                </FadeInSection>
                <Spacer />
                <FadeInSection>
                    <Container>
                        <Section>
                            <H3>Why does evidence of representation matter?</H3>
                            <TextContainer align="left">
                                <Paragraph>
                                    Typically, poorer people with
                                    appointed counsel go through the legal
                                    system without the zealous advocacy that a
                                    retained attorney or well-funded
                                    institutional public defender might provide
                                    because their appointed attorneys do not
                                    have the time to investigate a variety of
                                    legal strategies in each case.
                                </Paragraph>
                            </TextContainer>
                        </Section>
                    </Container>
                </FadeInSection>
                <Spacer />
                <FadeInSection>
                    <Container>
                        <Section>
                            <H3>Try it out yourself</H3>
                            <TextContainer align="left">
                                <Paragraph>
                                    Try out the dashboard and see for yourself
                                    what the differences are between the
                                    representation people get from
                                    court-appointed lawyers and
                                    privately-retained lawyers. You can compare
                                    different kinds of cases and different
                                    specific kinds of motions.
                                </Paragraph>
                            </TextContainer>
                        </Section>
                        <Visualizations>
                            {isLoadingCosmos ? (
                                <Loading />
                            ) : !parsed.success ? (
                                <ErrorComponent />
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
                            <H3>How does this disparity look over time?</H3>
                            <TextContainer align="left">
                                <Paragraph>
                                    <Highlight>
                                        This description will change once we
                                        have more recent data.
                                    </Highlight>
                                </Paragraph>
                                <Paragraph>
                                    A lot has changed over the past ## years. We
                                    wanted to know whether attorney
                                    representation has changed over time and, if
                                    so, what might have caused those changes -
                                    so we mapped out the data over time. Here we
                                    see ...
                                </Paragraph>
                            </TextContainer>
                        </Section>
                        <Visualizations>
                            {isLoadingRepsByYear ? (
                                <Loading />
                            ) : !repByYears.success ? (
                                <ErrorComponent />
                            ) : (
                                <div className={styles.charts}>
                                    <BarChartYears data={repByYears.data} />
                                </div>
                            )}
                        </Visualizations>
                    </Container>
                </FadeInSection>
                <Spacer lgHeight="4rem" />
                <FadeInSection>
                    <Container>
                        <Section>
                            <H3>
                                Differences in charge category based on attorney
                                type
                            </H3>
                            <TextContainer align="left">
                                <Paragraph>
                                    We wanted to know whether certain kinds of
                                    cases are more likely to have retained
                                    lawyers than court-appointed lawyers. There
                                    are a lot of similarities between the kinds
                                    of cases represented by court-appointed and
                                    retained lawyers.
                                </Paragraph>
                                <br></br>
                                <Paragraph>
                                    We noticed that with all the cases grouped
                                    by their charge category, there is a higher
                                    representation of{' '}
                                    <Highlight>DUI offenses</Highlight> in cases
                                    with retained attorneys compared to those
                                    with court-appointed attorneys. Similarly,
                                    there is a higher representation of{' '}
                                    <Highlight>property charges</Highlight>{' '}
                                    within cases with court-appointed attorneys.
                                </Paragraph>
                            </TextContainer>
                        </Section>
                        <Visualizations>
                            {isLoadingCosmos ? (
                                <Loading />
                            ) : !parsed.success ? (
                                <ErrorComponent />
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
                            <H3>
                                What type of attorneys are represented more per
                                charge category?
                            </H3>
                            <TextContainer align="left">
                                <Paragraph>Need copy here.</Paragraph>
                            </TextContainer>
                        </Section>
                        <Visualizations>
                            <CounselPerChargeCategoryBarChart />
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
