import { format } from "date-fns";
import { observer } from "mobx-react-lite";
import React, { SyntheticEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Icon, Item, Label, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import { useStore } from "../../../app/stores/store";
import ActivityListItemAttendee from "./ActivityListItemAttendee";
interface Props {
  activity: Activity;
}
const ActivityListItem = ({ activity }: Props) => {
  const { activityStore } = useStore();
  const { deleteActivity, ActivitiesByDate, loading } = activityStore;
  const [target, setTarget] = useState("");

  function handleActivityDelete(
    e: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) {
    setTarget(e.currentTarget.name);
    deleteActivity(id);
  }
  return (
    <Segment.Group>
      <Segment>
        {activity.isCancelled&&(
          <Label attached="top" color="red" content="Activity has been Canceled"style={{textAlign: "center",}} />
        )}
        <Item.Group>
          <Item>
            <Item.Image
              size="tiny"
              circular
              src={`/assets/user.png`}
            ></Item.Image>
          </Item>
          <Item.Content>
            <Item.Header as={Link} to={`/activities/${activity.id}`}>
              {activity.title}{" "}
            </Item.Header>
            <Item.Description>Hosted by {activity.host?.displayName}</Item.Description>
            {activity.isHost&&(
              <Item.Description>
                <Label basic color="orange">
                  Your Are hosting this activity
                </Label>
              </Item.Description>
            )}
            {activity.isGoing && !activity.isHost &&(
              <Item.Description>
                <Label basic color="green">
                  Your are attending this activity
                </Label>
              </Item.Description>
            )}
          </Item.Content>
        </Item.Group>
      </Segment>
      <Segment>
        <span>
          <Icon name="clock"></Icon>
          {format( activity.date!,"dd MMM yyyy h:mm aa")}
          <Icon name="marker" />
          {activity.venue}
        </span>
      </Segment>
      <Segment secondary>
       <ActivityListItemAttendee attendees={activity.attendees!}></ActivityListItemAttendee>
      </Segment>
      <Segment clearing>
        <span>{activity.description}</span>
        <Button 
          as={Link}
          to={`/activities/${activity.id}`}
          color="teal"
          floated="right"
          content="view"
          ></Button>
      </Segment>
    </Segment.Group>
  );
};

export default observer(ActivityListItem);
