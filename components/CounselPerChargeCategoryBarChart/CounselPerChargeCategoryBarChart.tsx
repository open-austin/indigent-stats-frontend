import z from 'zod'
import useSWR from 'swr'
import styled from 'styled-components'

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    ResponsiveContainer,
    Legend,
    CartesianGrid,
    Tooltip,
} from 'recharts'
import { Props as LegendProps } from 'recharts/types/component/Legend'

import { stackedGraphColors } from '../../lib/colors'
import { H4 } from '../Typography/Headings'
import { ErrorComponent } from '../ErrorComponent'
import { mapWithIndex } from '../../lib/record'
import { groupBy } from '../../lib/array'
import fetcher from '../../lib/fetcher'

import { renderLegend } from './Legend'

const ChartTitle = styled(H4)`
    text-align: center;
`

const SECRET = process.env.NEXT_PUBLIC_COSMOSDB_SECRET

/**
 * The query string sent to CosmosDB
 */
const QUERY = `
SELECT a.charge_category, a.attorney_type, COUNT(a) AS count
  FROM (
    SELECT c.attorney_type, charge["charge_category"] AS charge_category FROM c
    JOIN charge IN c["charges"]
    WHERE
        charge["charge_category"] != null AND
        (c.attorney_type = "Retained" OR
        c.attorney_type = "Court Appointed")
  ) a
  GROUP BY a.attorney_type, a.charge_category
`

/**
 * Defines the schema of the expected return from the query
 */
const schema = z.array(
    z.object({
        charge_category: z.string(),
        attorney_type: z.string(),
        count: z.number(),
    })
)

export function CounselPerChargeCategoryBarChart() {
    const { data, error, isLoading } = useSWR(
        `/api/cosmos?secret=${SECRET}&sql=${QUERY}&container=clean-cases&db=cases-json-db`,
        fetcher
    )

    if (isLoading) {
        return <>Loading...</>
    }

    if (error) {
        return <ErrorComponent />
    }

    const parsed = schema.safeParse(data?.data)

    if (!parsed.success) {
        console.log(parsed.error.format())

        return <>There was an parsing the data</>
    }

    const grouped = groupBy(parsed.data)((a) => a.charge_category)

    const mapped = mapWithIndex(grouped, (category, charges) => {
        const [a, b] = charges

        const retained = a.attorney_type === 'Retained' ? a.count : b.count
        const appointed = a.attorney_type === 'Retained' ? b.count : a.count

        return {
            category,
            retained,
            appointed,
            total: a.count + b.count,
        }
    })

    // const categories = Object.keys(grouped)
    const records = Object.values(mapped)

    // Sum the number of cases
    const retained = records.reduce((acc, curr) => acc + curr.retained, 0)
    const appointed = records.reduce((acc, curr) => acc + curr.appointed, 0)

    return (
        <>
            <ChartTitle>
                Cases per Attorney Type Grouped by Charge Category
            </ChartTitle>

            <ResponsiveContainer
                width="100%"
                height="100%"
                minHeight={450}
                className={'stacked-bar-chart stacked-bar-chart-bottom'}
            >
                <BarChart
                    data={records}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend
                        // @ts-ignore: Not a relevant props error
                        content={(props: LegendProps) =>
                            renderLegend(props, 'Type of lawyer', {
                                retained,
                                appointed,
                            })
                        }
                    />
                    <Bar
                        dataKey="appointed"
                        stackId="a"
                        fill={stackedGraphColors[1]}
                    />
                    <Bar
                        dataKey="retained"
                        stackId="b"
                        fill={stackedGraphColors[5]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </>
    )
}
