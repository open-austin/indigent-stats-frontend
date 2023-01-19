import styled from 'styled-components'
import { bp } from '../../lib/breakpoints'
import { colors } from '../../lib/colors'

export const H1 = styled.h1`
    font-size: 2rem;
    line-height: 1.5;
    color: ${colors.openAustinOrange};

    @media ${bp.lg} {
        font-size: 3rem;
    }
`

export const H2 = styled.h2`
    font-size: 2.2rem;
    line-height: 1.25;
    color: ${colors.openAustinOrange};
`
