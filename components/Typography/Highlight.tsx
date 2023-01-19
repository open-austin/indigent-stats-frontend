import styled from 'styled-components'
import { colors } from '../../lib/colors'

export const Highlight = styled.span`
    color: ${colors.text};
    background-color: ${colors.yellowLight};
    font-weight: 600;
    position: relative;
    z-index: 0;

    /* &:after {
        content: '';
        background-color: ${colors.yellowLight};
        position: absolute;
        height: 78%;
        left: -3px;
        width: 101%;
        right: 3px;
        bottom: 0;
        z-index: -1;
    } */
`
