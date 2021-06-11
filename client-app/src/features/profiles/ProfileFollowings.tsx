import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import { Card, Grid, Tab } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import ProfileCard from './ProfileCard';

const ProfileFollowings = () => {
    const {profilesStore}= useStore();
    const {
      profile,
      followings,
      loadingFollowings,
      activeTab,
    } = profilesStore;

   
    return (
      <Tab.Pane loading={loadingFollowings}>
        <Grid>
          <Grid.Column
            width={16}
            content={
              activeTab === 3
                ? `People Following ${profile?.displayName}`
                : `People ${profile?.displayName} is following`
            }
          ></Grid.Column>
          <Grid.Column width={16}>
            <Card.Group itemsPerRow={4}>
              {followings.map((profile) => (
                <ProfileCard key={profile.username} profile={profile} />
              ))}
            </Card.Group>
          </Grid.Column>
        </Grid>
      </Tab.Pane>
    );
}

export default observer(ProfileFollowings)
