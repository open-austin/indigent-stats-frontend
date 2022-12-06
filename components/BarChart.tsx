import React, { useEffect, useState, useRef } from 'react'
import useSWR from 'swr'
import * as d3 from 'd3'
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

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface BarChartProps {}

function BarGraph({}: BarChartProps) {
    const { data, error } = useSWR('/api/data', fetcher)
    const courtCases = !!data ? JSON.parse(data) : []
    const retained = {
      attorney: 'Retained',
      count: 0
    }
    const appointed = {
      attorney: 'Court Appointed',
      count: 0
    }

    console.log('results ', courtCases)

    courtCases.forEach((courtCase: ICharge) => {
      if (courtCase.attorney === 'Retained') {
        retained.count = retained.count + 1
      } else if (courtCase.attorney === 'Court Appointed') {
        appointed.count = appointed.count + 1
      }
    })

    const formattedResults = [retained, appointed]

    if (error) return <div>Failed to load</div>
    if (!data) return <div>Loading...</div>

    return (
        <ResponsiveContainer width="100%" height={500}>
            <BarChart data={formattedResults} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="attorney" />
                <YAxis dataKey="count" />
                <Tooltip />
                <Bar
                    maxBarSize={30}
                    key={'attorney'}
                    dataKey={'count'}
                    fill={'red'}
                />
            </BarChart>
        </ResponsiveContainer>
    )
}

export default BarGraph
