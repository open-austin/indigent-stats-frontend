export const toPercent = (num: number, denom: number) => {
    return (num / denom) * 100
}

export const decToPercent = (decimal: number) => {
    return `${decimal.toFixed(2)}%`
}
