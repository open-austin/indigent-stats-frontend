import styled from 'styled-components'
import { bp } from '../lib/breakpoints'

const Spacer = styled.div<{
    mdHeight?: string
    lgHeight?: string
    height?: string
}>`
    height: ${(props) => (props.height ? props.height : '3rem')};

    @media ${bp.md} {
        height: ${(props) => (props.mdHeight ? props.mdHeight : '4rem')};
    }

    @media ${bp.lg} {
        height: ${(props) => (props.lgHeight ? props.lgHeight : '6rem')};
    }
`

export default Spacer
