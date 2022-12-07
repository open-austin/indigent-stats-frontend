import React from 'react'
import { ICharge } from '../models/Charge'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts'

interface BarChartProps {
  data: any
}

function BarGraph({ data }: BarChartProps) {
    const courtCases = !!data ? JSON.parse(data) : []
    const retained = {
      attorney: 'Retained',
      count: 0
    }
    const appointed = {
      attorney: 'Court Appointed',
      count: 0
    }

    courtCases.forEach((courtCase: ICharge) => {
      if (courtCase.attorney === 'Retained') {
        retained.count = retained.count + 1
      } else if (courtCase.attorney === 'Court Appointed') {
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
