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

function App() {
  const location = useLocation();
  return (
    <>
      <ToastContainer position="bottom-right" hideProgressBar />
      <Route path="/" exact component={HomePage}></Route>

      <Route path={"/(.+)"}>
        <>
          <NavBar></NavBar>
          <Container style={{ marginTop: 80 }}>
            <Switch>
              {" "}
              <Route path="/activities/:id" component={ActivityDetails}></Route>
              <Route
                exact
                path="/activities"
                component={ActivityDashboard}
              ></Route>
              <Route
                key={location.key}
                path={["/createActivity", "/manage/:id"]}
                component={ActivityForm}
              ></Route>
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
