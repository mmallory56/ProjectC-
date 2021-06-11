import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { Button, Grid, Loader } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { PagingParams } from "../../../app/models/pagination";
import { useStore } from "../../../app/stores/store";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";
import ActivityFilters from "./ActivityFilters";
import ActivityList from "./ActivityList";
import InfiniteScroll from "react-infinite-scroller";
import ActivityStore from "../../../app/stores/activityStore";
import ActivityListItemPlaceholder from "./ActivityListItemPlaceHolder";
const ActivityDashboard = () => {
  const { activityStore } = useStore();
  const {
    selectedActivity,
    editMode,
    activityRegistry,
    setPagination,
    pagination,
    setPagingParams,
    loadactivities,
  } = activityStore;

  const [loadingNext, setLoadingNext] = useState(false);

  function handleGetNext() {
    setLoadingNext(true);
    setPagingParams(new PagingParams(pagination!.currentPage + 1));
    loadactivities().then(() => setLoadingNext(false));
  }

  useEffect(() => {
    if (activityRegistry.size === 0) activityStore.loadactivities();
  }, [activityStore, activityRegistry]);

  
  return (
    <Grid>
      <Grid.Column width="10">
        {activityStore.loadingInitial &&!loadingNext?(
          <>
          <ActivityListItemPlaceholder></ActivityListItemPlaceholder>
          <ActivityListItemPlaceholder></ActivityListItemPlaceholder>
          </>
        ): <InfiniteScroll
          pageStart={0}
          loadMore={handleGetNext}
          hasMore={
            !loadingNext &&
            !!pagination &&
            pagination.currentPage < pagination.totalPages
          }
          initialLoad={false}
          
        >
          <ActivityList />
        </InfiniteScroll>}
       
      </Grid.Column>
      <Grid.Column width="6">
        <ActivityFilters></ActivityFilters>
      </Grid.Column>
      <Grid.Column width={10}>
        <Loader active ={loadingNext}/>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDashboard);
