import { useState, useEffect } from 'react'

// if user does not want animations
function usePrefersReducedMotion() {
    const [matches, setMatches] = useState(false)

    useEffect(() => {
        const media = window.matchMedia('(prefers-reduced-motion: reduce)')
        if (media.matches !== matches) {
            setMatches(media.matches)
        }
        const listener = () => {
            setMatches(media.matches)
        }
        media.addEventListener('change', listener)
        return () => media.removeEventListener('change', listener)
    }, [matches])

    return matches
}

export default usePrefersReducedMotion
