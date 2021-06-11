import React, { useEffect } from "react";

import { Container, Header } from "semantic-ui-react";
import NavBar from "./NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";

import LoadingComponent from "./LoadingComponent";
import { useStore } from "../stores/store";
import { observer } from "mobx-react-lite";
import { Route, Router, Switch, useLocation } from "react-router-dom";
import HomePage from "../../features/activities/Home/HomePage";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/activities/details/ActivityDetails";
import TestErrors from "../../features/errors/TestError";
import { ToastContainer } from "react-toastify";
import NotFound from "../../features/errors/NotFound";
import ServerError from "../../features/errors/ServerError";

import ModalContainer from "../common/modals/ModalContainer";
import ProfilePage from "../../features/profiles/ProfilePage";
import PrivateRoute from "./PrivateRoute"
function App() {
  const location = useLocation();
  const { commonStore, userStore } = useStore();

useEffect(() => {
  if(commonStore.token){
    userStore.getUser().finally(()=>commonStore.setAppLoaded());

  }else{
    commonStore.setAppLoaded();
  }
  return () => {
    
  }
}, [commonStore,userStore])


if(!commonStore.appLoaded)return <LoadingComponent content="Loading App..."/>

  return (
    <>
    <ModalContainer></ModalContainer>
      <ToastContainer position="bottom-right" hideProgressBar />
      <Route path="/" exact component={HomePage}></Route>

      <Route path={"/(.+)"}>
        <>
          <NavBar></NavBar>
          <Container style={{ marginTop: 80 }}>
            <Switch>
              {" "}
              <PrivateRoute path="/activities/:id" component={ActivityDetails}></PrivateRoute>
              <PrivateRoute
                exact
                path="/activities"
                component={ActivityDashboard}
              ></PrivateRoute>
              <PrivateRoute
                key={location.key}
                path={["/createActivity", "/manage/:id"]}
                component={ActivityForm}
              ></PrivateRoute>
              <PrivateRoute path={`/profile/:username`} component={ProfilePage}></PrivateRoute>
              <Route path="/errors" component={TestErrors}></Route>
              <Route path="/server-error" component={ServerError}></Route>
              
              <Route component={NotFound} />
            </Switch>
          </Container>
        </>
      </Route>
    </>
  );
}

export default observer(App);
