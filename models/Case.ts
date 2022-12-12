import { z } from 'zod'
import { caseEventSchema } from './CaseEvent'
import { chargeSchema } from './Charge'

export type Case = z.TypeOf<typeof caseSchema>

export const caseSchema = z.object({
    case_id: z.string(),
    case_number: z.string(),
    defense_attorney: z.string().optional(),
    attorney_type: z.string(),
    earliest_charge_date: z.string(),
    charges: chargeSchema,
    events: caseEventSchema,
})
