import React, { useState, ReactNode } from 'react'
import styled from 'styled-components'
import { AttorneySummary } from '.'
import { colors } from '../../lib/colors'

const LegendWrapper = styled.div`
    display: flex;
    align-items: flex-start;
    padding: 0 32px;
`

const LegendBox = styled.aside`
    border: 1px solid ${colors.text};
    border-radius: 4px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    justify-content: flex-end;
    margin: 16px 0 0 auto;
    max-width: 250px;
`

const LegendSpan = styled.span`
    display: flex;
    gap: 10px;
    align-items: center;
    font-size: 10px;
`

const LegendColorBlock = styled.div`
    width: 14px;
    height: 14px;
    border-radius: 2px;
`

const LegendTitle = styled.span`
    font-size: 11px;
    display: flex;
    gap: 6px;
`

const LegendTitleTooltip = styled.button`
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

const LegendTooltipInfo = styled.span`
    position: absolute;
    bottom: calc(100% - 12px);
    right: 36px;
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
    }
`

const LegendSampleSize = styled.div`
    font-size: 11px;
    margin-top: 24px;
`

const LegendSampleSizeTitle = styled.strong`
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
                  defendant&apos;s attorney. These motions include: motion
                  to suppress, motion to reduce bond, motion for
                  production, motion for speedy trial, motion for
                  discovery, and motion in limine.
              </LegendTooltipInfo>
          )}
      </LegendTitleTooltip>
  )
}

export const renderLegend = (
  props: Props,
  notEnoughData: boolean,
  arr: Array<AttorneySummary>
): ReactNode => {
  console.log('props ', props)
  return (
      <LegendWrapper>
          <LegendSampleSize>
              <LegendSampleSizeTitle>Sample size</LegendSampleSizeTitle>
              <div>
                  <small>
                      Retained: {arr[0].data?.length} cases <br />
                      Court Appointed: {arr[1].data?.length} cases
                  </small>
              </div>
              {notEnoughData && (
                  <small>
                      <em>
                          <br />
                          *This filtered sample size is not large enough
                          to make a conclusion.
                      </em>
                  </small>
              )}
          </LegendSampleSize>
          <LegendBox>
              <LegendTitle>
                  <strong>Evidence of representation</strong>
                  <Tooltip />
              </LegendTitle>
              {[...(props.payload || [])]
                  .reverse()
                  .map((entry, index) => (
                      <LegendSpan key={`item-${index}`}>
                          <LegendColorBlock
                              style={{
                                  backgroundColor: entry.color,
                              }}
                          />
                          {entry.value}
                      </LegendSpan>
                  ))}
          </LegendBox>
      </LegendWrapper>
  )
}