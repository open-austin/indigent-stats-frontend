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
    Legend,
} from 'recharts'
import { CasesGroupedByCaseId } from '../models/schemas'
import { upsertAt, upsertAtMap } from '../lib/record'
import { flattenObject } from '../lib/flatten'

type AttorneySummary = {
    attorney: 'Retained' | 'Court Appointed'
    count: number
    charges: Record<string, number>
}

interface StackedBarChartProps {
    data: CasesGroupedByCaseId
}

function StackedBarChart({ data }: StackedBarChartProps) {
    const retained: AttorneySummary = {
        attorney: 'Retained',
        count: 0,
        charges: {},
    }
    const appointed: AttorneySummary = {
        attorney: 'Court Appointed',
        count: 0,
        charges: {},
    }

    // TODO -- what's the shape of retained.primaryCharges?
    let primaryCharges: Record<string, string> = {}

    for (let case_ in data) {
        data[case_].forEach((c) => {
            if (c.is_primary_charge && !primaryCharges[c.offense_type_code]) {
                primaryCharges[c.offense_type_code] = c.offense_type_desc
            }

            if (c.attorney === 'Retained') {
                retained.count += 1

                retained.charges = upsertAtMap(
                    retained.charges,
                    c.offense_type_desc,
                    (a) => a + 1,
                    1
                )
            }

            if (c.attorney === 'Court Appointed') {
                appointed.count += 1

                appointed.charges = upsertAtMap(
                    appointed.charges,
                    c.offense_type_desc,
                    (a) => a + 1,
                    1
                )
            }
        })
    }

    const formattedResults = [flattenObject(retained), flattenObject(appointed)]

    console.log('primaryCharges\n', primaryCharges)
    console.log('retained\n', retained)
    console.log('appointed\n', appointed)
    console.log('formattedResults\n', formattedResults)

    const colors = [
        '#79b473ff',
        '#414073ff',
        '#4c3957ff',
        '#ABC8C0',
        '#41658aff',
        '#D295BF',
    ]

    if (!data) return <div>Loading...</div>

    let tooltip = ''
    const CustomTooltip = ({
        active,
        payload,
        label,
    }: {
        label: string
        active: boolean
        payload: Array<{ dataKey: string; value: number }>
    }) => {
        const totals: { [key: string]: string } = formattedResults.reduce(
            (a, v) => ({ ...a, [v.attorney]: v.count }),
            {}
        )
        if (!active || !tooltip) return null
        for (const bar of payload) {
            if (bar.dataKey === tooltip) {
                return (
                    <div>
                        {bar.dataKey}&nbsp;
                        {((bar.value / parseInt(totals[label])) * 100).toFixed(
                            1
                        )}
                        %
                        <br />
                    </div>
                )
            }
        }
        return null
    }

    return (
        <ResponsiveContainer width="100%" height={500}>
            <BarChart data={formattedResults} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="attorney" />
                <YAxis />
                <Tooltip
                    content={(props: any) => <CustomTooltip {...props} />}
                />
                <br></br>
                <Legend />
                {Object.keys(primaryCharges)
                    .sort()
                    .map((charge, index) => {
                        return (
                            <Bar
                                maxBarSize={200}
                                key={`${charge}-${index}`}
                                dataKey={primaryCharges[charge]}
                                fill={
                                    colors[
                                        index %
                                            Object.keys(primaryCharges).length
                                    ]
                                }
                                stackId="a"
                                name={primaryCharges[charge]}
                                onMouseOver={() => {
                                    tooltip = primaryCharges[charge]
                                }}
                            />
                        )
                    })}
            </BarChart>
        </ResponsiveContainer>
    )
}

export default StackedBarChart
