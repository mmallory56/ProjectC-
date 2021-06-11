import React, { useEffect, useState } from "react";
import { Button, Grid, Header, Image } from "semantic-ui-react";
import PhotoWidgetCropper from "./PhotoWidgetCropper";
import PhotoWidgetDropZone from "./PhotoWidgetDropZone";
interface Props{
    handlePhotoUpload: (file:any)=>void;
    uploading: boolean;
}
export const PhotoUploadWidget = ({handlePhotoUpload,uploading}:Props) => {
  const [files, setFiles] = useState<any[]>([]);
  const [cropper, setCropper] = useState<Cropper>();

  function onCrop() {
    if (cropper) {
      cropper.getCroppedCanvas().toBlob((blob) => handlePhotoUpload(blob));
    }
  }
  useEffect(() => {
    return () => {
      files.forEach((file: any) => URL.revokeObjectURL(file.preview));
    };
  }, [files]);
  return (
    <Grid>
      <Grid.Column width={4}>
        <Header sub color="teal" content="Step 1 - Add Photo" />
        <PhotoWidgetDropZone setFiles={setFiles} />
      </Grid.Column>
      <Grid.Column width={1} />
      <Grid.Column width={4}>
        <Header sub color="teal" content="Step 2 - Resize Image" />
        {files && files.length > 0 && (
          <PhotoWidgetCropper
            setCropper={setCropper}
            imagePreview={files[0].preview}
          />
        )}
      </Grid.Column>
      <Grid.Column width={1} />
      <Grid.Column width={4}>
        <Header sub color="teal" content="Step 3 - Preview & Upload" />
        <><div
          className="img-preview"
          style={{ minHeight: 200, overflow: "hidden", width: "100%" }}
        />

        {files &&files.length>0&&(
<Button.Group widths={2}>
            <Button loading={uploading} onClick={onCrop} positive icon="check" color="green"/>
            <Button disabled={uploading} onClick={()=>setFiles([])} icon="close"color="red"/>
        </Button.Group>
        )}
        
        </>
        
      </Grid.Column>
      <Grid.Column width={1} />
    </Grid>
  );
};
