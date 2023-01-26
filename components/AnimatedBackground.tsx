import styled from 'styled-components'
import { colors } from '../lib/colors'

const gradientColor = colors.grayGradient

const WhiteWrapper = styled.div`
    height: 100%;
    &:before {
        z-index: 1000;
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 60vh;
        background-image: linear-gradient(
            -180deg,
            ${colors.white} 0%,
            rgba(255, 255, 255, 0) 100%
        );
    }
    &:after {
        z-index: 1000;
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 20vh;
        background-image: linear-gradient(
            0deg,
            ${colors.white} 0%,
            rgba(235, 235, 235, 0) 100%
        );
    }
`

const SquaresWrapper = styled.div`
    height: 100%;
    display: flex;
    justify-content: space-around;
    overflow: hidden;
`

const startingPosition = `100%`

const Square = styled.div`
    animation: squares 9.5s linear infinite;
    align-self: flex-end;
    width: 1em;
    height: 1em;
    transform: translateY(${startingPosition});
    background: ${gradientColor};
    transform: skew(15deg);
    &:nth-child(2) {
        height: 1.5em;
        width: 3em;
        animation-delay: 1s;
        animation-duration: 17s;
        filter: blur(5px);
    }
    &:nth-child(3) {
        height: 2em;
        width: 1em;
        animation-delay: 1.5s;
        animation-duration: 8s;
        filter: blur();
    }
    &:nth-child(4) {
        height: 1em;
        width: 1.5em;
        animation-delay: 0.5s;
        filter: blur(3px);
        animation-duration: 13s;
    }
    &:nth-child(5) {
        height: 1.25em;
        width: 2em;
        animation-delay: 4s;
        filter: blur(2px);
        animation-duration: 11s;
    }
    &:nth-child(6) {
        height: 2.5em;
        width: 2em;
        animation-delay: 2s;
        filter: blur(1px);
        animation-duration: 9s;
    }
    &:nth-child(7) {
        height: 5em;
        width: 2em;
        filter: blur(2.5px);
        animation-duration: 12s;
    }
    &:nth-child(8) {
        height: 1em;
        width: 3em;
        animation-delay: 5s;
        filter: blur(6px);
        animation-duration: 18s;
    }
    &:nth-child(9) {
        height: 1.5em;
        width: 2em;
        filter: blur(0.5px);
        animation-duration: 9s;
    }
    &:nth-child(9) {
        height: 3em;
        width: 2.4em;
        animation-delay: 6s;
        filter: blur(0.5px);
        animation-duration: 12s;
    }

    @keyframes squares {
        from {
            transform: translateY(${startingPosition}) rotate(-50deg);
        }
        to {
            transform: translateY(calc(-100vh - ${startingPosition})) rotate(20deg);
        }
    }
`

const AnimatedBackground = () => {
    return (
        <WhiteWrapper>
            <SquaresWrapper>
                <Square />
                <Square />
                <Square />
                <Square />
                <Square />
                <Square />
                <Square />
                <Square />
                <Square />
            </SquaresWrapper>
        </WhiteWrapper>
    )
}

export default AnimatedBackground
