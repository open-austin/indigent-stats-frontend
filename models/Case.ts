import { z } from 'zod'
import { caseEventSchema } from './CaseEvent'
import { chargeSchema } from './Charge'
import { filtersSchema } from './Filters'

export type Case = z.TypeOf<typeof caseSchema>

export const caseSchema = z
    .object({
        case_id: z.string(),
        case_number: z.string(),
        defense_attorney: z.string().optional(),
        attorney_type: z.string(),
        earliest_charge_date: z.string(),
        charges: chargeSchema,
        events: caseEventSchema,
        filters: filtersSchema.optional(),
    })
    .transform((c) => {
        let parsed = c

        c.filters = {
            motions:
                c.events
                    .filter((e) => e.event_name?.startsWith('Motion') && !e.event_name?.includes('Dismiss'))
                    .map((e) => e.event_name) || [],
            charges: c.charges.map((e) => e.charge_desc) || [],
            chargeCategories: c.charges.map((e) => e.offense_category_desc),
            chargeLevels: c.charges.map((e) => e.level) || [],
        }
        return parsed
    })
