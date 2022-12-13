import React, { ChangeEvent, useState } from 'react'
import styled from 'styled-components'
import { Case } from '../models/Case'
import { significantMotions } from '../lib/constants'

type TSignificantMotion = typeof significantMotions[number]
export interface IFilters {
    motions: 'All' | TSignificantMotion
    charges: string
    chargeCategories: string
    chargeLevels: string
}
interface IFilterProps {
    filterField: 'motions' | 'charges' | 'chargeCategories' | 'chargeLevels'
    filters: IFilters
    setFilters: (f: IFilters) => void
    data: Array<Case>
}

const filterNames = {
    motions: 'Motions',
    charges: 'Charges',
    chargeCategories: 'Charge categories',
    chargeLevels: 'Charge levels',
}

const Wrapper = styled.div`
    margin-bottom: 1rem;
    position: relative;
`

const Arrow = styled.span`
    box-sizing: border-box;
    height: 0.5rem;
    width: 0.5rem;
    border-style: solid;
    border-color: blue;
    border-width: 0px 1px 1px 0px;
    transform: rotate(45deg);
    transition: border-width 150ms ease-in-out;
    position: absolute;
    right: 0;
    z-index: 2;
`

const FilterSelect = styled.select`
    width: 100%;
    max-width: 20rem;

    // Resets
    appearance: none;
    background-color: transparent;
    border: none;
    padding: 0 1em 0 0;
    margin: 0;
    width: 100%;
    font-family: inherit;
    font-size: inherit;
    cursor: inherit;
    line-height: inherit;
    z-index: 1;
    outline: none;
    border: 2px solid #70a37f;
    border-radius: 5px;
    padding: 0.5rem;
    position: relative;

    &:focus,
    &:focus-visible {
        border-color: blue;
    }
`

const FilterLabel = styled.label`
    display: block;
    margin-bottom: 0.25rem;
`

const Filter = ({ filterField, filters, setFilters, data }: IFilterProps) => {
    // Get all options that exist in the data
    const options = data.reduce((acc, cur) => {
        if (cur?.filters && typeof cur?.filters[filterField] !== 'undefined') {
            return [...acc, ...cur.filters[filterField]]
        }
    }, [])

    function onChangeHandler(event: React.ChangeEvent<HTMLSelectElement>) {
        setFilters({ ...filters, [filterField]: event.target.value })
        console.log('event target ', filters)
    }

    return (
        <Wrapper>
            <FilterLabel htmlFor={`select-${filterField}`}>
                {filterNames[filterField]}
            </FilterLabel>
            <FilterSelect
                id={`select-${filterField}`}
                value={filters[filterField]}
                onChange={onChangeHandler}
            >
                {[...new Set([...options, 'All'])]?.map((option: string) => (
                    <option key={`option-${option}`} value={option}>
                        {option}
                    </option>
                ))}
            </FilterSelect>
        </Wrapper>
    )
}

export default Filter
