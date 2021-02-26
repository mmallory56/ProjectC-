import React, { useEffect } from "react";

import { Container, Header } from "semantic-ui-react";
import NavBar from "./NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";

import LoadingComponent from "./LoadingComponent";
import { useStore } from "../stores/store";
import { observer } from "mobx-react-lite";
import { Route, useLocation } from "react-router-dom";
import HomePage from "../../features/activities/Home/HomePage";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/activities/details/ActivityDetails";

function App() {
const location =useLocation();
  return (
    <>
     <Route path="/" exact component={HomePage}></Route>
     
    <Route
    path={'/(.+)'}
  
      
    ><> 
    <NavBar></NavBar>
       <Container style={{ marginTop: 80 }}>
       
        
        <Route path="/activities/:id" component={ActivityDetails}></Route>
        <Route exact path="/activities" component={ActivityDashboard}></Route>
        <Route key={location.key} path={["/createActivity",'/manage/:id']} component={ActivityForm}></Route>
      </Container>
      </>
  
    </Route>
     
    </>
  );
}

export default observer(App); 
