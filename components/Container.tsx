import styled from 'styled-components'
import { bp, size } from '../lib/breakpoints'
import { colors } from '../lib/colors'

export const Container = styled.div<{ hasPadding?: boolean }>`
    max-width: ${size.lg}px;
    margin: 0 auto;
    ${(props) =>
        props.hasPadding
            ? `
      padding: 0 2rem;

      @media ${bp.lg} {
        padding: 0;
      }
    
    `
            : ``}
`
export const TextContainer = styled.div<{
    align?: 'center' | 'right' | 'left'
}>`
    @media ${bp.lg} {
        max-width: 70%;
    }

    ${(props) => {
        if (props.align === 'left') {
            return `text-align: left;`
        } else if (props.align === 'right') {
            return `text-align: right;`
        } else {
            return `margin: 0 auto;`
        }
    }}

    strong {
        color: ${colors.text};
        font-weight: 600;
        position: relative;
        white-space: nowrap;
        z-index: 0;

        &:after {
            content: '';
            background-color: ${colors.yellowLight}CC;
            position: absolute;
            height: 72%;
            left: -3px;
            width: 101%;
            right: 3px;
            bottom: 0;
            z-index: -1;
        }
    }
`
