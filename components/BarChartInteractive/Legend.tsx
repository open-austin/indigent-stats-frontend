import React, { useState, ReactNode } from 'react'
import styled from 'styled-components'
import { Props } from 'recharts/types/component/Legend'
import { AttorneySummary } from '.'
import { colors } from '../../lib/colors'
import {
    LegendWrapper,
    LegendSampleSize,
    LegendSampleSizeTitle,
    LegendBox,
    LegendTitle,
    LegendSpan,
    LegendColorBlock,
    Tooltip,
} from '../LegendUI'

export const renderLegend = (
    props: Props,
    notEnoughData: boolean,
    arr: Array<AttorneySummary>,
    title: string
): ReactNode => {
    return (
        <LegendWrapper>
            <LegendSampleSize>
                <LegendSampleSizeTitle>Sample size</LegendSampleSizeTitle>
                <div>
                    <small>
                        Retained: {arr[0].data?.length} cases <br />
                        Court Appointed: {arr[1].data?.length} cases
                    </small>
                </div>
                {notEnoughData && (
                    <small style={{ color: colors.orange }}>
                        <em>
                            <br />
                            *This filtered sample size is not large enough to
                            make a conclusion.
                        </em>
                    </small>
                )}
            </LegendSampleSize>
            <LegendBox>
                <LegendTitle>
                    <strong>{title}</strong>
                    <Tooltip />
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
