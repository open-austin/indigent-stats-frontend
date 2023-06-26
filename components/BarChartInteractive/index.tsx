import React, { useState } from 'react'
import styled from 'styled-components'
import useSWR from 'swr'
import { z } from 'zod'
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
import { Props as LegendProps } from 'recharts/types/component/Legend'
import { Case, caseSchema } from '../../models/Case'
import { colors } from '../../lib/colors'
import { bp } from '../../lib/breakpoints'
import Filters, { IFilters } from '../Filters'
import { Button } from '../Button'
import multifilter from '../../lib/multifilter'
import { renderLegend } from './Legend'
import { H4 } from '../Typography/Headings'
import useMediaQuery from '../../lib/hooks/useMediaQuery'
import fetcher from '../../lib/fetcher'
import { ErrorComponent } from '../ErrorComponent'
import { Loading } from '../Loading'

// TODO: This should be changed to 50 once we use the larger sample size
const MIN_SAMPLE_SIZE = 15

const toPercent = (decimal: number) => {
    return `${decimal.toFixed(2)}%`
}

export type AttorneySummary = {
    attorney: 'Retained' | 'Court Appointed'
    totalCharges: Record<string, number>
    data: Array<Case>
    evidenceOfRepresentation: number
    noEvidenceOfRepresentation: number
    notEnoughDataForSample: boolean
}

const Layout = styled.section`
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1 1;
    min-width: 100%;

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
    flex: 0 1;
    @media ${bp.lg} {
        flex: 1;
        margin-top: 0;
    }
`

const ChartTitle = styled(H4)`
    text-align: center;
`

const FiltersWrapper = styled.div`
    padding-bottom: 2rem;

    @media ${bp.lg} {
        padding-bottom: 10rem;
        width: 25%;
    }
`

