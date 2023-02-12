import { ReactNode } from 'react'
import styled from 'styled-components'

import { Props } from 'recharts/types/component/Legend'

import {
    LegendWrapper,
    LegendBox,
    LegendTitle,
    LegendSpan,
    LegendColorBlock,
    LegendSampleSize,
    LegendSampleSizeTitle,
} from '../LegendUI'

const LegendBoxRow = styled(LegendBox)`
    max-width: 100%;
`

const LegendItems = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1rem;
`

export const renderLegend = (
    props: Props,
    title: string,
    sums: {
        appointed: number
        retained: number
    }
): ReactNode => {
    return (
        <LegendWrapper>
            <LegendSampleSize>
                <LegendSampleSizeTitle>Sample size</LegendSampleSizeTitle>
                <div>
                    <small>
                        Retained: {sums.retained} cases
                        <br />
                        Court Appointed: {sums.appointed} cases
                        <br />
                        Total: {sums.appointed + sums.retained}
                    </small>
                </div>
            </LegendSampleSize>
            <LegendBoxRow>
                <LegendTitle>
                    <strong>{title}</strong>
                </LegendTitle>
                <LegendItems>
                    {[...(props.payload || [])].map((entry, index) => (
                        <LegendSpan key={`item-${index}`}>
                            <LegendColorBlock
                                style={{
                                    backgroundColor: entry.color,
                                }}
                            />
                            {entry.value}
                        </LegendSpan>
                    ))}
                </LegendItems>
            </LegendBoxRow>
        </LegendWrapper>
    )
}
