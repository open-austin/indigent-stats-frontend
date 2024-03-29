import styled from 'styled-components'
import Image from 'next/image'
import { colors } from '../lib/colors'
import AnimatedBackground from './AnimatedBackground'
import { Banner } from './Banner'
import { Container, TextContainer } from './Container'
import { Section } from './Section'
import { Highlight } from './Typography/Highlight'
import { H1 } from './Typography/Headings'
import { bp } from '../lib/breakpoints'
import openAustinSvg from '../public/open-austin-logo.svg'
import { InlineLink } from './Link'
import FadeInSection from './FadeInSection'
import usePrefersReducedMotion from '../lib/hooks/usePrefersReducedMotion'

const Wrapper = styled.div`
    position: relative;
    overflow: hidden;
    left: -2rem;
    right: -2rem;
    top: -2rem;
    bottom: -2rem;
    width: calc(100% + 4rem);
    padding: 4rem 2rem 0 2rem;
    display: flex;
    align-items: center;
    flex-direction: column;
    color: ${colors.text};
    font-size: 1.25rem;

    @media ${bp.lg} {
        padding: 10rem 4rem 0 4rem;
    }
`

const BannerWrapper = styled.div``

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
    min-height: 100vh;
    height: 100%;

    @media ${bp.md} {
        min-height: 50vh;
        margin: 0 auto;
    }

    @media ${bp.lg} {
        min-height: 90vh;
        max-width: 70%;
    }
`

const Heading = styled(H1)`
    color: ${colors.openAustinOrange};
    text-align: center;
    margin-bottom: 1rem;
`

const Subheading = styled.p`
    line-height: 2;
    color: ${colors.grayText};
    text-align: center;
    max-width: 90%;
    margin: 0 auto;
    font-weight: 500;
    font-size: 1.1rem;

    @media ${bp.lg} {
        font-size: 1.3rem;
    }
`
const BiggerText = styled.p`
    color: ${(props) => (props.color ? props.color : colors.openAustinOrange)};
    font-size: 1.5rem;
    line-height: 1.75;
    font-weight: 400;
    font-family: 'Merriweather', serif;

    @media ${bp.lg} {
        font-size: 2rem;
    }
`


const ImageWrapper = styled.div`
    display: flex;
    justify-content: center;

    img {
        width: auto;
        max-height: 5rem;

        @media ${bp.lg} {
            max-height: 8rem;
        }
    }
`

const Hero = () => {
    const prefersReducedMotion = usePrefersReducedMotion()
    const headingText = 'Democratizing Criminal Defense Data'

    return (
        <Section>
            <Wrapper>
                <Background>
                    {prefersReducedMotion ? null : <AnimatedBackground />}
                </Background>
                <FadeInSection>
                    <Container>
                        <HeaderWrapper className="fade-in-load">
                            <ImageWrapper>
                                <Image
                                    src={openAustinSvg}
                                    alt="Open Austin logo"
                                    priority
                                />
                            </ImageWrapper>
                            <Heading>{headingText}</Heading>
                            <Subheading>
                                Our organization,{' '}
                                <InlineLink
                                    href="https://www.open-austin.org"
                                    isExternal={true}
                                >
                                    Open Austin
                                </InlineLink>
                                , in partnership with{' '}
                                <InlineLink
                                    href="https://www.fairdefense.org/"
                                    isExternal={true}
                                >
                                    Texas Fair Defense Project
                                </InlineLink>
                                , began creating a database for criminal court
                                case records that were previously siloed within
                                their respective county websites. &nbsp; The
                                goal of this work is to visualize this data to
                                help policymakers, advocates, and everyday
                                people understand the current state of public
                                defense representation in their communities and,
                                where appropriate, advocate for improvements.
                            </Subheading>
                        </HeaderWrapper>
                    </Container>
                </FadeInSection>
            </Wrapper>
            <BannerWrapper>
                <FadeInSection>
                    <Banner bgColor={colors.blueNavy} color={colors.white}>
                        <TextContainer>
                            <BiggerText color={colors.white}>
                                <Highlight>
                                    Very few people accused of crimes in Hays
                                    County have any evidence of defense motions
                                    being filed in their court case files
                                </Highlight>{' '}
                                — things like defense requests for evidence,
                                motions to suppress that evidence, or other
                                evidence of effective representation. This is
                                particularly true of people represented by
                                court-appointed counsel.
                            </BiggerText>
                        </TextContainer>
                    </Banner>
                </FadeInSection>
            </BannerWrapper>
        </Section>
    )
}

export default Hero
