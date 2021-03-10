import React from 'react'
import { Message } from 'semantic-ui-react'
interface Props{
    errors: any
}
const ValidationErrors = ({errors}:Props) => {
    console.log(errors)
    return (
        <Message error={true}>
            {errors&&(
                <Message.List>
                    {errors.map((error:any,i:any)=>( 
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
