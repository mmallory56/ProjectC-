import React from 'react'
import { Dimmer, Loader } from 'semantic-ui-react'

interface Props{
    inverted?:boolean;
    content?:string;
}

const LoadingComponent = ({inverted,content="Loading..."}:Props) => {
    return (
        <Dimmer active={true}>
            <Loader content={content}/>
        </Dimmer>
    )
}

export default LoadingComponent
