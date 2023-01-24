import { useCallback, useEffect, useState } from 'react'
import { size } from '../breakpoints'

// mobile-first, so breakpoint is min-width
const useMediaQuery = (breakpoint: keyof typeof size) => {
    const [state, setState] = useState({
        windowWidth: size.lg,
        isDesiredWidth: false,
    })

    const resizeHandler = useCallback(() => {
        const currentWindowWidth = window?.innerWidth
        const isDesiredWidth = currentWindowWidth >= size[breakpoint]
        setState({ ...state, windowWidth: currentWindowWidth, isDesiredWidth })
    }, [state, breakpoint])

    useEffect(() => {
        window.addEventListener('resize', resizeHandler)
        return () => window.removeEventListener('resize', resizeHandler)
    }, [breakpoint, state, resizeHandler])

    return state.isDesiredWidth
}

export default useMediaQuery
