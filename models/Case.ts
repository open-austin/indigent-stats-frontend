import { z } from 'zod'
import { caseEventSchema } from './CaseEvent'
import { chargeSchema } from './Charge'
import { filtersSchema } from './Filters'
import { significantMotions } from '../lib/constants'

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

        const motions = c.events
                            .filter((e) => significantMotions.includes(e.event_name))
                            .map((e) => e.event_name) || []

        const charges = c.charges.map((e) => e.charge_desc) || []
        const chargeCategories = c.charges.map((e) => e.offense_category_desc) || []
        const chargeLevels = c.charges.map((e) => e.level) || []

        parsed.filters = {
            motions: [...new Set(motions)],
            charges: [...new Set(charges)],
            chargeCategories: [...new Set(chargeCategories)],
            chargeLevels: [...new Set(chargeLevels)]
        }

        return parsed
    })
