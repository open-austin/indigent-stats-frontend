import React, { ChangeEvent, useEffect } from 'react'
import styled from 'styled-components'
import { bp } from '../lib/breakpoints'
import { colors } from '../lib/colors'
import { filterSingleProperty } from '../lib/multifilter'
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
    setFilters: (f: IFilters) => void
}

const OPTION_ALL = 'All'

const FilterForm = styled.form`
    flex-basis: 100%;

    @media ${bp.lg} {
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
    setFilters,
}: IFilterProps) => {
    useEffect(() => {
        if (
            !options.includes(filters[filtersKey]) &&
            filters[filtersKey] !== OPTION_ALL
        ) {
            setFilters({
                ...filters,
                [filtersKey]: OPTION_ALL,
            })
        }
    }, [options, filtersKey, setFilters, filters])

    return (
        <Wrapper>
            <FilterLabel htmlFor={`select-${label}`}>{label}</FilterLabel>
            <FilterSelect
                id={`select-${label}`}
                value={filters[filtersKey]}
                onChange={(e) => onChange(e, filtersKey)}
            >
                {Array.from(new Set([OPTION_ALL, ...options]))?.map(
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
const Filters = ({ data, filters, setFilters, children }: IFiltersProps) => {
    const options: { [key: string]: Array<string> } = {}
    Object.keys(filters).forEach((filter) => {
        options[filter] = []
    })

    // all data is filtered by
    let filteredData =
        filters['chargeCategories'] === OPTION_ALL
            ? data
            : filterSingleProperty(
                  data,
                  'chargeCategories',
                  filters as IFilters
              )

    filteredData?.forEach((d) => {
        Object.keys(filters).forEach((f) => {
            const filter = f as keyof IFilters
            if (
                (!d?.filters && !Object.hasOwnProperty(filter)) ||
                filter === 'chargeCategories'
            ) {
                return
            }
            options[filter] = Array.from(
                new Set([...options[filter], ...(d?.filters![filter] || [])])
            )
        })
    })

    // Charge categories stay consistent, everythinge else is filtered by it
    options['chargeCategories'] = data.reduce((acc: any, cur) => {
        if (
            cur?.filters &&
            typeof cur?.filters['chargeCategories'] !== 'undefined'
        ) {
            return Array.from(
                new Set([...acc, ...cur.filters['chargeCategories']])
            )
        }
    }, [])

    const onChangeHandler = (
        e: ChangeEvent<HTMLSelectElement>,
        filtersKey: keyof IFilters
    ) => {
        const val = e?.target?.value

        setFilters({
            ...filters,
            [filtersKey]: val,
        })
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
                        setFilters={setFilters}
                    />
                )
            })}
            {children}
        </FilterForm>
    )
}

export default Filters
