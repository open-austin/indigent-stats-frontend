import React, { useState } from 'react'
import styled from 'styled-components'
import { colors } from '../../lib/colors'
import { bp } from '../../lib/breakpoints'

export const LegendWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    flex-direction: column-reverse;
    align-items: center;
    text-align: center;

    @media ${bp.md} {
        padding: 0 32px 60px;
        flex-direction: row;
        align-items: flex-start;
        text-align: left;
    }

    @media ${bp.lg} {
        padding-left: 80px;
    }
`

export const LegendBox = styled.aside`
    border: 1px solid ${colors.text};
    border-radius: 4px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    justify-content: flex-end;
    max-width: 250px;
    margin-top: 24px;

    @media ${bp.lg} {
        margin: 16px 0 0 auto;
    }
`

export const LegendSpan = styled.span`
    display: flex;
    gap: 0.5rem;
    align-items: center;
    font-size: 10px;
`

export const LegendColorBlock = styled.div`
    width: 14px;
    height: 14px;
    border-radius: 2px;
`

export const LegendTitle = styled.span`
    font-size: 11px;
    display: flex;
    gap: 6px;
`

export const LegendTitleTooltip = styled.button`
    padding: 2px;
    width: 14px;
    height: 14px;
    border-radius: 50px;
    border: 1px solid ${colors.text};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background: none;
    font-size: 9px;
    font-weight: 600;
    transition: background 0.15s linear;

    &:hover,
    &:focus-visible {
        background-color: ${colors.gray};
    }
`

export const LegendTooltipInfo = styled.span`
    position: absolute;
    bottom: calc(100% - 12px);
    right: 6px;
    width: 100%;
    max-width: 400px;
    font-size: 10px;
    font-weight: 400;
    text-align: left;
    background-color: ${colors.gray};
    border-radius: 6px;
    border-bottom-right-radius: 0;
    padding: 12px;
    line-height: 1.5;
    color: ${colors.blueNavy};
    filter: drop-shadow(0 1px 0.3rem rgba(0, 0, 0, 0.2));

    @media ${bp.lg} {
        right: 6px;
    }

    &:after {
        content: '';
        width: 0px;
        height: 0px;
        border-left: 14px solid transparent;
        border-right: 14px solid transparent;
        border-top: 12px solid ${colors.gray};
        position: absolute;
        bottom: -12px;
        right: 0;

        @media ${bp.lg} {
            right: 32px;
        }
    }
`

export const LegendSampleSize = styled.div`
    font-size: 11px;
    margin-top: 24px;
`

export const LegendSampleSizeTitle = styled.strong`
    display: block;
    margin-bottom: 6px;
    font-size: 11px;
`

export const Tooltip = () => {
    const [showTooltip, setShowTooltip] = useState(false)
    return (
        <LegendTitleTooltip
            aria-label="Learn more about how this is calculated"
            onClick={() => {
                setShowTooltip(!showTooltip)
            }}
            onMouseEnter={() => {
                setShowTooltip(true)
            }}
            onMouseLeave={() => {
                setShowTooltip(false)
            }}
        >
            <span>?</span>
            {showTooltip && (
                <LegendTooltipInfo role="tooltip">
                    We&apos;re determining evidence of representation by
                    measuring if any significant motions were filed by the
                    defendant&apos;s attorney. These motions include: motion to
                    suppress, motion to reduce bond, motion for production,
                    motion for speedy trial, motion for discovery, and motion in
                    limine.
                </LegendTooltipInfo>
            )}
        </LegendTitleTooltip>
    )
}
