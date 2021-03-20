import { observer } from "mobx-react-lite";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { Button, FormField, Header, Label, Segment } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";
import { v4 as uuidv4 } from "uuid";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import MyTextInput from "../../../app/common/form/MyTextInput";
import MyTextArea from "../../../app/common/form/MyTextArea";
import MySelectInput from "../../../app/common/form/MySelectInput";
import { categoryOptions } from "../../../app/common/options/categoryOptions";
import MyDateInput from "../../../app/common/form/MyDateInput";
import { Activity, ActivityFormValues } from "../../../app/models/activity";

interface ParamStruc {
  id: string;
}
const ActivityForm = () => {
  const history = useHistory();
  const { activityStore } = useStore();
  const { loadActivity } = activityStore;
  const {
    selectedActivity,
    createActivity,
    editActivity,
    loading,
    loadingInitial,
  } = activityStore;
  const { id } = useParams<ParamStruc>();
  const [activity, setActivity] = useState<ActivityFormValues>(new ActivityFormValues);

  const validationSchema = Yup.object({
    title: Yup.string().required("The Activity title is required"),
    description: Yup.string().required("The activity description is required"),
    category: Yup.string().required(),
    date: Yup.string().required("Date is Required").nullable(),
    city: Yup.string().required(),
    venue: Yup.string().required(),
  });
  useEffect(() => {
    if (id) loadActivity(id).then((activity) => setActivity(new ActivityFormValues(activity)));
  
  }, [id, loadActivity]);

  const handleSubmit= async(activity:ActivityFormValues)=>{
    if(!activity.id){
      let newActivity = {...activity,id:uuidv4()}
      createActivity(newActivity).then(()=>{
        history.push(`/activities/${newActivity.id}`)
      })
    }else{
      editActivity(activity).then(()=>{
        history.push(`/activities/${activity.id}`)
      })
    }
  }

  
  if (loadingInitial) return <LoadingComponent></LoadingComponent>;

  return (
    <Segment clearing>
      <Header content="Activity Details" sub color="teal" />
      <Formik
        validationSchema={validationSchema}
        initialValues={activity}
        onSubmit={(values) => handleSubmit(values)}
        enableReinitialize
      >
        {({ handleSubmit,isValid,isSubmitting,dirty }) => (
          <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
            <MyTextInput name="title" placeholder="Title" />
            <MyTextArea rows={5} placeholder="Description" name="description" />
            <MySelectInput
              options={categoryOptions}
              placeholder="category"
              name="category"
            />
            <MyDateInput
              placeholderText="Date"
              name="date"
              showTimeSelect
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
            />
            <Header content="Location Details" sub color="teal" />
            <MyTextInput placeholder="City" name="city" />
            <MyTextInput placeholder="Venue" name="venue" />
            <Button
            disabled={isSubmitting||!isValid||!dirty}
              loading={isSubmitting}
              floated="right"
              positive
              type="submit"
              content="Submit"
              onSubmit={handleSubmit}
            />
            <Button
              floated="right"
              positive
              type="button"
              content="Cancel"
              as={Link}
              to="/Activities"
            />
          </Form>
        )}
      </Formik>
    </Segment>
  );
};

export default observer(ActivityForm);
