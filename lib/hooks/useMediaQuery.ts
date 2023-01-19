import { useEffect, useState } from 'react'
import { size } from '../breakpoints'

// mobile-first, so breakpoint is min-width
const useMediaQuery = (breakpoint: keyof typeof size) => {
    const [state, setState] = useState({
        windowWidth: size.lg,
        isDesiredWidth: false,
        isLoaded: false,
    })

    useEffect(() => {
        const resizeHandler = () => {
            const currentWindowWidth = window?.innerWidth
            const isDesiredWidth = currentWindowWidth > size[breakpoint]
            setState({ ...state, windowWidth: currentWindowWidth, isDesiredWidth })
        }
        if (!state.isLoaded) {
            console.log('not loaded')
            resizeHandler()
            setState({ ...state, isLoaded: true })
        }
        window.addEventListener('resize', resizeHandler)
        return () => window.removeEventListener('resize', resizeHandler)
    }, [breakpoint, state])

    return state.isDesiredWidth
}

export default useMediaQuery
