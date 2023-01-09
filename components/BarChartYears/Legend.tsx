import React, { ReactNode } from 'react'
import { Props } from 'recharts/types/component/Legend'
import { Case } from '../../models/Case'
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
    props: Props,
    arr: Array<Case>,
    title: string
): ReactNode => {
    return (
        <LegendWrapper>
            <LegendSampleSize>
                <LegendSampleSizeTitle>Sample size</LegendSampleSizeTitle>
                <div>
                    <small>
                        Retained:{' '}
                        {
                            arr?.filter((c) => c.attorney_type === 'Retained')
                                .length
                        }{' '}
                        cases <br />
                        Court Appointed:{' '}
                        {
                            arr?.filter(
                                (c) => c.attorney_type === 'Court Appointed'
                            ).length
                        }{' '}
                        cases
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
