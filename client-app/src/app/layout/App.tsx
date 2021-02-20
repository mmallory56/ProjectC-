import React, { useEffect, useState } from "react";

import axios from "axios";
import { Container, Header } from "semantic-ui-react";
import { Activity } from "../models/activity";
import NavBar from "./NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";

import { v4 as uuidv4 } from "uuid";
import { act } from "react-dom/test-utils";
import agent from "../api/agent";
import LoadingComponent from "./LoadingComponent";

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectActivity, setSelectActivity] = useState<Activity | undefined>(
    undefined
  );
  const [editMode, setEditMode] = useState(false);
  const [loading, SetLoading] = useState(true);
  const [submiting, setSubmiting] = useState(false);

  const handleSelectedActivity = (id: string) => {
    setSelectActivity(activities.find((x) => x.id === id));
  };
  const handleCancelSelectActivity = () => {
    setSelectActivity(undefined);
  };

  const handleFormOpen = (id?: string) => {
    id ? handleSelectedActivity(id) : handleCancelSelectActivity();
    setEditMode(true);
  };
  const handleFormClose = () => {
    setEditMode(false);
  };

  //Edit or Create Activity
  function handleCreateOrEditActivity(activity: Activity) {
    setSubmiting(true);
    if (activity.id) {
      agent.Activities.update(activity).then(() => {
        setActivities([
          ...activities.filter((x) => x.id !== activity.id),
          activity,
        ]);

        setSelectActivity(activity);
        setEditMode(false);
        setSubmiting(false);
      });
    } else {
      activity.id = uuidv4();

      agent.Activities.create(activity).then(() => {
        setActivities([...activities, activity]);
        setSelectActivity(activity);
        setEditMode(false);
        setSubmiting(false);
      });
    }
  }

  //Delete Activity
  function handleDeleteActivity(id: string) {
    setSubmiting(true);
    agent.Activities.delete(id).then(()=>{
       setActivities([...activities.filter((x) => x.id !== id)]);
       setSubmiting(false)
       
    })
   
  }

  useEffect(() => {
    agent.Activities.list().then((response) => {
      let activities: Activity[] = [];
      response.forEach((activity) => {
        activity.date = activity.date.split("T")[0];
        activities.push(activity);
      });
      setActivities(response);
      SetLoading(false);
    });
  }, []);
  if (loading)
    return <LoadingComponent inverted content="loading app"></LoadingComponent>;
  return (
    <>
      <NavBar handleOpenForm={handleFormOpen}></NavBar>

      <Container style={{ marginTop: 80 }}>
        <Header as="h2" icon="users" content="Reactivities" />
        <ActivityDashboard
          activities={activities}
          selectedActivity={selectActivity}
          selectActivity={handleSelectedActivity}
          cancelSelectActivity={handleCancelSelectActivity}
          editMode={editMode}
          openForm={handleFormOpen}
          closeForm={handleFormClose}
          createOrEdit={handleCreateOrEditActivity}
          deleteActivity={handleDeleteActivity}
          submitting={submiting}
        />
      </Container>
    </>
  );
}

export default App;
