import Head from 'next/head'
import styled from 'styled-components'

import BarChartInteractive from '../components/BarChartInteractive'
import { BarChartYears } from '../components/BarChartYears'
import { Container, TextContainer } from '../components/Container'
import CounselPerChargeCategoryBarChart from '../components/CounselPerChargeCategoryBarChart'
import FadeInSection from '../components/FadeInSection'
import Hero from '../components/Hero'
import { InlineLink } from '../components/Link'
import { Section } from '../components/Section'
import Spacer from '../components/Spacer'
import StackedBarChart from '../components/StackedBarChart'
import { Paragraph, Small } from '../components/Typography/Body'
import { H3 } from '../components/Typography/Headings'
import { Highlight } from '../components/Typography/Highlight'

import { bp } from '../lib/breakpoints'
import styles from '../styles/Home.module.css'
import { ContactForm } from '../components/ContactForm'

const Visualizations = styled.section`
    position: relative;
    min-height: 50vh;
    margin: 2rem 0 6rem;

    @media ${bp.lg} {
        margin: 6rem 0;
    }
`

export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Open Austin | Indigent Defense Data Visualization</title>
                <meta name="description" content="Indigent Defense Stats" />
                <link rel="icon" href="/favicon.ico" />
                <script
                    async={true}
                    src="https://tally.so/widgets/embed.js"
                ></script>
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
                                    A defense attorney that is providing good
                                    representation generally files motions into
                                    the court case file to advocate for better
                                    results for their clients. Some of these
                                    motions include{' '}
                                    <Highlight>
                                        motions for production of discovery
                                    </Highlight>
                                    , to{' '}
                                    <Highlight>
                                        reduce their client&apos;s bond
                                    </Highlight>
                                    , to{' '}
                                    <Highlight>
                                        request a speedy trial
                                    </Highlight>
                                    , or to{' '}
                                    <Highlight>
                                        suppress evidence at trial
                                    </Highlight>{' '}
                                    (sometimes called a motion to suppress or a
                                    motion in limine).
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
                                    client&apos;s case even if one of these
                                    motions is filed. We are using motions as a
                                    proxy because most of the time,{' '}
                                    <Highlight>
                                        filing at least one of these motions is
                                        a good indicator that a lawyer is
                                        putting{' '}
                                        <strong>at least some effort</strong>{' '}
                                        into their client&apos;s case
                                    </Highlight>
                                    .
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
                                    Typically, poorer people with appointed
                                    counsel go through the legal system without
                                    the zealous advocacy that a retained
                                    attorney or well-funded institutional public
                                    defender might provide because their
                                    appointed attorneys do not have the time to
                                    investigate a variety of legal strategies in
                                    each case.
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
                                    Try out the dashboard below to compare what
                                    kind of representation people get from court
                                    appointed lawyers with that of retained
                                    lawyers. You can compare different types of
                                    motions they file across different types of
                                    cases.
                                </Paragraph>
                            </TextContainer>
                        </Section>
                        <Visualizations>
                            <div className={styles.charts}>
                                <BarChartInteractive />
                            </div>
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
                                    The graph below also displays the change in
                                    evidence of representation over time.
                                </Paragraph>
                            </TextContainer>
                        </Section>
                        <Visualizations>
                            <BarChartYears />
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
                                    We explored whether people who are charged
                                    with certain types of offenses were more
                                    likely to have an appointed or a retained
                                    attorney.
                                </Paragraph>
                                <br></br>
                                <Paragraph>
                                    We found that{' '}
                                    <Highlight>
                                        people charged with DWIs were more
                                        likely to have retained attorneys
                                    </Highlight>{' '}
                                    and that{' '}
                                    <Highlight>
                                        people charged with property offenses
                                        were more likely to have court-appointed
                                        attorneys
                                    </Highlight>
                                    . Overall, there were lots of similarities
                                    between people charged with different
                                    offenses.
                                </Paragraph>
                            </TextContainer>
                        </Section>
                        <Visualizations>
                            <div className={styles.charts}>
                                <StackedBarChart />
                            </div>
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
                                <Paragraph>
                                    Whether someone accused of a crime hires an
                                    attorney or is appointed one depends on a
                                    lot of factors. The accused may have more
                                    money and resources to afford an attorney.
                                    For instance, if more people arrested for
                                    driving while intoxicated charges tend to
                                    have a higher income compared to people
                                    charged with other types of crimes, then we
                                    would see a higher proportion of folks
                                    accused of DWIs retaining their own
                                    attorney.
                                </Paragraph>
                                <br />
                                <br />
                                <Paragraph>
                                    The nature of the charge may also be
                                    associated with someone&apos;s ability to
                                    retain their own attorney. If someone who is
                                    experiencing homelessness must sleep in a
                                    private place to avoid the elements
                                    (criminal trespass) or must take food in
                                    order to survive (theft), then people with
                                    lower incomes or who may be experiencing
                                    homelessness may be more likely to be
                                    charged with those types of crimes.
                                </Paragraph>
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
                                            Hays County, but intend to expand
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
            <FadeInSection>
                <ContactForm />
            </FadeInSection>
            <Spacer />
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
