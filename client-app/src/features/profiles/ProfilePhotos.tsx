import { observer } from "mobx-react-lite";
import React, { SyntheticEvent, useState } from "react";
import {
  Button,
  ButtonGroup,
  Card,
  Grid,
  Header,
  Image,
  Tab,
} from "semantic-ui-react";
import { PhotoUploadWidget } from "../../app/common/imageUpload/PhotoUploadWidget";
import { Photo, Profile } from "../../app/models/profile";
import { useStore } from "../../app/stores/store";
interface Props {
  profile: Profile;
}
const ProfilePhotos = () => {
  const { profilesStore, userStore } = useStore();
  const {
    profile,
    isCurrentUser,
    uploadPhoto,
    uploading,
    loading,
    setMainPhoto,
    deletePhoto,
    loadingDelete
  } = profilesStore;
  const [addPhotoMode, setAddPhotoMode] = useState(false);
const [target, setTarget] = useState<any>("");
  const handlePhotoUpload = (file: any) => {
    uploadPhoto(file).then(() => setAddPhotoMode(false));
  };

  const handleSetMainPhoto=(photo:Photo,e: SyntheticEvent<HTMLButtonElement>) =>{
    setTarget(e.currentTarget);
    setMainPhoto(photo);
  }
  
  const handleDeletePhoto = (
    photo: Photo,
    e: SyntheticEvent<HTMLButtonElement>
  ) => {
    if(window.confirm('Are you sure you want to delete')){
       setTarget(e.currentTarget);
    deletePhoto(photo.id);
    }
   
  };
  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16}>
          <Header floated="left" icon="image" content="Photos" />
          {isCurrentUser && (
            <Button
              floated="right"
              basic
              onClick={() => setAddPhotoMode(!addPhotoMode)}
            >
              {addPhotoMode ? "Cancel" : "Add Photo"}
            </Button>
          )}
        </Grid.Column>
        <Grid.Column width={16}>
          {addPhotoMode ? (
            <PhotoUploadWidget
              uploading={uploading}
              handlePhotoUpload={handlePhotoUpload}
            />
          ) : (
            profile && (
              <Card.Group itemsPerRow={5}>
                {profile.photos?.map((photo) => (
                  <Card key={photo.id}>
                    <Image src={photo.url}></Image>
                    {isCurrentUser && (
                      <Button.Group fluid widths={2}>
                        <Button
                          basic
                          color="green"
                          name={photo.id}
                          disabled={photo.isMain}
                          onClick={(e) => handleSetMainPhoto(photo, e)}
                          loading={target === photo.id && loading}
                        >
                          Main
                        </Button>
                        <Button
                          loading={target === photo.id && loading}
                          onClick={(e) => handleDeletePhoto(photo, e)}
                          color="red"
                          icon="trash"
                          content="Delete"
                        />
                      </Button.Group>
                    )}
                  </Card>
                ))}
              </Card.Group>
            )
          )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default observer(ProfilePhotos);
