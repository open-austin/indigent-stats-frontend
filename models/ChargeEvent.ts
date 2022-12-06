import { RawCharge } from "./Charge"

export interface IChargeEvent {
    eventName: string
    eventDate: Date
    firstEventDate: Date
    chargeName: string
    statute: string
    level: string
    numCounts: number
    chargeId: number
    chargeDate: Date
    isPrimaryCharge: boolean
    statuteChapter: number
    statuteSection: number
    statuteSubsection: string
    isFailureToAppear: boolean
    uccsCode: number
    probability: number
    chargeDesc: string
    offenseCategoryCode: number
    offenseCategoryDesc: string
    offenseTypeCode: number
    offenseTypeDesc: string
}

class ChargeEvent implements IChargeEvent {
  eventName: string
  eventDate: Date
  firstEventDate: Date
  chargeName: string
  statute: string
  level: string
  numCounts: number
  chargeId: number
  chargeDate: Date
  isPrimaryCharge: boolean
  statuteChapter: number
  statuteSection: number
  statuteSubsection: string
  isFailureToAppear: boolean
  uccsCode: number
  probability: number
  chargeDesc: string
  offenseCategoryCode: number
  offenseCategoryDesc: string
  offenseTypeCode: number
  offenseTypeDesc: string

  constructor(rawCharge: RawCharge) {
      const {
          event_name_formatted: eventName,
          event_date: eventDate,
          first_event_date: firstEventDate,
          charge_name: chargeName,
          statute,
          level,
          num_counts: numCounts,
          charge_id: chargeId,
          charge_date: chargeDate,
          is_primary_charge: isPrimaryCharge,
          statute_chapter: statuteChapter,
          statute_section: statuteSection,
          statute_subsection: statuteSubsection,
          is_failure_to_appear: isFailureToAppear,
          uccs_code: uccsCode,
          probability,
          charge_desc: chargeDesc,
          offense_category_code: offenseCategoryCode,
          offense_category_desc: offenseCategoryDesc,
          offense_type_code: offenseTypeCode,
          offense_type_desc: offenseTypeDesc,
      } = rawCharge

      this.eventName = eventName
      this.eventDate = new Date(eventDate)
      this.firstEventDate = new Date(firstEventDate)
      this.chargeName = chargeName
      this.statute = statute
      this.level = level
      this.numCounts = numCounts
      this.chargeId = chargeId
      this.chargeDate = new Date(chargeDate)
      this.isPrimaryCharge = isPrimaryCharge === 'TRUE'
      this.statuteChapter = statuteChapter
      this.statuteSection = statuteSection
      this.statuteSubsection = statuteSubsection
      this.isFailureToAppear = isFailureToAppear === 'TRUE'
      this.uccsCode = uccsCode
      this.probability = probability
      this.chargeDesc = chargeDesc
      this.offenseCategoryCode = offenseCategoryCode
      this.offenseCategoryDesc = offenseCategoryDesc
      this.offenseTypeCode = offenseTypeCode
      this.offenseTypeDesc = offenseTypeDesc
  }
}

export default ChargeEvent