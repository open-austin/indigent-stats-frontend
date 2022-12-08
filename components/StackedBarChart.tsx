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

type AttorneySummary = {
    attorney: 'Retained' | 'Court Appointed'
    count: number
    primaryCharges: Record<string, number>
}

interface StackedBarChartProps {
    data: CasesGroupedByCaseId
}

function StackedBarChart({ data }: StackedBarChartProps) {
    const retained: AttorneySummary = {
        attorney: 'Retained',
        count: 0,
        primaryCharges: {},
    }
    const appointed: AttorneySummary = {
        attorney: 'Court Appointed',
        count: 0,
        primaryCharges: {},
    }

    // TODO -- what's the shape of retained.primaryCharges?
    let primaryCharges: Record<string, string> = {}

    for (let case_ in data) {
        data[case_].forEach((c) => {
            if (c.is_primary_charge) {
                primaryCharges = upsertAt(
                    primaryCharges,
                    c.offense_type_code.toString(),
                    c.offense_type_desc
                )
            }

            if (c.attorney === 'Retained') {
                retained.count += 1

                if (c.is_primary_charge) {
                    retained.primaryCharges = upsertAtMap(
                        retained.primaryCharges,
                        c.offense_type_desc,
                        (a) => a + 1,
                        1
                    )
                }
            }

            if (c.attorney === 'Court Appointed') {
                appointed.count += 1

                if (c.is_primary_charge) {
                    appointed.primaryCharges = upsertAtMap(
                        appointed.primaryCharges,
                        c.offense_type_desc,
                        (a) => a + 1,
                        1
                    )
                }
            }
        })
    }

    console.log('primaryCharges\n', primaryCharges)
    console.log('retained\n', retained)
    console.log('appointed\n', appointed)

    // courtCases.forEach((courtCase: ICharge) => {
    //     const primaryCharge = courtCase.events.find((e) => e.isPrimaryCharge)

    //     if (courtCase.attorney === 'Retained') {
    //         retained.count = retained.count + 1
    //         if (primaryCharge?.offenseTypeCode) {
    //             retained[primaryCharge?.offenseTypeCode] =
    //                 (retained[primaryCharge?.offenseTypeCode] || 0) + 1
    //         }
    //     } else if (courtCase.attorney === 'Court Appointed') {
    //         appointed.count = appointed.count + 1
    //         if (primaryCharge?.offenseTypeCode) {
    //             appointed[primaryCharge?.offenseTypeCode] =
    //                 (appointed[primaryCharge?.offenseTypeCode] || 0) + 1
    //         }
    //     }

    //     if (
    //         primaryCharge?.offenseTypeCode &&
    //         primaryCharge?.offenseTypeDesc &&
    //         !primaryCharges[primaryCharge?.offenseTypeCode]?.length
    //     ) {
    //         primaryCharges[primaryCharge?.offenseTypeCode] = [
    //             primaryCharge?.offenseTypeDesc,
    //         ]
    //     } else if (
    //         primaryCharge?.offenseTypeCode &&
    //         !primaryCharges[primaryCharge?.offenseTypeCode]?.includes(
    //             primaryCharge?.offenseTypeDesc
    //         )
    //     ) {
    //         primaryCharges[primaryCharge?.offenseTypeCode].push(
    //             primaryCharge?.offenseTypeDesc
    //         )
    //     }
    // })

    const formattedResults = [retained, appointed]

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
        payload: Array<{ dataKey: string }>
    }) => {
        if (!active || !tooltip) return null
        console.log('payload\n', payload)
        for (const bar of payload)
            if (bar.dataKey === tooltip)
                return (
                    <div>
                        Primary charge:
                        {primaryCharges[bar.dataKey]}
                        <br />
                    </div>
                )
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
                                dataKey={charge}
                                fill={
                                    colors[
                                        index %
                                            Object.keys(primaryCharges).length
                                    ]
                                }
                                stackId="a"
                                name={primaryCharges[charge]}
                                onMouseOver={() => {
                                    tooltip = charge
                                }}
                            />
                        )
                    })}
            </BarChart>
        </ResponsiveContainer>
    )
}

export default StackedBarChart
