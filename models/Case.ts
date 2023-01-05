import { z } from 'zod'
import { filtersSchema } from './Filters'

export type Case = z.TypeOf<typeof caseSchema>

export const caseSchema = z
    .object({
        case_id: z.string(),
        case_number: z.string(),
        attorney_type: z.string(),
        earliest_charge_date: z.string(),
        year: z.number().optional(),
        has_evidence_of_representation: z.boolean(),
        charge_desc: z.array(z.coerce.string()),
        charge_category: z.array(z.coerce.string()),
        charge_level: z.array(z.coerce.string()),
        motions: z.array(z.coerce.string()),
        filters: filtersSchema.optional(),
    })
    .transform((c) => {
        let parsed = c

        parsed.filters = {
            motions: Array.from(new Set(c.motions)),
            charges: Array.from(new Set(c.charge_desc)),
            chargeCategories: Array.from(new Set(c.charge_category)),
            chargeLevels: Array.from(new Set(c.charge_level)),
        }

        parsed.year = parseInt(c.earliest_charge_date.substring(0, 4))

        return parsed
    })
