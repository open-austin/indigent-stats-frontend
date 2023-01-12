import React from 'react'
import styled from 'styled-components'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Legend,
    LabelList,
    Label,
} from 'recharts'
import { Props as LegendProps } from 'recharts/types/component/Legend'
import { Case } from '../../models/Case'
import { colors } from '../../lib/colors'
import { bp } from '../../lib/breakpoints'
import { renderLegend } from './Legend'

interface BarChartProps {
    data: Array<Case>
}

export type AttorneySummary = {
    attorney: 'Retained' | 'Court Appointed'
    data: Array<Case>
    evidenceOfRepresentation: number
}

const Layout = styled.section`
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1 1;
    margin-top: 10rem;

    @media ${bp.lg} {
        justify-content: center;
        flex-direction: row;
        gap: 4rem;
    }
`

const ChartWrapper = styled.div`
    max-width: 50rem;
    width: 100%;
    margin-top: 2rem;
    @media ${bp.lg} {
        flex: 1;
        margin-top: 0;
    }
`

const ChartTitle = styled.h2`
    text-align: center;
`

function BarChartYears({ data }: BarChartProps) {
    const getPercentOfEvidenceOfRepresentationPerYear = (
        arr: Array<Case>,
        year: number
    ) => {
        const totalCasesInYear = arr.filter((c) => c.year === year)
        const totalCasesWithMotions = totalCasesInYear.reduce(
            (acc, cur) => (cur.has_evidence_of_representation ? ++acc : acc),
            0
        )

        console.log('total cases ', year, totalCasesInYear.length)

        return (totalCasesWithMotions / totalCasesInYear.length) * 100
    }

    const filterByAttorneyType = (
        arr: Array<Case>,
        attorneyType: 'Retained' | 'Court Appointed'
    ) => {
        return arr.filter((c) => c.attorney_type === attorneyType)
    }

    const years = [
        ...new Set(
            data
                .map((item) => item.year)
                .filter((year) => year! >= 2009)
                .sort((a, b) => a! - b!)
        ),
    ]

    console.log('years ', years)

    const formattedData = years.map((year?: number) => {
        if (!year) {
            return
        }

        return {
            year: year,
            retained: getPercentOfEvidenceOfRepresentationPerYear(
                filterByAttorneyType(data, 'Retained'),
                year
            ),
            appointed: getPercentOfEvidenceOfRepresentationPerYear(
                filterByAttorneyType(data, 'Court Appointed'),
                year
            ),
        }
    })

    console.log('data ', data)
    console.log('formattedData\n', formattedData)

    if (!data) return <div>Loading...</div>

    const domain = [0, 15]
    const ticks = [0, 5, 10, 15]
    const toPercent = (decimal: number) => {
        return `${decimal.toFixed(2)}%`
    }

    return (
        <>
            <Layout>
                <ChartWrapper>
                    <ChartTitle>
                        Evidence of Representation Over the Years
                    </ChartTitle>
                    <ResponsiveContainer
                        width={'100%'}
                        minHeight={600}
                        debounce={10}
                    >
                        <BarChart
                            data={formattedData}
                            layout="horizontal"
                            margin={{
                                top: 20,
                                bottom: 20,
                                right: 20,
                                left: 20,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" tick={{ fontSize: 10 }}>
                                <Label
                                    value="Years"
                                    position={'center'}
                                    style={{
                                        textAnchor: 'middle',
                                        paddingBottom: 20,
                                        transform: 'translateY(1.5rem)',
                                        fontSize: 12,
                                        position: 'relative',
                                        left: '-80px',
                                        fontWeight: 'bold',
                                    }}
                                />
                            </XAxis>
                            <YAxis
                                dataKey={'percentEvidenceOfRepresentation'}
                                domain={domain}
                                ticks={ticks}
                                tick={{ fontSize: 10 }}
                                tickFormatter={(tick) => `${tick}%`}
                                fill={colors.blueNavy}
                            >
                                <Label
                                    value="Percent of Cases"
                                    position={'center'}
                                    angle={-90}
                                    style={{
                                        textAnchor: 'middle',
                                        paddingBottom: 20,
                                        fontSize: 12,
                                        position: 'relative',
                                        left: '-80px',
                                        fontWeight: 'bold',
                                    }}
                                />
                            </YAxis>
                            <Legend
                                // @ts-ignore: Not a relevant props error
                                content={(props: LegendProps) =>
                                    renderLegend(props, data, 'Attorney type')
                                }
                            />
                            <Bar
                                maxBarSize={200}
                                key={'retained'}
                                dataKey={'retained'}
                                fill={colors.violet}
                                name="Retained"
                            >
                                <LabelList
                                    fontSize={8}
                                    fill={colors.white}
                                    formatter={(value: number) =>
                                        value ? toPercent(value) : ''
                                    }
                                />
                            </Bar>
                            <Bar
                                maxBarSize={200}
                                key={'appointed'}
                                dataKey={'appointed'}
                                fill={colors.orange}
                                name="Court appointed"
                            >
                                <LabelList
                                    fontSize={8}
                                    fill={colors.white}
                                    formatter={(value: number) =>
                                        value ? toPercent(value) : ''
                                    }
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartWrapper>
            </Layout>
        </>
    )
}

export default BarChartYears
