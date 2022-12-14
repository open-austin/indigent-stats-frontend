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
    LabelListProps,
} from 'recharts'
import { stackedGraphColors } from '../lib/colors'
import { upsertAtMap } from '../lib/record'
import { flattenObject } from '../lib/flatten'
import { Case } from '../models/Case'

type AttorneySummary = {
    attorney: 'Retained' | 'Court Appointed'
    caseCount: number
    totalCharges: Record<string, number>
}

interface StackedBarChartProps {
    cases: Array<Case>
}

function StackedBarChart({ cases }: StackedBarChartProps) {
    const retained: AttorneySummary = {
        attorney: 'Retained',
        caseCount: 0,
        totalCharges: {},
    }
    const appointed: AttorneySummary = {
        attorney: 'Court Appointed',
        caseCount: 0,
        totalCharges: {},
    }

    // TODO -- what's the shape of retained.primaryCharges?
    // note: the type of the key is really a number
    let pcSet = new Set<string>()

    // console.log('num of cases\n', cases.length)

    cases.forEach((c) => {
        pcSet.add(c.charges[0].offense_type_desc)
        const primaryCharge =
            c.charges.find((charge) => charge.is_primary_charge) || c.charges[0]

        // This should work since all of the "charges" within a given case were
        // all scraped from the same record -- although in practice I'm not sure
        // whether an attorney represents *all* charges for a given client..
        // or is that ridiculous? Surely they represent them for all charges...
        if (c.attorney_type === 'Retained') {
            retained.caseCount += 1

            if (primaryCharge) {
                retained.totalCharges = upsertAtMap(
                    retained.totalCharges,
                    primaryCharge.offense_type_desc,
                    (a) => a + 1,
                    1
                )
            }
        }

        if (c.attorney_type === 'Court Appointed') {
            appointed.caseCount += 1

            if (primaryCharge) {
                appointed.totalCharges = upsertAtMap(
                    appointed.totalCharges,
                    primaryCharge.offense_type_desc,
                    (a) => a + 1,
                    1
                )
            }
        }
    })

    const formattedResults = [flattenObject(retained), flattenObject(appointed)]

    const primaryCharges = Array.from(pcSet)

    // console.log('primaryCharges\n', primaryCharges)
    // console.log('retained\n', retained)
    // console.log('appointed\n', appointed)
    // console.log('formattedResults\n', formattedResults)

    if (!cases) return <div>Loading...</div>

    const renderCustomPercentage = (props: any, charge: string) => {
        const percentage = (props[charge] / props.caseCount) * 100
        if (typeof percentage !== 'number' || isNaN(percentage)) {
            return null
        }

        return `${percentage.toFixed(1)}%`
    }

    return (
        <ResponsiveContainer width="100%" height={500}>
            <BarChart data={formattedResults} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="attorney" />
                <YAxis />
                <Tooltip
                    labelStyle={{ fontSize: 11, fontWeight: 'bold' }}
                    contentStyle={{ fontSize: 11 }}
                    offset={50}
                    itemSorter={(item) => {
                        return item.name as string
                    }}
                />
                <br></br>
                <Legend />
                {primaryCharges
                    .sort()
                    .reverse()
                    .map((charge, index) => {
                        return (
                            <Bar
                                maxBarSize={200}
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
                                        props: LabelListProps<'valueAccessor'>
                                    ) => renderCustomPercentage(props, charge)}
                                />
                            </Bar>
                        )
                    })}
            </BarChart>
        </ResponsiveContainer>
    )
}

export default StackedBarChart
