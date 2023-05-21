interface CaseTable {
    case_id: string
    case_number: string
    attorney_type: string
    earliest_charge_date: string
    has_evidence_of_representation: boolean
    charge_desc: string[]
    charge_category: string[]
    charge_level: string[]
    motions: string[]
    id: string
    _rid: string
    _self: string
    _etag: string
    _attachments: string
    _ts: number
}

interface Database {
    c: CaseTable
}
