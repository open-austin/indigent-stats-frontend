import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Container } from '../Container'
import { H3 } from '../Typography/Headings'

const StyledIframe = styled.iframe`
    border: none;
    width: 100%;
    height: 100%;
    padding: 0 32px;

    svg {
        display: none !important;
    }
`

export const ContactForm = () => {
    useEffect(() => {
        if (typeof window === 'undefined') {
            return
        }
        // @ts-ignore - Tally is a global object from the loaded script
        Tally?.loadEmbeds()
    }, [])

    return (
        <Container>
            <H3>Have any feedback for us?</H3>
            <p>
                We&apos;re still learning and figuring out how we can better
                scrape and analyze this data, and we would love any feedback or
                suggestions you have.
            </p>
            <StyledIframe
                data-tally-src="https://tally.so/embed/nGrOYo?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
                loading="lazy"
                width="100%"
                height="100"
                title="null"
            ></StyledIframe>
        </Container>
    )
}
