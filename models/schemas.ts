import { z } from 'zod'

const example = {
    case_number: '20-0551CR-2',
    event_name_formatted: 'Discovery Receipt',
    event_date: '2021-07-02',
    first_event_date: '2020-02-01',
    attorney: 'Retained',
    charge_name: 'ACCIDENT INVOLVING DAMAGE TO VEHICLE>=$200',
    statute: '550.022(c)(2)',
    level: 'Misdemeanor B',
    num_counts: 1,
    charge_id: 1,
    earliest_charge_date: '2020-02-01',
    latest_charge_date: '2020-02-01',
    charge_date: '2020-02-01',
    is_primary_charge: 'TRUE',
    statute_chapter: 550,
    statute_section: 22,
    statute_subsection: 'c - 2',
    is_failure_to_appear: 'FALSE',
    uccs_code: 2120,
    probability: 0.999157022261789,
    charge_desc: 'Hit and Run Driving with Property Damage',
    offense_category_code: 31,
    offense_category_desc: 'Hit and run driving - property damage',
    offense_type_code: 2,
    offense_type_desc: 'Property',
}

export const caseSchema = z.object({
    attorney: z.string(),
    case_number: z.string().or(z.number()),
    charge_date: z.string(),
    charge_desc: z.string(),
    charge_id: z.number(),
    charge_name: z.string(),
    earliest_charge_date: z.string(),
    event_date: z.string(),
    event_name_formatted: z.string(),
    first_event_date: z.string(),
    is_failure_to_appear: z.string(),
    is_primary_charge: z.string(),
    latest_charge_date: z.string(),
    level: z.string(),
    num_counts: z.number(),
    offense_category_code: z.number(),
    offense_category_desc: z.string(),
    offense_type_code: z.number(),
    offense_type_desc: z.string(),
    probability: z.number().or(z.string()),
    statute_chapter: z.number(),
    statute_section: z.number(),
    statute_subsection: z.string(),
    statute: z.string().or(z.number()),
    uccs_code: z.number(),
})

// transform into a more convenient data model
const toInternal = z.object({
    attorney: z.string(),
    case_number: z
        .string()
        .or(z.number())
        .transform((a) => a.toString()),
    charge_date: z.string(),
    charge_desc: z.string(),
    charge_id: z.number(),
    charge_name: z.string(),
    earliest_charge_date: z.string(),
    event_date: z.string(),
    event_name_formatted: z.string(),
    first_event_date: z.string(),
    is_failure_to_appear: z
        .string()
        .transform((a) => (a === 'TRUE' ? true : false)),
    is_primary_charge: z
        .string()
        .transform((a) => (a === 'TRUE' ? true : false)),
    latest_charge_date: z.string(),
    level: z.string(),
    num_counts: z.number(),
    offense_category_code: z.number(),
    offense_category_desc: z.string(),
    offense_type_code: z.number(),
    offense_type_desc: z.string(),
    probability: z
        .number()
        .or(z.string())
        .transform((a) => a.toString()),
    statute_chapter: z.number(),
    statute_section: z.number(),
    statute_subsection: z.string(),
    statute: z
        .string()
        .or(z.number())
        .transform((a) => a.toString()),
    uccs_code: z.number(),
})

export const combinedDataSchema = z.array(caseSchema)
export const groupedChargesSchema = z.record(z.array(toInternal))

export type CombinedData = z.TypeOf<typeof combinedDataSchema>
export type CasesGroupedByCaseId = z.TypeOf<typeof groupedChargesSchema>
