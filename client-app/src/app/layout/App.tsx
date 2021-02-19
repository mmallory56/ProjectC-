import React, { useEffect, useState } from "react";

import axios from "axios";
import { Container, Header } from "semantic-ui-react";
import { Activity } from "../models/activity";
import NavBar from "./NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";

import { v4 as uuidv4 } from "uuid";
import { act } from "react-dom/test-utils";

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectActivity, setSelectActivity] = useState<Activity | undefined>(
    undefined
  );
  const [editMode, setEditMode] = useState(false);

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
  function handleCreateOrEditActivity(activity: Activity) {
    activity.id
      ? setActivities([
          ...activities.filter((x) => x.id !== activity.id),
          activity,
        ])
      : setActivities([...activities, { ...activity, id: uuidv4() }]);
    setEditMode(false);
    setSelectActivity(activity);
  }
  function handleDeleteActivity(id:string){
    setActivities([...activities.filter(x=>x.id!==id)])
  }

  useEffect(() => {
    axios
      .get<Activity[]>("https://localhost:5001/api/activities")
      .then((response) => {
        setActivities(response.data);
      });
  }, []);
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
        />
      </Container>
    </>
  );
}

export default App;
