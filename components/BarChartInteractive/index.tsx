import React, { useState } from 'react'
import styled from 'styled-components'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    LabelList,
} from 'recharts'
import { Props as LegendProps } from 'recharts/types/component/Legend'
import { Case } from '../../models/Case'
import { colors } from '../../lib/colors'
import { bp } from '../../lib/breakpoints'
import Filters, { IFilters } from '../Filters'
import { Button } from '../Button'
import multifilter from '../../lib/multifilter'
import { renderLegend } from './Legend'

// TODO: This should be changed to 50 once we use the larger sample size
const MIN_SAMPLE_SIZE = 15

interface BarChartProps {
    data: Array<Case>
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

const ChartTitle = styled.h2`
    text-align: center;
`

const FiltersWrapper = styled.div`
    padding-bottom: 10rem;
`

function BarChartInteractive({ data }: BarChartProps) {
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
    const retainedData = denominatorFilter(data, filters, 'Retained')
    const appointedData = denominatorFilter(data, filters, 'Court Appointed')

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
    const notEnoughDataMessage =
        "Note: There's not enough data in this filter for a good sample size."
    const notEnoughData =
        formattedResults[0].notEnoughDataForSample ||
        formattedResults[1].notEnoughDataForSample

    // console.log('data ', data)
    // console.log('filters ', filters)
    // console.log('retained\n', retained)
    // console.log('appointed\n', appointed)
    // console.log('formattedResults\n', formattedResults)

    if (!data) return <div>Loading...</div>

    const domain = [0, 100]
    const ticks = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
    const toPercent = (decimal: number) => {
        return `${decimal.toFixed(2)}%`
    }

    return (
        <>
            <Layout>
                <FiltersWrapper>
                    <Filters
                        data={data}
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
                            <XAxis dataKey="attorney" padding={{ right: 20 }} />
                            <YAxis
                                dataKey={'percentEvidenceOfRepresentation'}
                                domain={domain}
                                ticks={ticks}
                                tickFormatter={(tick) => `${tick}%`}
                                fill={colors.blueNavy}
                            />
                            <Bar
                                maxBarSize={200}
                                key={'evidenceOfRepresentation'}
                                dataKey={'evidenceOfRepresentation'}
                                fill={colors.yellowLight}
                                stackId="representation"
                                name="Yes"
                            >
                                <LabelList
                                    fontSize={10}
                                    fill={colors.text}
                                    formatter={(value: number) =>
                                        value ? toPercent(value) : ''
                                    }
                                />
                            </Bar>
                            <Bar
                                maxBarSize={200}
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

export default BarChartInteractive
