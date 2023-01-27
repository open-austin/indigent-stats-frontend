import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import usePrefersReducedMotion from '../lib/hooks/usePrefersReducedMotion'

const ease = `cubic-bezier(0.65, 0, 0.35, 1)`
const FadeIn = styled.div<{ isVisible: boolean }>`
    transition: opacity 0.5s ${ease}, transform 0.9s ${ease};
    will-change: opacity, transform;
    opacity: 0;
    transform: translateY(2.5vh);

    ${(props) => {
        if (props.isVisible) {
            return `
              opacity: 1;
              transform: none;
            `
        }
    }}
`

const FadeInSection = ({ children }: { children: React.ReactNode }) => {
    const [isVisible, setVisible] = React.useState(true)
    const domRef = useRef(null)
    const prefersReducedMotion = usePrefersReducedMotion()

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => setVisible(entry.isIntersecting))
        })
        const current = domRef.current
        if (current) {
            observer.observe(current)
            return () => observer.unobserve(current)
        }
    }, [])

    return (
        <>
            {prefersReducedMotion ? (
                children
            ) : (
                <FadeIn isVisible={isVisible} ref={domRef}>
                    {children}
                </FadeIn>
            )}
        </>
    )
}

export default FadeInSection
