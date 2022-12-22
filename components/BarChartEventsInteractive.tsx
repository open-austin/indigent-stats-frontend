import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Label,
    Legend,
    LabelList,
    LabelListProps,
} from 'recharts'
import { Case } from '../models/Case'
import { colors } from '../lib/colors'
import Filter, { IFilters } from './Filter'
import multifilter from '../lib/multifilter'

interface BarChartProps {
    data: Array<Case>
}

type AttorneySummary = {
    attorney: 'Retained' | 'Court Appointed'
    totalCharges: Record<string, number>
    data: Array<Case>
    evidenceOfRepresentation: number
    noEvidenceOfRepresentation: number
    notEnoughDataForSample: boolean
}

const Filters = styled.form``

const Layout = styled.section`
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1 1;

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

function BarChartEventsInteractive({ data }: BarChartProps) {
    const [filters, setFilters] = useState<IFilters>({
        motions: 'All',
        charges: 'All',
        chargeCategories: 'All',
        chargeLevels: 'All',
    })

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
            ? arr.filter((d) => d.filters?.motions?.includes(filters.motions))
            : arr.filter((d) => !!d.filters?.motions?.length)
    }

    const getPercentage = (numerator: number, denominator: number) => {
        if (denominator) {
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

    console.log('retained filter', numOfCasesInFilterRetained)

    const retained: AttorneySummary = {
        attorney: 'Retained',
        totalCharges: {},
        data: retainedData,
        evidenceOfRepresentation: percentEvidenceOfRepRetained,
        noEvidenceOfRepresentation: 100 - percentEvidenceOfRepRetained,
        notEnoughDataForSample: numOfCasesInFilterRetained.length < 50,
    }
    const appointed: AttorneySummary = {
        attorney: 'Court Appointed',
        totalCharges: {},
        data: appointedData,
        evidenceOfRepresentation: percentEvidenceOfRepAppointed,
        noEvidenceOfRepresentation: 100 - percentEvidenceOfRepAppointed,
        notEnoughDataForSample: numOfCasesInFilterAppointed.length < 50,
    }

    const formattedResults = [retained, appointed]

    const notEnoughDataMessage =
        "Note: There's not enough data in this filter for a good sample size."
    const [showNotEnoughDataMessage, setShowNotEnoughDataMessage] =
        useState(false)

    useEffect(() => {
        if (
            retained.notEnoughDataForSample ||
            appointed.notEnoughDataForSample
        ) {
            setShowNotEnoughDataMessage(true)
        } else if (showNotEnoughDataMessage) {
            setShowNotEnoughDataMessage(false)
        }
    }, [
        retained.notEnoughDataForSample,
        appointed.notEnoughDataForSample,
        showNotEnoughDataMessage,
    ])

    // console.log('data ', data)
    // console.log('filters ', filters)
    // console.log('retained\n', retained)
    // console.log('appointed\n', appointed)
    // console.log('formattedResults\n', formattedResults)

    if (!data) return <div>Loading...</div>

    const domain = [0, 100]
    const ticks = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
    const toPercent = (decimal: number) => {
        return `${Math.round(decimal).toFixed(2)}%`
    }

    return (
        <>
            <div>
                <small>
                    {showNotEnoughDataMessage ? notEnoughDataMessage : 'jkjkl'}
                </small>
            </div>
            <Layout>
                <Filters>
                    <Filter
                        filterField={'motions'}
                        filters={filters}
                        setFilters={setFilters}
                        data={data}
                    />
                    <Filter
                        filterField={'charges'}
                        filters={filters}
                        setFilters={setFilters}
                        data={data}
                    />
                    <Filter
                        filterField={'chargeCategories'}
                        filters={filters}
                        setFilters={setFilters}
                        data={data}
                    />
                    <Filter
                        filterField={'chargeLevels'}
                        filters={filters}
                        setFilters={setFilters}
                        data={data}
                    />
                </Filters>
                <ChartWrapper>
                    <ResponsiveContainer width={'100%'} height={600}>
                        <BarChart data={formattedResults} layout="horizontal">
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="attorney" />
                            <YAxis
                                dataKey={'percentEvidenceOfRepresentation'}
                                domain={domain}
                                ticks={ticks}
                                tickCount={10}
                                tickFormatter={(tick) => `${tick}%`}
                            />
                            <Legend />
                            <Bar
                                maxBarSize={200}
                                key={'evidenceOfRepresentation'}
                                dataKey={'evidenceOfRepresentation'}
                                fill={colors.yellow}
                                stackId="a"
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
                                stackId="a"
                            >
                                <LabelList
                                    fontSize={10}
                                    fill={colors.white}
                                    formatter={(value: number) => toPercent(value)}
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartWrapper>
            </Layout>
        </>
    )
}

export default BarChartEventsInteractive
