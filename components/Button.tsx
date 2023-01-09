import styled from 'styled-components'
import { colors } from '../lib/colors'

export const Button = styled.button`
    background: ${colors.blueNavy};
    padding: 12px 24px;
    border: 1px solid ${colors.white};
    border-radius: 4px;
    color: ${colors.white};
    cursor: pointer;
    margin-top: 12px;
    width: 100%;
`
