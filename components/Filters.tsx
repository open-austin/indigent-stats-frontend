import React, { ChangeEvent } from 'react'
import styled from 'styled-components'
import { colors } from '../lib/colors'
import { Case } from '../models/Case'

export interface IFilters {
    motions: string
    charges: string
    chargeCategories: string
    chargeLevels: string
}

interface IFilterProps {
    label: string
    filtersKey: keyof IFilters
    options: Array<string>
    onChange: (e: ChangeEvent, filtersKey: keyof IFilters) => void
    filters: IFilters
}

const FilterForm = styled.form`
  flex-basis: 100%;

  @media (min-width: 1000px) {
    flex-basis: calc(100% / 3);
  }
`

const Wrapper = styled.div`
    margin-bottom: 1rem;
    position: relative;
`

const FilterSelect = styled.select`
    width: 100%;

    // Resets
    appearance: none;
    background-color: transparent;
    border: none;
    padding: 0 1em 0 0;
    margin: 0;
    font-family: inherit;
    font-size: inherit;
    cursor: inherit;
    line-height: inherit;
    z-index: 1;
    outline: none;
    border: 2px solid ${colors.blueNavy};
    border-radius: 5px;
    padding: 0.5rem;
    position: relative;

    &:focus,
    &:focus-visible {
        border-color: ${colors.pink};
    }
`

const FilterLabel = styled.label`
    display: block;
    margin-bottom: 0.25rem;
    color: ${colors.text};
    font-size: 0.8rem;
`

const Filter = ({
    label,
    options,
    onChange,
    filters,
    filtersKey,
}: IFilterProps) => {
    return (
        <Wrapper>
            <FilterLabel htmlFor={`select-${label}`}>{label}</FilterLabel>
            <FilterSelect
                id={`select-${label}`}
                value={filters[filtersKey] || 'All'}
                onChange={(e) => onChange(e, filtersKey)}
            >
                {Array.from(new Set(['All', ...options]))?.map(
                    (option: string) => (
                        <option key={`option-${option}`} value={option}>
                            {option}
                        </option>
                    )
                )}
            </FilterSelect>
        </Wrapper>
    )
}

interface IFiltersProps {
    data: Array<Case>
    filteredData: Array<Case>
    filters: IFilters
    setFilters: (value: any) => void
    children: React.ReactNode
}

const filterNames = {
    motions: 'Motions',
    charges: 'Charges',
    chargeCategories: 'Charge categories',
    chargeLevels: 'Charge levels',
}

// TODO: Figure out how to do dynamic filters based on the other filters
// once data is updated
const Filters = ({ data, filters, setFilters, children, filteredData }: IFiltersProps) => {
    const options: { [key: string]: Array<string> } = {}
    Object.keys(filters).forEach((filter) => {
        options[filter] = []
    })

    filteredData?.forEach((d) => {
        Object.keys(filters).forEach((f) => {
            const filter = f as keyof IFilters
            if (!d?.filters && !Object.hasOwnProperty(filter)) {
                return
            }
            options[filter] = Array.from(
                new Set([...options[filter], ...(d?.filters![filter] || [])])
            )
        })
    })

    const onChangeHandler = (
        e: ChangeEvent<HTMLSelectElement>,
        filtersKey: keyof IFilters
    ) => {
        setFilters({ ...filters, [filtersKey]: e?.target?.value })
    }

    return (
        <FilterForm>
            {Object.keys(filters).map((f) => {
                const filter = f as keyof IFilters
                const filterOptions =
                    filter === 'chargeLevels'
                        ? options[filter].reverse()
                        : options[filter].sort()
                return (
                    <Filter
                        onChange={(e: ChangeEvent<any>) =>
                            onChangeHandler(e, filter)
                        }
                        key={filter}
                        label={filterNames[filter]}
                        options={filterOptions}
                        filtersKey={filter}
                        filters={filters}
                    />
                )
            })}
            {children}
        </FilterForm>
    )
}

export default Filters
