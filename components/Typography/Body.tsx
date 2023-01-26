import styled from 'styled-components'
import { bp } from '../../lib/breakpoints'
import { colors } from '../../lib/colors'

export const Paragraph = styled.p`
    font-size: 1.25rem;
    line-height: 2;
    color: ${colors.text};
    margin-top: 0;
    margin-bottom: 0.5rem;

    @media ${bp.lg} {
        font-size: 1.5rem;
        line-height: 1.75;
    }
`

export const Small = styled.small`
    color: ${colors.grayText};
    font-weight: 500;
    font-size: 1rem;
`
