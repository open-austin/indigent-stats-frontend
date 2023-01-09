import React, { ReactNode } from 'react'
import { Props } from 'recharts/types/component/Legend'
import styled from 'styled-components'
import {
    LegendWrapper,
    LegendBox,
    LegendTitle,
    LegendSpan,
    LegendColorBlock,
} from '../LegendUI'

const LegendBoxRow = styled(LegendBox)`
    max-width: none;
`

const LegendItems = styled.div`
    display: flex;
    flex-direction: row;
    gap: 1rem;
`

export const renderLegend = (props: Props, title: string): ReactNode => {
    return (
        <LegendWrapper>
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
