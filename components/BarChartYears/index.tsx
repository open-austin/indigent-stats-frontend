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
import { colors } from '../../lib/colors'
import { bp } from '../../lib/breakpoints'
import { renderLegend } from './Legend'
import { groupBy } from '../../lib/array'
import { mapWithIndex } from '../../lib/record'
import { FullWidthContainer } from '../FullWidthContainer'
import useMediaQuery from '../../lib/hooks/useMediaQuery'
import { H4 } from '../Typography/Headings'

const Layout = styled.section`
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1 1;

    @media ${bp.lg} {
        justify-content: center;
        flex-direction: row;
        gap: 4rem;
    }
`

const ChartWrapper = styled.div`
    max-width: 80rem;
    width: 100%;
    margin-top: 2rem;
    @media ${bp.lg} {
        flex: 1;
        margin-top: 0;
    }
`

const ChartTitle = styled(H4)`
    text-align: center;
`

type CasesByYear = Array<{
    attorney_type: string
    year: number
    case_count: number
    has_evidence_of_representation: boolean
}>

interface BarChartProps {
    data: CasesByYear
}

interface BarChartIndividualProps {
    totals: TotalsByYear
    retained: number
    appointed: number
}

const toPercent = (decimal: number) => {
    return `${decimal.toFixed(2)}%`
}

const domain = [0, 15]
const ticks = [0, 5, 10, 15]

const BarChartDesktop = ({
    totals,
    retained,
    appointed,
}: BarChartIndividualProps) => {
    return (
        <ResponsiveContainer width={'100%'} minHeight={600} debounce={10}>
            <BarChart
                data={Object.values(totals)}
                layout="horizontal"
                margin={{
                    top: 20,
                    bottom: 20,
                    right: 20,
                    left: 20,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" tick={{ fontSize: 10 }} >
                    <Label
                        value="Years"
                        dy="800"
                        position={'bottom'}
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
                        value="% of Cases with Evidence of Representation"
                        position={'left'}
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
                        renderLegend('Attorney type', props, {
                            retained,
                            appointed,
                        })
                    }
                />
                <Bar
                    maxBarSize={200}
                    key={'retained'}
                    dataKey={'retained'}
                    fill={colors.violet}
                    name="Retained"
                    isAnimationActive={false}
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
                    isAnimationActive={false}
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
    )
}

const BarChartMobile = ({
    totals,
    retained,
    appointed,
}: BarChartIndividualProps) => {
    return (
        <ResponsiveContainer
            width={'100%'}
            height={'100%'}
            minHeight={'100vh'}
            debounce={10}
        >
            <BarChart
                data={Object.values(totals)}
                barGap={25}
                layout="vertical"
                margin={{
                    top: 20,
                    bottom: 20,
                    right: 20,
                    left: 20,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <YAxis dataKey="year" type="category" tick={{ fontSize: 10 }}>
                    {/* <Label
                        value="Years"
                        position={'left'}
                        angle={-90}
                        style={{
                            textAnchor: 'middle',
                            paddingBottom: 20,
                            fontSize: 12,
                            position: 'relative',
                            left: '-80px',
                            fontWeight: 'bold',
                        }}
                    /> */}
                </YAxis>
                <XAxis
                    type="number"
                    dataKey={'percentEvidenceOfRepresentation'}
                    domain={domain}
                    ticks={ticks}
                    tick={{ fontSize: 10 }}
                    tickFormatter={(tick) => `${tick}%`}
                    fill={colors.blueNavy}
                >
                    <Label
                        value="Percent of Cases with Evidence of Representation"
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
                <Bar
                    maxBarSize={200}
                    barSize={25}
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
                    barSize={25}
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
                </Bar>{' '}
                <Legend
                    // @ts-ignore: Not a relevant props error
                    content={(props: LegendProps) =>
                        renderLegend('Attorney type', props, {
                            retained,
                            appointed,
                        })
                    }
                />
            </BarChart>
        </ResponsiveContainer>
    )
}

function BarChartYears({ data }: BarChartProps) {
    const isLg = useMediaQuery('lg')

    const groupedByYear = groupBy(data)((a) => a.year.toString())
    const totals = getTotals(groupedByYear)

    // Sum the number of cases
    const retained = data
        .filter((a) => a.attorney_type === 'Retained')
        .reduce((acc, curr) => acc + curr.case_count, 0)
    const appointed = data
        .filter((a) => a.attorney_type === 'Court Appointed')
        .reduce((acc, curr) => acc + curr.case_count, 0)

    return (
        <>
            <Layout className='years-bar-chart'>
                <ChartWrapper>
                    <ChartTitle>
                        Evidence of Representation Over the Years
                    </ChartTitle>

                    <FullWidthContainer hasPadding={true}>
                        {isLg ? (
                            <BarChartDesktop
                                retained={retained}
                                appointed={appointed}
                                totals={totals}
                            />
                        ) : (
                            <BarChartMobile
                                retained={retained}
                                appointed={appointed}
                                totals={totals}
                            />
                        )}
                    </FullWidthContainer>
                </ChartWrapper>
            </Layout>
        </>
    )
}

export default BarChartYears

type GroupedByYear = Record<
    string,
    Array<{
        attorney_type: string
        year: number
        case_count: number
    }>
>

type TotalsByYear = Record<
    string,
    {
        year: string
        retained: number
        appointed: number
    }
>

const getTotals = (r: GroupedByYear): TotalsByYear => {
    return mapWithIndex(r, (year, stats) => {
        const groupedByAttorneyType = groupBy(stats)((s) => s.attorney_type)

        const r1 = groupedByAttorneyType['Retained'][0].case_count
        const r2 = groupedByAttorneyType['Retained'][1].case_count
        const c1 = groupedByAttorneyType['Court Appointed'][0].case_count
        const c2 = groupedByAttorneyType['Court Appointed'][1].case_count

        const retained = (r1 > r2 ? r2 / r1 : r1 / r2) * 100
        const appointed = (c1 > c2 ? c2 / c1 : c1 / c2) * 100

        return {
            year,
            retained,
            appointed,
        }
    })
}
