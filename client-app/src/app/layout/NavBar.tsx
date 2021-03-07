import React from 'react'
import { NavLink } from 'react-router-dom';
import { Button, Container, Menu } from 'semantic-ui-react'
import { useStore } from '../stores/store'
interface Props{
   
}
const NavBar = ({}:Props) => {

    const {activityStore} = useStore();
    return (
      <Menu inverted fixed="top">
        <Container>
          <Menu.Item as={NavLink} to="/" exact header>
            <img
              src="/assets/logo.png"
              alt=""
              style={{ marginRight: "10px" }}
            />
            Reactivities
          </Menu.Item>
          <Menu.Item as={NavLink} to="/activities" name="Activities" />
          <Menu.Item as={NavLink} to="/errors" name="Errors" />
          <Menu.Item>
            <Button
              positive
              content="Create Activity"
              as={NavLink}
              to="/createActivity"
            />
          </Menu.Item>
        </Container>
      </Menu>
    );
}

export default NavBar
