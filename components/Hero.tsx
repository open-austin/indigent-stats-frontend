import styled from 'styled-components'
import { colors } from '../lib/colors'
import AnimatedBackground from './AnimatedBackground'
import { Banner } from './Banner'
import { Section } from './Section'

const Wrapper = styled.div`
    position: relative;
    overflow: hidden;
    left: -2rem;
    right: -2rem;
    top: -2rem;
    width: calc(100% + 4rem);
    padding: 10rem 4rem 0 4rem;
    display: flex;
    align-items: center;
    flex-direction: column;
    color: ${colors.text};
    font-size: 1.25rem;
`
const Background = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    /* Orange animation */
    /* filter: sepia(0.5) contrast(0.9) hue-rotate(-50deg); */
    z-index: -1;
`

const TextWrapper = styled.div`
    margin: 0 auto 12rem;
    line-height: 2;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6rem;
    align-items: center;
`

const Heading = styled.h1`
    padding: 1rem 0;
    margin: 0 auto 0 2rem;
    /* text-transform: uppercase; */
    /* max-width: 40rem; */
    color: ${colors.openAustinOrange};
`

const Subheading = styled.h3``

export const Hero = () => {
    // const headingText = 'Aggregating criminal court case data in Texas counties';
    const headingText =
        'Visualizing the impact of access to appointed counsel in Texas criminal cases'

    return (
        <Section>
            <Wrapper>
                <Background>
                    <AnimatedBackground />
                </Background>
                <TextWrapper>
                    <div>
                        <Heading>{headingText}</Heading>
                    </div>
                    <div>
                        <p>
                            <a
                                href="https://www.open-austin.org"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Open Austin
                            </a>{' '}
                            , a scrappy group of civic technologists, began
                            scraping and aggregating data from criminal court
                            cases in Texas counties in 2022. Prior to this, case
                            data was siloed within individual county&apos;s
                            websites and physical court records, which made it
                            difficult for policy-makers and journalists to get a
                            big picture view of statewide criminal cases.
                        </p>
                        <p></p>
                    </div>
                </TextWrapper>
                <Banner
                    bgColor={colors.blueNavy}
                    color={colors.white}
                    transparent={true}
                >
                    <Subheading>
                        <p>
                            Through this research, we learned that folks who
                            can&apos;t afford appointed counsel are less likely
                            to have adequate{' '}
                            <strong>evidence of representation</strong> in their
                            trials.
                        </p>
                    </Subheading>
                </Banner>
            </Wrapper>
        </Section>
    )
}
