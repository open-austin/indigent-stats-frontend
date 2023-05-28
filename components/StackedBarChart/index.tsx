import React from 'react'
import useSWR from 'swr'
import { z } from 'zod'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    ResponsiveContainer,
    Legend,
    LabelList,
    LabelListProps,
} from 'recharts'
import styled from 'styled-components'
import { Props as LegendProps } from 'recharts/types/component/Legend'
import { stackedGraphColors } from '../../lib/colors'
import { flattenObject } from '../../lib/flatten'
import { renderLegend } from './Legend'
import { H4 } from '../Typography/Headings'
import fetcher from '../../lib/fetcher'
import { Loading } from '../Loading'
import { ErrorComponent } from '../ErrorComponent'
import { toPercent } from '../../lib/number'
import { groupBy } from '../../lib/array'

type AttorneySummary = {
    attorney: 'Retained' | 'Court Appointed'
    caseCount: number
    totalCharges: Record<string, number>
    percentageCharges: Record<string, number>
}

const ChartTitle = styled(H4)`
    text-align: center;
`

const schema = z.array(
    z.object({
        charge_category: z.string(),
        attorney_type: z.string(),
        count: z.number(),
    })
)

export default function StackedBarChart() {
    const { data, error, isLoading } = useSWR(
        `/api/counsel-per-charge`,
        fetcher
    )

    if (error) {
        console.error('Error loading cosmos data: ', error)
        return <div>Error fetching</div>
    }

    const parsed = schema.safeParse(data)

    if (isLoading) return <Loading />

    if (!parsed.success) {
        console.log(parsed.error.format())

        return <ErrorComponent />
    }

    const retained: AttorneySummary = {
        attorney: 'Retained',
        caseCount: 0,
        totalCharges: {},
        percentageCharges: {},
    }
    const appointed: AttorneySummary = {
        attorney: 'Court Appointed',
        caseCount: 0,
        totalCharges: {},
        percentageCharges: {},
    }

    const grouped = groupBy(parsed.data)((a) => a.attorney_type)

    grouped['Retained'].forEach((r) => {
        retained.caseCount += r.count
        retained['totalCharges'][r.charge_category] = r.count
    })

    grouped['Court Appointed'].forEach((r) => {
        appointed.caseCount += r.count
        appointed['totalCharges'][r.charge_category] = r.count
    })

    Object.keys(retained.totalCharges).forEach((charge) => {
        retained.percentageCharges[charge] = toPercent(
            retained.totalCharges[charge],
            retained.caseCount
        )
    })

    Object.keys(appointed.totalCharges).forEach((charge) => {
        appointed.percentageCharges[charge] = toPercent(
            appointed.totalCharges[charge],
            appointed.caseCount
        )
    })

    const chargeCategories = Array.from(
        new Set<string>(parsed.data.map((a) => a.charge_category))
    )

    const renderCustomPercentage = (props: any, charge: string) => {
        const percentage = props[charge]
        if (typeof percentage !== 'number' || isNaN(percentage)) {
            return null
        }

        return `${percentage.toFixed(2)}%`
    }

    const domain = [0, 100]
    const ticks = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
    const sums = {
        retained: retained.caseCount,
        appointed: appointed.caseCount,
    }

    return (
        <>
            <ChartTitle>Charge Categories / Attorney Type</ChartTitle>
            <ResponsiveContainer
                width="100%"
                height="100%"
                minHeight={200}
                className="stacked-bar-chart stacked-bar-chart-top"
            >
                <BarChart data={[flattenObject(retained)]} layout="vertical">
                    <XAxis
                        type="number"
                        domain={domain}
                        ticks={ticks}
                        tickFormatter={(tick) => `${tick}%`}
                        hide
                    />
                    <YAxis
                        dataKey="attorney"
                        type="category"
                        label={{
                            value: 'Retained',
                            angle: -90,
                        }}
                        axisLine={false}
                        tickLine={false}
                    />
                    {chargeCategories.map((charge, index) => {
                        return (
                            <Bar
                                maxBarSize={100}
                                key={`${charge}-${index}`}
                                dataKey={charge}
                                fill={
                                    stackedGraphColors[
                                        index %
                                            Object.keys(chargeCategories).length
                                    ]
                                }
                                stackId="a"
                                name={charge}
                            >
                                <LabelList
                                    key={`${charge}-${index}-labellist`}
                                    fontSize={10}
                                    fill={'#fff'}
                                    valueAccessor={(
                                        // @ts-ignore: ignore type error
                                        props: LabelListProps<'valueAccessor'>
                                    ) => renderCustomPercentage(props, charge)}
                                />
                            </Bar>
                        )
                    })}
                </BarChart>
            </ResponsiveContainer>
            <ResponsiveContainer
                width="100%"
                height="100%"
                minHeight={300}
                className={'stacked-bar-chart stacked-bar-chart-bottom'}
            >
                <BarChart data={[flattenObject(appointed)]} layout="vertical">
                    <XAxis
                        type="number"
                        domain={domain}
                        ticks={ticks}
                        tickFormatter={(tick) => `${tick}%`}
                        hide
                    />
                    <YAxis
                        dataKey="attorney"
                        type="category"
                        label={{
                            value: 'Court appointed',
                            angle: -90,
                        }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Legend
                        // @ts-ignore: Not a relevant props error
                        content={(props: LegendProps) =>
                            renderLegend(props, 'Primary charge category', sums)
                        }
                    />
                    {chargeCategories.map((charge, index) => {
                        return (
                            <Bar
                                maxBarSize={100}
                                key={`${charge}-${index}`}
                                dataKey={charge}
                                fill={
                                    stackedGraphColors[
                                        index %
                                            Object.keys(chargeCategories).length
                                    ]
                                }
                                stackId="a"
                                name={charge}
                            >
                                <LabelList
                                    key={`${charge}-${index}-labellist`}
                                    fontSize={10}
                                    fill={'#fff'}
                                    valueAccessor={(
                                        // @ts-ignore: ignore type error
                                        props: LabelListProps<'valueAccessor'>
                                    ) => renderCustomPercentage(props, charge)}
                                />
                            </Bar>
                        )
                    })}
                </BarChart>
            </ResponsiveContainer>
        </>
    )
}
