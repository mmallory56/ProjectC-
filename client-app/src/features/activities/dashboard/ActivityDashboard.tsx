import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react'
import { Grid } from 'semantic-ui-react'
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/stores/store';
import ActivityDetails from '../details/ActivityDetails';
import ActivityForm from '../form/ActivityForm';
import ActivityFilters from './ActivityFilters';
import ActivityList from './ActivityList';



const ActivityDashboard = () => {
  const {activityStore} = useStore();
  const {selectedActivity,editMode,activityRegistry} = activityStore;
  
  

  useEffect(() => {
    if(activityRegistry.size===0)
    activityStore.loadactivities();
  }, [activityStore,activityRegistry]);

  if (activityStore.loadingInitial)
    return <LoadingComponent inverted content="loading app"></LoadingComponent>;
    return (
      <Grid>
        <Grid.Column width="10">
          <ActivityList
           
          />
        </Grid.Column>
        <Grid.Column width="6">
        <ActivityFilters></ActivityFilters>
        </Grid.Column>
      </Grid>
    );
}

export default observer(ActivityDashboard)

