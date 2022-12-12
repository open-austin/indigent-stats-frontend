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
} from 'recharts'
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

    console.log('num of cases\n', cases.length)

    cases.forEach((c) => {
        pcSet.add(c.charges[0].offense_type_desc)

        // This should work since all of the "charges" within a given case were
        // all scraped from the same record -- although in practice I'm not sure
        // whether an attorney represents *all* charges for a given client..
        // or is that ridiculous? Surely they represent them for all charges...
        if (c.attorney_type === 'Retained') {
            retained.caseCount += 1

            c.charges.forEach((charge) => {
                retained.totalCharges = upsertAtMap(
                    retained.totalCharges,
                    charge.offense_type_desc,
                    (a) => a + 1,
                    1
                )
            })
        }

        if (c.attorney_type === 'Court Appointed') {
            appointed.caseCount += 1

            c.charges.forEach((charge) => {
                appointed.totalCharges = upsertAtMap(
                    appointed.totalCharges,
                    charge.offense_type_desc,
                    (a) => a + 1,
                    1
                )
            })
        }
    })

    const formattedResults = [flattenObject(retained), flattenObject(appointed)]

    const primaryCharges = Array.from(pcSet)

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

    if (!cases) return <div>Loading...</div>

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
            (a, v) => ({ ...a, [v.attorney]: v.caseCount }),
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
                {primaryCharges.sort().map((charge, index) => {
                    return (
                        <Bar
                            maxBarSize={200}
                            key={`${charge}-${index}`}
                            dataKey={charge}
                            fill={
                                colors[
                                    index % Object.keys(primaryCharges).length
                                ]
                            }
                            stackId="a"
                            name={charge}
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
