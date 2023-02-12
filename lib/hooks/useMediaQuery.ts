import { useState, useEffect } from 'react'
import { bp } from '../breakpoints'

// mobile-first, so query is 'min-width'
function useMediaQuery(screenSize: keyof typeof bp) {
    const [matches, setMatches] = useState(false)

    useEffect(() => {
        const query = bp[screenSize]
        const media = window.matchMedia(query)
        if (media.matches !== matches) {
            setMatches(media.matches)
        }
        const listener = () => {
            setMatches(media.matches)
        }
        media.addEventListener('change', listener)
        return () => media.removeEventListener('change', listener)
    }, [matches, screenSize])

    return matches
}

export default useMediaQuery
