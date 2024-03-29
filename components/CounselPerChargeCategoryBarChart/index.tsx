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

import { colors, stackedGraphColors } from '../../lib/colors'
import { H4 } from '../Typography/Headings'
import { ErrorComponent } from '../ErrorComponent'
import { mapWithIndex } from '../../lib/record'
import { groupBy } from '../../lib/array'
import fetcher from '../../lib/fetcher'

import { renderLegend } from './Legend'
import useMediaQuery from '../../lib/hooks/useMediaQuery'

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

const CounselBarChart = () => {
    const { data, error, isLoading } = useSWR(
        `/api/counsel-per-charge`,
        fetcher
    )
    const isLg = useMediaQuery('lg')

    if (isLoading) {
        return <>Loading...</>
    }

    if (error) {
        return <ErrorComponent />
    }

    const parsed = schema.safeParse(data)

    if (!parsed.success) {
        console.error(parsed.error.format())

        return (
            <ErrorComponent message="There was an error while parsing the data" />
        )
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
                width={isLg ? 800 : '100%'}
                height="100%"
                minHeight={isLg ? 800 : '100vh'}
                className="recharts-wrapper"
            >
                <BarChart
                    maxBarSize={120}
                    barSize={isLg ? 35 : 30}
                    barCategoryGap={isLg ? 35 : 30}
                    barGap={0}
                    data={records}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                    layout="vertical"
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <YAxis dataKey="category" type="category" fontSize={18} />
                    <XAxis type="number" />
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
                        name="Court appointed"
                        fill={colors.openAustinOrange}
                    />
                    <Bar
                        dataKey="retained"
                        name="Retained"
                        fill={colors.violet}
                    />
                </BarChart>
            </ResponsiveContainer>
        </>
    )
}

export default CounselBarChart
