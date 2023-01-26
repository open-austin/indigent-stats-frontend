interface InlineLinkProps {
    href: string
    children: React.ReactNode
    isExternal?: boolean
}

export const InlineLink = ({ href, isExternal, children }: InlineLinkProps) => {
    if (isExternal) {
        return (
            <a href={href} target="_blank" rel="noopener noreferrer">
                {children}
            </a>
        )
    } else {
        return <a href={href}>{children}</a>
    }
}
