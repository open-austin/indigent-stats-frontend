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
} from 'recharts'
import { Case } from '../../models/Case'
import { colors } from '../../lib/colors'

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

    @media (min-width: 1000px) {
        justify-content: center;
        flex-direction: row;
        gap: 4rem;
    }
`

const ChartWrapper = styled.div`
    max-width: 50rem;
    width: 100%;
    margin-top: 2rem;
    @media (min-width: 1000px) {
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
                        minHeight={300}
                        debounce={10}
                    >
                        <BarChart data={formattedData} layout="horizontal">
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" padding={{ right: 20 }} />
                            <YAxis
                                dataKey={'percentEvidenceOfRepresentation'}
                                domain={domain}
                                ticks={ticks}
                                tickFormatter={(tick) => `${tick}%`}
                                fill={colors.blueNavy}
                            />
                            <Legend />
                            <Bar
                                maxBarSize={200}
                                key={'retained'}
                                dataKey={'retained'}
                                fill={colors.yellow}
                                name="Retained"
                            >
                                <LabelList
                                    fontSize={8}
                                    fill={colors.text}
                                    formatter={(value: number) =>
                                        value ? toPercent(value) : ''
                                    }
                                />
                            </Bar>
                            <Bar
                                maxBarSize={200}
                                key={'appointed'}
                                dataKey={'appointed'}
                                fill={colors.blueNavy}
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
