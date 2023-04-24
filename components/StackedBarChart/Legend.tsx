import React, { ReactNode } from 'react'
import { Props } from 'recharts/types/component/Legend'
import styled from 'styled-components'
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
        retained: number
        appointed: number
    }
): ReactNode => {
    return (
        <LegendWrapper>
            <LegendSampleSize>
                <LegendSampleSizeTitle>Sample size</LegendSampleSizeTitle>
                <div>
                    <small>
                        Retained: {sums?.retained} cases
                        <br />
                        Court Appointed: {sums?.appointed} cases
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
