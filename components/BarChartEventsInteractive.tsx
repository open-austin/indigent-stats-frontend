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
} from 'recharts'
import { Case } from '../models/Case'
import Filter, { IFilters } from './Filter'

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

    const retainedData = data.filter((d) => d.attorney_type === 'Retained')
    const appointedData = data.filter(
        (d) => d.attorney_type === 'Court Appointed'
    )

    // TODO: Create a reusable filter function
    // Clean up these transforms and how we're splitting up retained/appointed data. Could be simpler.
    const retainedTotalCasesWithMotion =
        filters.motions !== 'All'
            ? retainedData.filter((d) =>
                  d.filters?.motions?.includes(filters.motions)
              ).length
            : retainedData.reduce(
                  (a, b) =>
                      a +
                      (b.filters?.motions?.length &&
                      b.filters?.motions?.length >= 1
                          ? 1
                          : 0),
                  0
              )
    const appointedTotalCasesWithMotion =
        filters.motions !== 'All'
            ? appointedData.filter((d) =>
                  d.filters?.motions?.includes(filters.motions)
              ).length
            : appointedData.reduce(
                  (a, b) =>
                      a +
                      (b.filters?.motions?.length &&
                      b.filters?.motions?.length >= 1
                          ? 1
                          : 0),
                  0
              )
    const retained: AttorneySummary = {
        attorney: 'Retained',
        totalCharges: {},
        data: retainedData,
        numOfCasesInFilter: retainedTotalCasesWithMotion,
        numOfCasesNotInFilter:
            retainedData.length - retainedTotalCasesWithMotion,
    }
    const appointed: AttorneySummary = {
        attorney: 'Court Appointed',
        totalCharges: {},
        data: appointedData,
        numOfCasesInFilter: appointedTotalCasesWithMotion,
        numOfCasesNotInFilter:
            appointedData.length - appointedTotalCasesWithMotion,
    }

    const formattedResults = [retained, appointed]

    console.log('data ', data)
    console.log('filters ', filters)
    console.log('retained\n', retained)
    console.log('appointed\n', appointed)
    console.log('formattedResults\n', formattedResults)

    if (!data) return <div>Loading...</div>

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
                            fill={'lightblue'}
                            stackId="a"
                        />
                        <Bar
                            maxBarSize={200}
                            key={'numOfCasesInFilter'}
                            dataKey={'numOfCasesInFilter'}
                            fill={'#70A37F'}
                            stackId="a"
                        >
                            <Label fill="#fff" value="percentage" />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </ChartWrapper>
        </Layout>
    )
}

export default BarChartEventsInteractive
