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

interface BarChartProps {
    data: any
}

function StackedBarChart({ data }: BarChartProps) {
    const courtCases = !!data ? JSON.parse(data) : []
    const retained: any = {
        attorney: 'Retained',
        count: 0,
    }
    const appointed: any = {
        attorney: 'Court Appointed',
        count: 0,
    }

    console.log('data', courtCases[0])

    const primaryCharges: any = {}
    courtCases.forEach((courtCase: ICharge) => {
        const primaryCharge = courtCase.events.find((e) => e.isPrimaryCharge)

        if (courtCase.attorney === 'Retained') {
            retained.count = retained.count + 1
            if (primaryCharge?.offenseTypeCode) {
                retained[`${primaryCharge?.offenseTypeCode}`] =
                    (retained[primaryCharge?.offenseTypeCode] || 0) + 1
            }
        } else if (courtCase.attorney === 'Court Appointed') {
            appointed.count = appointed.count + 1
            if (primaryCharge?.offenseTypeCode) {
                appointed[primaryCharge?.offenseTypeCode] =
                    (appointed[primaryCharge?.offenseTypeCode] || 0) + 1
            }
        }

        if (
            primaryCharge?.offenseTypeCode &&
            primaryCharge?.offenseTypeDesc &&
            !primaryCharges[primaryCharge?.offenseTypeCode]?.length
        ) {
            primaryCharges[primaryCharge?.offenseTypeCode] = [
                primaryCharge?.offenseTypeDesc,
            ]
        } else if (
            primaryCharge?.offenseTypeCode &&
            !primaryCharges[primaryCharge?.offenseTypeCode]?.includes(
                primaryCharge?.offenseTypeDesc
            )
        ) {
            primaryCharges[primaryCharge?.offenseTypeCode].push(
                primaryCharge?.offenseTypeDesc
            )
        }
    })

    const formattedResults = [retained, appointed]

    const colors = [
      '#79b473ff',
      '#414073ff',
      '#4c3957ff',
      '#ABC8C0',
      '#41658aff',
      '#D295BF'
    ]

    if (!data) return <div>Loading...</div>

    let tooltip = ''
    const CustomTooltip = ({
        active,
        payload,
        label,
    }: {
        active: boolean
        payload: any
        label: string
    }) => {
        if (!active || !tooltip) return null
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
                <Tooltip content={(props: any) => <CustomTooltip {...props} />} />
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
                                fill={colors[index % (Object.keys(primaryCharges).length)]}
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
