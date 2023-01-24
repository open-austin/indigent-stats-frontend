import styled from 'styled-components'
import Image from 'next/image'
import { colors } from '../lib/colors'
import AnimatedBackground from './AnimatedBackground'
import { Banner } from './Banner'
import { Container, TextContainer } from './Container'
import { Section } from './Section'
import { Highlight } from './Typography/Highlight'
import { H1, H3 } from './Typography/Headings'
import { bp } from '../lib/breakpoints'
import openAustinSvg from '../public/open-austin-logo.svg'
import { Paragraph } from './Typography/Body'

const Wrapper = styled.div`
    position: relative;
    overflow: hidden;
    left: -2rem;
    right: -2rem;
    top: -2rem;
    width: calc(100% + 4rem);
    padding: 6rem 2rem 0 2rem;
    display: flex;
    align-items: center;
    flex-direction: column;
    color: ${colors.text};
    font-size: 1.25rem;

    @media ${bp.lg} {
        padding: 10rem 4rem 0 4rem;
    }
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
    transform: rotate(180deg);
`

const HeaderWrapper = styled.div`
    margin: 0 auto;
    line-height: 2;
    display: flex;
    flex-direction: column-reverse;
    gap: 1rem;
    align-items: center;
    text-align: center;

    @media ${bp.lg} {
        align-items: flex-start;
        margin-bottom: 6rem;
        flex-direction: row;
        gap: 6rem;
        text-align: left;
    }
`

const Heading = styled(H1)`
    padding: 1rem 0;
    color: ${colors.openAustinOrange};
    text-align: center;
    flex-basis: 60%;

    @media ${bp.lg} {
        margin: 0 auto 0 2rem;
        text-align: left;
    }
`

const ImageWrapper = styled.div`
    flex-grow: 0;
    flex-basis: 40%;
    display: flex;
    justify-content: center;

    img {
        width: 100%;
        max-width: 25%;
        height: auto;

        @media ${bp.lg} {
            max-width: none;
            max-height: 100%;
            width: auto;
        }
    }
`

const Description = styled.div`
    max-width: 80%;
    text-align: left;
    margin-left: 2rem;

    p {
        text-align: center;

        @media ${bp.lg} {
            text-align: left;
        }
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
                        <Heading>{headingText}</Heading>
                        <ImageWrapper>
                            <Image src={openAustinSvg} alt="Open Austin logo" />
                        </ImageWrapper>
                    </HeaderWrapper>
                    <Section>
                        <Description>
                            <Paragraph>
                                Our organization,{' '}
                                <a
                                    href="https://www.open-austin.org"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Open Austin
                                </a>
                                , began scraping and aggregating data from
                                criminal court cases in Hayes County in 2022.{' '}
                                &nbsp; Prior to this, case data was siloed
                                within individual county&apos;s websites and
                                physical court records, which made it difficult
                                for policy-makers and journalists to get a big
                                picture view of statewide criminal cases. &nbsp;
                                Our goal is to visualize this data to gain
                                insight into how our local justice systems work.
                            </Paragraph>
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
                    <H3>
                        <TextContainer>
                            Through this research, we learned that folks who
                            can&apos;t afford appointed counsel are{' '}
                            <u>less likely</u> to have adequate{' '}
                            <Highlight>evidence of representation</Highlight> in
                            their trials.
                        </TextContainer>
                    </H3>
                </Banner>
            </Wrapper>
        </Section>
    )
}
