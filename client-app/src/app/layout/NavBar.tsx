import React from 'react'
import { Button, Container, Menu } from 'semantic-ui-react'
interface Props{
    handleOpenForm:(id?:string|undefined)=>void;
}
const NavBar = ({handleOpenForm}:Props) => {
    return (
        <Menu inverted fixed="top">
            <Container>
                <Menu.Item header > 
                    <img src="/assets/logo.png" alt=""style={{marginRight:"10px"}}/>
                    Reactivities
                </Menu.Item>
                <Menu.Item name="activities"/>
                <Menu.Item>
                    <Button positive content="Create Activity" onClick={()=>handleOpenForm()}/>
                </Menu.Item>
            </Container>
        </Menu>
    )
}

export default NavBar
