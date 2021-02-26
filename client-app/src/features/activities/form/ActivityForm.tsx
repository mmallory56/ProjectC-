import { observer } from "mobx-react-lite";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { Button, Form, Segment } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";
import { v4 as uuidv4 } from "uuid";

interface ParamStruc {
  id: string;
}
const ActivityForm = () => {
  const history = useHistory()
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
  const [activity, setActivity] = useState({
    id: "",
    title: "",
    category: "",
    description: "",
    date: "",
    city: "",
    venue: "",
  });
  useEffect(() => {
    if (id) loadActivity(id).then((activity) => setActivity(activity!));
  return  ()=>{
      setActivity({id: "",
    title: "",
    category: "",
    description: "",
    date: "",
    city: "",
    venue: "",})
    }
  }, [id, loadActivity]);

  function handleSubmit() {
    if(activity.id.length ===0 ){
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
  function handleInputChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;
    setActivity({ ...activity, [name]: value });
  }
  if (loadingInitial) return <LoadingComponent></LoadingComponent>;

  return (
    <Segment clearing>
      <Form onSubmit={handleSubmit} autoComplete="off">
        <Form.Input
          placeholder="Title"
          value={activity.title}
          name="title"
          onChange={handleInputChange}
        />
        <Form.TextArea
          placeholder="Description"
          value={activity.description}
          name="description"
          onChange={handleInputChange}
        />
        <Form.Input
          placeholder="category"
          value={activity.category}
          name="category"
          onChange={handleInputChange}
        />
        <Form.Input
          type="Date"
          placeholder="Date"
          value={activity.date}
          name="date"
          onChange={handleInputChange}
        />
        <Form.Input
          placeholder="City"
          value={activity.city}
          name="city"
          onChange={handleInputChange}
        />
        <Form.Input
          placeholder="Venue"
          value={activity.venue}
          name="venue"
          onChange={handleInputChange}
        />
        <Button
          loading={loading}
          floated="right"
          positive
          type="submit"
          content="Submit"
          onClick={handleSubmit}
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
    </Segment>
  );
};

export default observer(ActivityForm);
