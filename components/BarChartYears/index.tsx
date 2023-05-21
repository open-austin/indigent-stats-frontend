import React from 'react'
import styled from 'styled-components'
import useSWR from 'swr'
import {
    Bar,
    BarChart,
    CartesianGrid,
    Label,
    LabelList,
    Legend,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from 'recharts'
import { Props as LegendProps } from 'recharts/types/component/Legend'
import { z } from 'zod'

import { groupBy } from '../../lib/array'
import { bp } from '../../lib/breakpoints'
import { colors } from '../../lib/colors'
import fetcher from '../../lib/fetcher'
import useMediaQuery from '../../lib/hooks/useMediaQuery'
import { mapWithIndex } from '../../lib/record'
import { ErrorComponent } from '../ErrorComponent'
import { FullWidthContainer } from '../FullWidthContainer'
import { Loading } from '../Loading'
import { H4 } from '../Typography/Headings'
import { renderLegend } from './Legend'
import { decToPercent } from '../../lib/number'

const countPerYearSchema = z.array(
    z.object({
        attorney_type: z.string(),
        year: z.number(),
        case_count: z.number(),
        has_evidence_of_representation: z.boolean(),
    })
)

export function BarChartYears() {
    const isLg = useMediaQuery('lg')

    const { data, error, isLoading } = useSWR(`/api/rep-by-years`, fetcher)

    if (error) {
        console.error('Error loading cosmos data: ', error)
        return <div>Error fetching data</div>
    }

    if (isLoading) {
        return <Loading />
    }

    const parsed = countPerYearSchema.safeParse(data)

    if (!parsed.success) {
        console.error(
            'Error parsing data: ',
            JSON.stringify(parsed.error.issues, null, 2)
        )

        return <ErrorComponent />
    }

    const groupedByYear = groupBy(parsed.data)((a) => a.year.toString())
    const totals = getTotals(groupedByYear)

    // Sum the number of cases
    const retained = parsed.data
        .filter((a) => a.attorney_type === 'Retained')
        .reduce((acc, curr) => acc + curr.case_count, 0)
    const appointed = parsed.data
        .filter((a) => a.attorney_type === 'Court Appointed')
        .reduce((acc, curr) => acc + curr.case_count, 0)

    return (
        <Wrapper>
            <Layout className="years-bar-chart">
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
        </Wrapper>
    )
}

interface BarChartIndividualProps {
    totals: TotalsByYear
    retained: number
    appointed: number
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
                <XAxis dataKey="year" tick={{ fontSize: 10 }}>
                    <Label value="Years" dy="800" position={'bottom'} />
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
                            value ? decToPercent(value) : ''
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
                            value ? decToPercent(value) : ''
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
                            value ? decToPercent(value) : ''
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
                            value ? decToPercent(value) : ''
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

/////////////////////
// Styled Components
/////////////////////

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

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
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
