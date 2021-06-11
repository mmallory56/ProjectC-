import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { useParams } from "react-router";
import { Grid } from "semantic-ui-react";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { Profile } from "../../app/models/profile";
import { useStore } from "../../app/stores/store";
import ProfileContent from "./ProfileContent";
import ProfileHeader from "./ProfileHeader";

const ProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const { profilesStore } = useStore();
  console.log(profilesStore);

  const { loadingProfile, loadProfile, profile,setActiveTab } = profilesStore;

  useEffect(() => {
    loadProfile(username);
    return ()=>{
      setActiveTab(0)
    }
  }, [loadProfile, username]);

  if (loadingProfile)
    return <LoadingComponent content="loading profile..."></LoadingComponent>;
  return (
    <Grid>
      <Grid.Column width={16}>
        {profile && (
          <>
            {}

            <ProfileHeader profile={profile}></ProfileHeader>
            <ProfileContent profile={profile} />
          </>
        )}
      </Grid.Column>
    </Grid>
  );
};

export default observer(ProfilePage);
