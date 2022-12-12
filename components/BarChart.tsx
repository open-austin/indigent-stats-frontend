import React from 'react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts'
import { Case } from '../models/Case'

interface BarChartProps {
    data: Array<Case>
}

function BarGraph({ data }: BarChartProps) {
    const retained = {
        attorney: 'Retained',
        count: 0,
    }
    const appointed = {
        attorney: 'Court Appointed',
        count: 0,
    }

    data.forEach((courtCase) => {
        if (courtCase.attorney_type === 'Retained') {
            retained.count = retained.count + 1
        } else if (courtCase.attorney_type === 'Court Appointed') {
            appointed.count = appointed.count + 1
        }
    })

    const formattedResults = [retained, appointed]

    if (!data) return <div>Loading...</div>

    return (
        <ResponsiveContainer width="100%" height={500}>
            <BarChart data={formattedResults} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="attorney" />
                <YAxis dataKey="count" />
                <Tooltip />
                <Bar
                    maxBarSize={200}
                    key={'attorney'}
                    dataKey={'count'}
                    fill={'#70A37F'}
                />
            </BarChart>
        </ResponsiveContainer>
    )
}

export default BarGraph
