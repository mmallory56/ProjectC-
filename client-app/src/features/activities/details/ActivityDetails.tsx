import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import { Button, Card, Grid, Image } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import ActivityDetailChat from "./ActivityDetailedChat";
import ActivityDetailedHeader from "./ActivityDetailedHeader";
import ActivityDetailedInfo from "./ActivityDetailedInfo";
import ActivityDetailedSideBar from "./ActivityDetailedSideBar";

interface ParamStruc {
  id: string;
}

const ActivityDetails = () => {
  const params = useParams<ParamStruc>();
  const { id } = params;
  const { activityStore } = useStore();
  const {
    selectedActivity: activity,
    loadActivity,
    clearSelectedActivity,
  } = activityStore;
  console.log(params);
  useEffect(() => {
    if (id) {
      loadActivity(id);
    }

    return () => {
      clearSelectedActivity();
    };
  }, [params, loadActivity]);

  if (!activity) return <></>;
  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityDetailedHeader activity={activity}></ActivityDetailedHeader>
        <ActivityDetailedInfo activity={activity} />
        <ActivityDetailChat activityId={activity.id} />
      </Grid.Column>
      <Grid.Column width={6}>
        <ActivityDetailedSideBar activity={activity}></ActivityDetailedSideBar>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDetails);
