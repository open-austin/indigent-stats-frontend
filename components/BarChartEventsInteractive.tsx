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
    filteredNumberItems: number
}

function BarChartEventsInteractive({
    data,
    filters,
}: FilterableBarChartProps) {
    const retainedData = data.filter((d) => d.attorney_type === 'Retained')
    const appointedData = data.filter(
        (d) => d.attorney_type === 'Court Appointed'
    )

    // TODO: Clean up these transforms and how we're splitting up retained/appointed data. Could be simpler.
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
        filteredNumberItems: retainedTotalCasesWithMotion
    }
    const appointed: AttorneySummary = {
        attorney: 'Court Appointed',
        totalCharges: {},
        data: appointedData,
        filteredNumberItems: appointedTotalCasesWithMotion
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
                    key={'length'}
                    dataKey={'data.length'}
                    fill={'lightblue'}
                    stackId="a"
                />
                <Bar
                    maxBarSize={200}
                    key={'filteredNumberItems'}
                    dataKey={'filteredNumberItems'}
                    fill={'#70A37F'}
                    stackId="b"
                >
                    <Label fill="#fff" value="percentage" />
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    )
}

export default BarChartEventsInteractive
