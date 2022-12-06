import React, { useEffect, useState, useRef } from 'react'
import useSWR from 'swr'
import * as d3 from 'd3'
import {
    axisBottom,
    axisLeft,
    ScaleBand,
    scaleBand,
    ScaleLinear,
    scaleLinear,
    select,
} from 'd3'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface BarChartProps {
    data: any[];
}

interface AxisBottomProps {
    scale: ScaleBand<string>
    transform: string
}

interface AxisLeftProps {
    scale: ScaleLinear<number, number, never>
}

interface BarsProps {
    data: BarChartProps['data']
    height: number
    scaleX: AxisBottomProps['scale']
    scaleY: AxisLeftProps['scale']
}

function AxisBottom({ scale, transform }: AxisBottomProps) {
    const ref = useRef<SVGGElement>(null)

    useEffect(() => {
        if (ref.current) {
            select(ref.current).call(axisBottom(scale))
        }
    }, [scale])

    return <g ref={ref} transform={transform} />
}

function AxisLeft({ scale }: AxisLeftProps) {
    const ref = useRef<SVGGElement>(null)

    useEffect(() => {
        if (ref.current) {
            select(ref.current).call(axisLeft(scale))
        }
    }, [scale])

    return <g ref={ref} />
}

function Bars({ data, height, scaleX, scaleY }: BarsProps) {
    return (
        <>
            {data.map(({ attorney,  id }: { attorney: string, id: number }) => (
                <rect
                    key={`bar-${id}`}
                    x={scaleX(attorney)}
                    y={scaleY(1)}
                    width={scaleX.bandwidth()}
                    height={id - scaleY(id)}
                    fill="teal"
                />
            ))}
        </>
    )
}

function BarGraph({}: BarChartProps) {
    const { data, error } = useSWR('/api/data', fetcher)
    const results = !!data ? JSON.parse(data) : []

    if (error) return <div>Failed to load</div>
    if (!data) return <div>Loading...</div>

    const margin = { top: 10, right: 0, bottom: 20, left: 100 }
    const width = 800 - margin.left - margin.right
    const height = 400 - margin.top - margin.bottom

    const scaleX = scaleBand()
        .domain(results.map(({ attorney }: { attorney: string }) => attorney))
        .range([0, width])
        .padding(0.5)
    const scaleY = scaleLinear()
        .domain([0, results?.length || 1200])
        .range([height, 0])

    return (
        <svg
            width={width + margin.left + margin.right}
            height={height + margin.top + margin.bottom}
        >
            <g transform={`translate(${margin.left}, ${margin.top})`}>
                <AxisBottom
                    scale={scaleX}
                    transform={`translate(0, ${height})`}
                />
                <AxisLeft scale={scaleY} />
                <Bars
                    data={results}
                    height={height}
                    scaleX={scaleX}
                    scaleY={scaleY}
                />
            </g>
        </svg>
    )
}

export default BarGraph
