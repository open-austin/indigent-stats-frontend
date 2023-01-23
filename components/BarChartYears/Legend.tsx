import React, { ReactNode } from 'react'
import { Props } from 'recharts/types/component/Legend'
import {
    LegendWrapper,
    LegendSampleSize,
    LegendSampleSizeTitle,
    LegendBox,
    LegendTitle,
    LegendSpan,
    LegendColorBlock,
} from '../LegendUI'

export const renderLegend = (
    title: string,
    props: Props,
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
                        Retained: {sums.retained} cases
                        <br />
                        Court Appointed: {sums.appointed} cases
                    </small>
                </div>
            </LegendSampleSize>
            <LegendBox>
                <LegendTitle>
                    <strong>{title}</strong>
                </LegendTitle>
                {[...(props.payload || [])].reverse().map((entry, index) => (
                    <LegendSpan key={`item-${index}`}>
                        <LegendColorBlock
                            style={{
                                backgroundColor: entry.color,
                            }}
                        />
                        {entry.value}
                    </LegendSpan>
                ))}
            </LegendBox>
        </LegendWrapper>
    )
}
