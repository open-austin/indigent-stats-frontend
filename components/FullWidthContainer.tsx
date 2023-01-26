import React from 'react'
import styled from 'styled-components'
import { Container } from './Container'

interface Props {
    bgColor?: string
    transparent?: boolean
    children: React.ReactNode
    hasPadding?: boolean
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

export const FullWidthContainer = ({ bgColor, children, transparent, hasPadding }: Props) => {
    return (
        <Wrapper bgColor={bgColor} transparent={transparent}>
            <Container hasPadding={hasPadding}>
                {children}
            </Container>
        </Wrapper>
    )
}