export default function BarChartInteractive() {
    const isMd = useMediaQuery('md')
    const barSize = isMd ? undefined : 50
    const defaultFilters = {
        motions: 'All',
        charges: 'All',
        chargeCategories: 'All',
        chargeLevels: 'All',
    } as IFilters
    const [filters, setFilters] = useState<IFilters>(defaultFilters)
    const resetFilters = () => {
        setFilters(defaultFilters)
    }

    const { data, error, isLoading } = useSWR(`/api/get-all-cases`, fetcher)

    if (error) {
        console.error('Error loading cosmos data: ', error)
        return <div>Error fetching</div>
    }

    const parsed = z.array(caseSchema).safeParse(data)

    if (isLoading) return <Loading />

    if (!parsed.success) {
        console.error(
            'Error parsing data: ',
            JSON.stringify(parsed.error.issues, null, 2)
        )

        return <ErrorComponent />
    }

    const denominatorFilter = (
        arr: Array<Case>,
        filters: IFilters,
        attorneyType: 'Retained' | 'Court Appointed'
    ) => {
        const groupedData = arr.filter((d) => d.attorney_type === attorneyType)
        return multifilter(groupedData, filters)
    }

    const numeratorFilter = (arr: Array<Case>, filters: IFilters) => {
        return filters.motions !== 'All'
            ? arr?.filter((d) => d.filters?.motions?.includes(filters.motions))
            : arr?.filter((d) => !!d.filters?.motions?.length)
    }

    const getPercentage = (numerator: number, denominator: number) => {
        if (denominator !== 0) {
            return (numerator / denominator) * 100
        }

        return 0
    }

    // TODO: Create a reusable function for retained/appointed so we're not duplicating all this logic
    const retainedData = denominatorFilter(parsed.data, filters, 'Retained')
    const appointedData = denominatorFilter(
        parsed.data,
        filters,
        'Court Appointed'
    )

    const numOfCasesInFilterRetained = numeratorFilter(retainedData, filters)
    const numOfCasesInFilterAppointed = numeratorFilter(appointedData, filters)

    const percentEvidenceOfRepRetained = getPercentage(
        numOfCasesInFilterRetained.length,
        retainedData.length
    )
    const percentEvidenceOfRepAppointed = getPercentage(
        numOfCasesInFilterAppointed.length,
        appointedData.length
    )

    const retained: AttorneySummary = {
        attorney: 'Retained',
        totalCharges: {},
        data: retainedData,
        evidenceOfRepresentation: percentEvidenceOfRepRetained,
        noEvidenceOfRepresentation: 100 - percentEvidenceOfRepRetained,
        notEnoughDataForSample: retainedData.length < MIN_SAMPLE_SIZE,
    }
    const appointed: AttorneySummary = {
        attorney: 'Court Appointed',
        totalCharges: {},
        data: appointedData,
        evidenceOfRepresentation: percentEvidenceOfRepAppointed,
        noEvidenceOfRepresentation: 100 - percentEvidenceOfRepAppointed,
        notEnoughDataForSample: appointedData.length < MIN_SAMPLE_SIZE,
    }

    const formattedResults = [retained, appointed]
    const notEnoughData =
        formattedResults[0].notEnoughDataForSample ||
        formattedResults[1].notEnoughDataForSample

    // console.log('data ', data)
    // console.log('filters ', filters)
    // console.log('retained\n', retained)
    // console.log('appointed\n', appointed)
    // console.log('formattedResults\n', formattedResults)

    const domain = [0, 100]
    const ticks = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]

    // TODO: Issues with using LabelListProps from recharts
    const renderCustomizedLabel = (props: any) => {
        const { x, y, width, height, value } = props
        const radius = isMd ? 20 : 16
        const xCoord = x + width + (isMd ? width / 6 : width / 2)
        const yCoord = y - radius * 1.05

        return (
            <g>
                <line
                    strokeWidth={1}
                    stroke={`${colors.text}DD`}
                    x1={xCoord}
                    x2={xCoord - 25}
                    y1={yCoord}
                    y2={yCoord * 1.05}
                ></line>
                <circle
                    cx={xCoord}
                    cy={yCoord}
                    r={radius}
                    fill={colors.yellowLight}
                    stroke={colors.text}
                />
                <text
                    x={xCoord}
                    y={yCoord}
                    fill={colors.text}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={isMd ? 11 : 8}
                >
                    {toPercent(value)}
                </text>
            </g>
        )
    }

    return (
        <>
            <Layout>
                <FiltersWrapper>
                    <Filters
                        data={parsed.data}
                        filters={filters}
                        setFilters={setFilters}
                    >
                        <Button onClick={resetFilters} type="button">
                            Reset filters
                        </Button>
                    </Filters>
                </FiltersWrapper>
                <ChartWrapper>
                    <ChartTitle>Evidence of Representation</ChartTitle>
                    <ResponsiveContainer
                        width={'100%'}
                        minHeight={700}
                        debounce={10}
                    >
                        <BarChart data={formattedResults} layout="horizontal">
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="attorney" dy={5} />
                            <YAxis
                                dataKey={'percentEvidenceOfRepresentation'}
                                domain={domain}
                                ticks={ticks}
                                tickFormatter={(tick) => `${tick}%`}
                                fill={colors.blueNavy}
                            />
                            <Bar
                                maxBarSize={150}
                                barSize={barSize}
                                key={'evidenceOfRepresentation'}
                                dataKey={'evidenceOfRepresentation'}
                                fill={colors.yellowLight}
                                stackId="representation"
                                name="Yes"
                            >
                                <LabelList
                                    dataKey={'evidenceOfRepresentation'}
                                    content={renderCustomizedLabel}
                                />
                            </Bar>
                            <Bar
                                maxBarSize={150}
                                barSize={barSize}
                                key={'noEvidenceOfRepresentation'}
                                dataKey={'noEvidenceOfRepresentation'}
                                fill={colors.blueNavy}
                                stackId="representation"
                                name="No"
                            ></Bar>
                            <Legend
                                // @ts-ignore: Not a relevant props error
                                content={(props: LegendProps) =>
                                    renderLegend(
                                        props,
                                        notEnoughData,
                                        formattedResults,
                                        'Evidence of representation'
                                    )
                                }
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartWrapper>
            </Layout>
        </>
    )
}
