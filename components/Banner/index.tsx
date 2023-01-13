import React from 'react'
import styled from 'styled-components'
import { Container } from '../Container'

interface Props {
    bgColor: string
    color?: string
    transparent?: boolean
    children: React.ReactNode
}

const Wrapper = styled.section<Props>`
    padding: 2rem;
    margin: -2rem -4rem 0 -4rem;
    width: calc(100% + 8rem);
    background-color: ${(props) =>
        props.bgColor && props.transparent
            ? `${props.bgColor}AA`
            : props.bgColor};
`

const InnerWrapper = styled.div<Partial<Props>>`
    text-align: center;
    max-width: 70rem;
    margin: 0 auto;
    color: ${(props) => props.color};
`

export const Banner = ({ bgColor, color, children, transparent }: Props) => {
    return (
        <Wrapper bgColor={bgColor} transparent={transparent}>
            <Container>
                <InnerWrapper color={color}>{children}</InnerWrapper>
            </Container>
        </Wrapper>
    )
}
