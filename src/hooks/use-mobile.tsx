
import * as React from "react"

// Define mobile breakpoints for consistent use across the app
export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${BREAKPOINTS.MOBILE - 1}px)`)
    
    const onChange = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS.MOBILE)
    }
    
    // Add event listener
    mql.addEventListener("change", onChange)
    
    // Set initial value
    setIsMobile(window.innerWidth < BREAKPOINTS.MOBILE)
    
    // Cleanup
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

export function useIsTablet() {
  const [isTablet, setIsTablet] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(
      `(min-width: ${BREAKPOINTS.MOBILE}px) and (max-width: ${BREAKPOINTS.TABLET - 1}px)`
    )
    
    const onChange = () => {
      setIsTablet(
        window.innerWidth >= BREAKPOINTS.MOBILE && 
        window.innerWidth < BREAKPOINTS.TABLET
      )
    }
    
    // Add event listener
    mql.addEventListener("change", onChange)
    
    // Set initial value
    setIsTablet(
      window.innerWidth >= BREAKPOINTS.MOBILE && 
      window.innerWidth < BREAKPOINTS.TABLET
    )
    
    // Cleanup
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isTablet
}

export function useResponsiveValue<T>(
  options: { 
    mobile: T; 
    tablet?: T; 
    desktop: T 
  }
): T {
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()
  
  if (isMobile) return options.mobile
  if (isTablet && options.tablet) return options.tablet
  return options.desktop
}
