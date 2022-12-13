import React from 'react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Label,
} from 'recharts'
import { Case } from '../models/Case'

interface FilterableBarChartProps {
    data: Array<Case>
    filters: {
        motion: string,
        charge: string,
        chargeCategory: string,
        chargeLevel: string,
    }
}

type AttorneySummary = {
    attorney: 'Retained' | 'Court Appointed'
    totalCharges: Record<string, number>
    data: Array<Case>
    numOfCasesInFilter: number
    numOfCasesNotInFilter: number
}

function BarChartEventsInteractive({
    data,
    filters,
}: FilterableBarChartProps) {
    const retainedData = data.filter((d) => d.attorney_type === 'Retained')
    const appointedData = data.filter(
        (d) => d.attorney_type === 'Court Appointed'
    )

    // TODO: Create a reusable filter function
    // Clean up these transforms and how we're splitting up retained/appointed data. Could be simpler.
    const retainedTotalCasesWithMotion =
        filters.motion !== 'All'
            ? retainedData.filter((d) =>
                  d.filters?.motions?.includes(filters.motion)
              ).length
            : retainedData.reduce(
                  (a, b) =>
                      a +
                      (b.filters?.motions?.length &&
                      b.filters?.motions?.length > 1
                          ? 1
                          : 0),
                  0
              )
    const appointedTotalCasesWithMotion =
        filters.motion !== 'All'
            ? appointedData.filter((d) =>
                  d.filters?.motions?.includes(filters.motion)
              ).length
            : appointedData.reduce(
                  (a, b) =>
                      a +
                      (b.filters?.motions?.length &&
                      b.filters?.motions?.length > 1
                          ? 1
                          : 0),
                  0
              )
    const retained: AttorneySummary = {
        attorney: 'Retained',
        totalCharges: {},
        data: retainedData,
        numOfCasesInFilter: retainedTotalCasesWithMotion,
        numOfCasesNotInFilter: retainedData.length - retainedTotalCasesWithMotion
    }
    const appointed: AttorneySummary = {
        attorney: 'Court Appointed',
        totalCharges: {},
        data: appointedData,
        numOfCasesInFilter: appointedTotalCasesWithMotion,
        numOfCasesNotInFilter: appointedData.length - appointedTotalCasesWithMotion
    }

    const formattedResults = [retained, appointed]

    console.log('data ', data)
    console.log('retained\n', retained)
    console.log('appointed\n', appointed)
    console.log('formattedResults\n', formattedResults)

    if (!data) return <div>Loading...</div>

    return (
        <ResponsiveContainer width="100%" height={500}>
            <BarChart data={formattedResults} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="attorney" />
                <YAxis dataKey="data.length" />
                <Tooltip />
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
    )
}

export default BarChartEventsInteractive
