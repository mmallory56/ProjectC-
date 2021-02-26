import { observer } from 'mobx-react-lite';
import React, { Fragment } from 'react'
import { Header, Item, Segment } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import ActivityListItem from './ActivityListItem';




const ActivityList = () => { 
  
  const {activityStore} = useStore();
  const {ActivitiesByDate,groupedActivities} = activityStore;
  
    return (
      <>
      {groupedActivities.map(([group,activities])=>(
        <Fragment key={group}>
          <Header sub color="teal">
            {group}
          </Header>
          {activities.map((activity) => {
              return (
                <ActivityListItem key={activity.id} activity={activity}></ActivityListItem>
              );
            })}
        </Fragment>
      ))}
      
      
      
        
      </>
    
    )
}

export default observer(ActivityList)
