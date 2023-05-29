import styled from 'styled-components'

const Wrapper = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
`

// TODO: This is an awkward name, but "Error" is a reserved word.
// TODO: We may want to actually show some error information here.
export const ErrorComponent = ({
    message = 'An error occured.',
}: {
    message?: string
}) => (
    <Wrapper>
        <div>{message}</div>
    </Wrapper>
)
