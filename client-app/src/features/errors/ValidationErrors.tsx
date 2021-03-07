import React from 'react'
import { Message } from 'semantic-ui-react'
interface Props{
    errors: string[]|null
}
const ValidationErrors = ({errors}:Props) => {
    console.log(errors)
    return (
        <Message error={true}>
            {errors&&(
                <Message.List>
                    {errors.map((error,i)=>( 
                        <Message.Item key={i}>
                            {error}
                        </Message.Item>)
                       
                    )}
                </Message.List>
            )}
        </Message>
    )
}

export default ValidationErrors
