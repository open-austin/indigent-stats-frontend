export const size = {
    sm: 460,
    md: 700,
    lg: 1200,
    xl: 1440,
}

export const bp = {
    sm: `(min-width: ${size.sm}px)`,
    md: `(min-width: ${size.md}px)`,
    lg: `(min-width: ${size.lg}px)`,
    xl: `(min-width: ${size.xl}px)`,
    smUnder: `(max-width: ${size.sm - 1}px)`,
    mdUnder: `(max-width: ${size.md - 1}px)`,
    lgUnder: `(max-width: ${size.lg - 1}px)`,
    xlUnder: `(max-width: ${size.xl - 1}px)`,
}
