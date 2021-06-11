import { observer } from "mobx-react-lite";
import React from "react";
import { Tab } from "semantic-ui-react";
import { Profile } from "../../app/models/profile";
import ProfilesStore from "../../app/stores/profilesStore";
import { useStore } from "../../app/stores/store";
import ProfileFollowings from "./ProfileFollowings";
import ProfilePhotos from "./ProfilePhotos";
interface Props {
  profile: Profile;
}
const ProfileContent = ({ profile }: Props) => {
  const {profilesStore}= useStore();

  



  const panes = [
    { menuItem: "About", render: () => <Tab.Pane>About Content</Tab.Pane> },
    {
      menuItem: "Photos",
      render: () => <ProfilePhotos ></ProfilePhotos>,
    },
    { menuItem: "Events", render: () => <Tab.Pane>Events Content</Tab.Pane> },
    {
      menuItem: "Followers",
      render: () => <ProfileFollowings></ProfileFollowings>,
    },
    {
      menuItem: "Following",
      render: () => <Tab.Pane>following Content</Tab.Pane>,
    },
  ];
  return (
    <Tab
      menu={{ fluid: true, vertical: true }}
      menuPosition="right"
      panes={panes}
      onTabChange={(e,data)=>profilesStore.setActiveTab(data.activeIndex)}
    />
  );
};

export default observer(ProfileContent);
