import styled from 'styled-components'
import { bp } from '../../lib/breakpoints'
import { colors } from '../../lib/colors'

interface HeadingProps {
    color?: string
}

export const H1 = styled.h1`
    font-size: 2rem;
    line-height: 1.5;
    color: ${colors.openAustinOrange};

    @media ${bp.lg} {
        font-size: 4rem;
    }
`

export const H2 = styled.h2`
    font-size: 1.6rem;
    line-height: 1.25;
    color: ${colors.openAustinOrange};
    max-width: 25rem;

    @media ${bp.md} {
        max-width: 80%;
    }

    @media ${bp.lg} {
        font-size: 2.2rem;
    }
`

export const H3 = styled.h3<HeadingProps>`
    color: ${(props) => (props.color ? props.color : colors.openAustinOrange)};
    font-size: 1.5rem;
    line-height: 1.75;
    font-weight: 400;

    @media ${bp.lg} {
        font-size: 2rem;
    }
`

export const H4 = styled.h3`
    font-size: 1.25rem;
    line-height: 1.75;

    @media ${bp.lg} {
        font-size: 1.5rem;
    }
`
