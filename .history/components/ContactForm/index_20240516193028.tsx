import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Container } from '../Container'
import { H3 } from '../Typography/Headings'

const StyledIframe = styled.iframe`
    border: none;
    width: 100%;
    height: 100%;

    svg {
        display: none;
    }
`

export const ContactForm = () => {
    useEffect(() => {
        if (typeof window === 'undefined') {
            return
        }
        window?.Tally?.loadEmbeds()
    }, [])

    return (
        <Container>
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
