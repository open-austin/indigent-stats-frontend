import styled from 'styled-components'
import Image from 'next/image'
import { colors } from '../lib/colors'
import AnimatedBackground from './AnimatedBackground'
import { Banner } from './Banner'
import { Container, TextContainer } from './Container'
import { Section } from './Section'
import { Highlight } from './Typography/Highlight'

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
    z-index: -1;
`

const HeaderWrapper = styled.div`
    margin: 0 auto 6rem;
    line-height: 2;
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 6rem;
    align-items: center;
    justify-items: center;
`

const Heading = styled.h1`
    padding: 1rem 0;
    margin: 0 auto 0 2rem;
    color: ${colors.openAustinOrange};
`

const Subheading = styled.h3``

const Description = styled.div`
    max-width: 80%;
    text-align: left;
    margin-left: 2rem;

    p {
        font-size: 1.5rem;
    }
`

export const Hero = () => {
    const headingText =
        'Visualizing the impact of access to appointed counsel in Texas criminal cases'

    return (
        <Section>
            <Wrapper>
                <Background>
                    <AnimatedBackground />
                </Background>
                <Container>
                    <HeaderWrapper>
                        <div>
                            <Heading>{headingText}</Heading>
                        </div>
                        <div>
                            <Image
                                src="/open-austin-logo.svg"
                                alt="Open Austin logo"
                                width={200}
                                height={200}
                            />
                        </div>
                    </HeaderWrapper>
                    <Section>
                        <Description>
                            <p>
                                <a
                                    href="https://www.open-austin.org"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Open Austin
                                </a>{' '}
                                began scraping and aggregating data from
                                criminal court cases in Texas counties in 2022.{' '}
                                &nbsp; Prior to this, case data was siloed
                                within individual county&apos;s websites and
                                physical court records, which made it difficult
                                for policy-makers and journalists to get a big
                                picture view of statewide criminal cases.
                            </p>
                            <br></br>
                            <br></br>
                            <br></br>
                        </Description>
                    </Section>
                </Container>
                <Banner
                    bgColor={colors.blueNavyTransparent}
                    color={colors.white}
                >
                    <Subheading>
                        <TextContainer>
                            Through this research, Open Austin learned that
                            folks who can&apos;t afford appointed counsel are
                            less likely to have adequate{' '}
                            <Highlight>evidence of representation</Highlight> in
                            their trials.
                        </TextContainer>
                    </Subheading>
                </Banner>
            </Wrapper>
        </Section>
    )
}
