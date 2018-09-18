import styled from 'styled-components'

const fofBlue = '#007bff'

export const Button = styled.button`
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: transparent;
`

export const ActionButton = styled(Button)`
    background-color: ${fofBlue}; 
    color: white;
`

export const MemberActionButton = styled(ActionButton)`
    font-size: small;
    margin: 5px;
`
