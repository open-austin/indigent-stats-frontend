import React from 'react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    LabelList,
    Label,
    LabelListProps,
    CartesianAxisProps,
    Text,
} from 'recharts'
import styled from 'styled-components'
import { BaseAxisProps } from 'recharts/types/util/types'
import { stackedGraphColors } from '../lib/colors'
import { upsertAtMap } from '../lib/record'
import { flattenObject } from '../lib/flatten'
import { Case } from '../models/Case'

type AttorneySummary = {
    attorney: 'Retained' | 'Court Appointed'
    caseCount: number
    totalCharges: Record<string, number>
    percentageCharges: Record<string, number>
}

interface StackedBarChartProps {
    cases: Array<Case>
}

const Heading = styled.h2`
    text-align: center;
`

function StackedBarChart({ cases }: StackedBarChartProps) {
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

    // TODO -- what's the shape of retained.primaryCharges?
    // note: the type of the key is really a number
    let pcSet = new Set<string>()

    // console.log('num of cases\n', cases.length)

    cases.forEach((c) => {
        if (!c.charge_category?.length) {
            return
        }
        pcSet.add(c.charge_category[0])

        // This should work since all of the "charges" within a given case were
        // all scraped from the same record -- although in practice I'm not sure
        // whether an attorney represents *all* charges for a given client..
        // or is that ridiculous? Surely they represent them for all charges...
        if (c.attorney_type === 'Retained') {
            retained.caseCount += 1

            retained.totalCharges = upsertAtMap(
                retained.totalCharges,
                c.charge_category[0],
                (a) => a + 1,
                1
            )
        }

        if (c.attorney_type === 'Court Appointed') {
            appointed.caseCount += 1

            appointed.totalCharges = upsertAtMap(
                appointed.totalCharges,
                c.charge_category[0],
                (a) => a + 1,
                1
            )
        }
    })

    const toPercent = (num: number, denom: number) => {
        return (num / denom) * 100
    }
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

    const formattedResults = [flattenObject(retained), flattenObject(appointed)]

    const primaryCharges = Array.from(pcSet)

    const appointedPrimaryCharges = Object.keys(appointed.percentageCharges)
        .sort()
        .reduce((obj, key) => {
            obj[key] = appointed.percentageCharges[key]
            return obj
        }, {})

    // console.log('primaryCharges\n', primaryCharges)
    // console.log('retained\n', retained)
    // console.log('appointed\n', appointed)
    console.log('formattedResults\n', formattedResults)

    if (!cases) return <div>Loading...</div>

    const renderCustomPercentage = (props: any, charge: string) => {
        const percentage = props[charge]
        if (typeof percentage !== 'number' || isNaN(percentage)) {
            return null
        }

        return `${percentage.toFixed(2)}%`
    }

    const domain = [0, 100]
    const ticks = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]

    return (
        <>
            <Heading>
                Cases per Attorney Type Grouped by Charge Category
            </Heading>
            <ResponsiveContainer
                width="100%"
                height={250}
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
                    {primaryCharges.map((charge, index) => {
                        return (
                            <Bar
                                maxBarSize={250}
                                key={`${charge}-${index}`}
                                dataKey={charge}
                                fill={
                                    stackedGraphColors[
                                        index %
                                            Object.keys(primaryCharges).length
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
                height={250}
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
                    <Text angle={90}>ello</Text>
                    <Label
                        value="Pages of my website"
                        offset={0}
                        position="insideBottom"
                    />
                    <Legend
                        iconSize={24}
                        iconType={'circle'}
                        chartHeight={400}
                    />
                    {primaryCharges.map((charge, index) => {
                        return (
                            <Bar
                                maxBarSize={250}
                                key={`${charge}-${index}`}
                                dataKey={charge}
                                fill={
                                    stackedGraphColors[
                                        index %
                                            Object.keys(primaryCharges).length
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

export default StackedBarChart
