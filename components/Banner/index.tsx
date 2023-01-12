import React from 'react'
import styled from 'styled-components'

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
    max-width: 70%;
    margin: 0 auto;
    color: ${(props) => props.color};
`

export const Banner = ({ bgColor, color, children, transparent }: Props) => {
    return (
        <Wrapper bgColor={bgColor} transparent={transparent}>
            <InnerWrapper color={color}>{children}</InnerWrapper>
        </Wrapper>
    )
}
