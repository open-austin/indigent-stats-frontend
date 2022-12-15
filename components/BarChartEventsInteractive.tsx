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
    numOfCasesInFilter: number
    numOfCasesNotInFilter: number
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

    // TODO: Create a reusable function for retained/appointed so we're not duplicating all this logic
    const retainedData = data.filter((d) => d.attorney_type === 'Retained')
    const appointedData = data.filter(
        (d) => d.attorney_type === 'Court Appointed'
    )

    const numOfCasesInFilterRetained = multifilter(retainedData, filters)
    const numOfCasesInFilterAppointed = multifilter(appointedData, filters)

    const retained: AttorneySummary = {
        attorney: 'Retained',
        totalCharges: {},
        data: retainedData,
        numOfCasesInFilter: numOfCasesInFilterRetained,
        numOfCasesNotInFilter: retainedData.length - numOfCasesInFilterRetained,
    }
    const appointed: AttorneySummary = {
        attorney: 'Court Appointed',
        totalCharges: {},
        data: appointedData,
        numOfCasesInFilter: numOfCasesInFilterAppointed,
        numOfCasesNotInFilter:
            appointedData.length - numOfCasesInFilterAppointed,
    }

    const formattedResults = [retained, appointed]

    console.log('data ', data)
    console.log('filters ', filters)
    console.log('retained\n', retained)
    console.log('appointed\n', appointed)
    console.log('formattedResults\n', formattedResults)

    if (!data) return <div>Loading...</div>

    const renderCustomPercentage = (props: any) => {
        console.log('props ', props)
        const percentage =
            (props['numOfCasesInFilter'] / props['data'].length) * 100
        if (typeof percentage !== 'number' || isNaN(percentage) || percentage === 0) {
            return null
        }

        return `${percentage.toFixed(1)}%`
    }

    return (
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
                <ResponsiveContainer width={'100%'} height={500}>
                    <BarChart data={formattedResults} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="attorney" />
                        <YAxis dataKey="data.length" />
                        <Tooltip />
                        <Legend />
                        <Bar
                            maxBarSize={200}
                            key={'numOfCasesNotInFilter'}
                            dataKey={'numOfCasesNotInFilter'}
                            fill={colors.blueNavy}
                            stackId="a"
                        />
                        <Bar
                            maxBarSize={200}
                            key={'numOfCasesInFilter'}
                            dataKey={'numOfCasesInFilter'}
                            fill={colors.yellow}
                            stackId="a"
                        >
                            <LabelList
                                fontSize={10}
                                fill={colors.text}
                                valueAccessor={(
                                    props: LabelListProps<'valueAccessor'>
                                ) => renderCustomPercentage(props)}
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </ChartWrapper>
        </Layout>
    )
}

export default BarChartEventsInteractive
