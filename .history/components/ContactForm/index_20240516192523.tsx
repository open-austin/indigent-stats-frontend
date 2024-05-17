import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Container } from '../Container'
import { H3 } from '../Typography/Headings'

export const ContactForm = () => {
    useEffect(() => {
        Tally?.loadEmbeds()
    }, [Tally])

    return (
        <Container>
            <H3>Contact Form</H3>
            <iframe
                data-tally-src="https://tally.so/embed/nGrOYo?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
                loading="lazy"
                width="100%"
                height="100"
                title="null"
            ></iframe>
        </Container>
    )
}
