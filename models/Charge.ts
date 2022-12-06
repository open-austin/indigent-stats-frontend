import ChargeEvent from './ChargeEvent'

export interface RawCharge {
    case_number: string
    event_name_formatted: string
    event_date: string
    first_event_date: string
    attorney: string
    charge_name: string
    statute: string
    level: string
    num_counts: number
    charge_id: number
    earliest_charge_date: string
    latest_charge_date: string
    charge_date: string
    is_primary_charge: string
    statute_chapter: number
    statute_section: number
    statute_subsection: string
    is_failure_to_appear: string
    uccs_code: number
    probability: number
    charge_desc: string
    offense_category_code: number
    offense_category_desc: string
    offense_type_code: number
    offense_type_desc: string
    events: Array<ChargeEvent>
}

export interface ICharge {
    caseNumber: string
    firstEventDate: Date
    attorney: string
    earliestChargeDate: Date
    latestChargeDate: Date
    isFailureToAppear: boolean
    events: Array<ChargeEvent>
}

class Charge implements ICharge {
    caseNumber: string
    firstEventDate: Date
    attorney: string
    earliestChargeDate: Date
    latestChargeDate: Date
    isFailureToAppear: boolean
    events: Array<ChargeEvent>

    constructor(rawCharge: RawCharge) {
        const {
            case_number: caseNumber,
            first_event_date: firstEventDate,
            attorney,
            earliest_charge_date: earliestChargeDate,
            latest_charge_date: latestChargeDate,
            is_failure_to_appear: isFailureToAppear,
            events,
        } = rawCharge

        this.caseNumber = caseNumber
        this.firstEventDate = new Date(firstEventDate)
        this.attorney = attorney
        this.earliestChargeDate = new Date(earliestChargeDate)
        this.latestChargeDate = new Date(latestChargeDate)
        this.isFailureToAppear = isFailureToAppear === 'TRUE'
        this.events = events || []
    }
}

export default Charge
