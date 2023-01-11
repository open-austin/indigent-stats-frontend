import styled from 'styled-components'
import { colors } from '../lib/colors'

const Wrapper = styled.section`
    min-height: 80vh;
    background-color: ${colors.gray};
`
const Heading = styled.h1`
    padding: 1rem 0;
    margin: 0;
`

export const Hero = () => {
    return (
        <Wrapper>
            <div>
                <Heading>
                    Aggregating criminal court case data in Texas counties
                </Heading>
            </div>
            <p>
                <a
                    href="https://www.open-austin.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Open Austin
                </a>{' '}
                began scraping and aggregating data from criminal court cases in
                Texas counties in 2022. Prior to this, the data existed in its
                respective silos within individual county&apos;s websites, which
                made it difficult to understand how criminal court cases are
                handled from an evidence-based perspective.
            </p>
            <p>
                For some context, here is what a Texas criminal court record
                looks like:
            </p>
            <p></p>
        </Wrapper>
    )
}
