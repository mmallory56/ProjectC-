import { format } from "date-fns";
import {
  action,
  makeAutoObservable,
  makeObservable,
  observable,
  reaction,
  runInAction,
} from "mobx";
import { act } from "react-dom/test-utils";
import agent from "../api/agent";
import { Activity, ActivityFormValues } from "../models/activity";
import { Pagination, PagingParams } from "../models/pagination";
import { Profile } from "../models/profile";
import { store } from "./store";

export default class ActivityStore {
  activityRegistry = new Map<string, Activity>();
  selectedActivity: Activity | undefined = undefined;
  editMode = false;
  loading = false;
  loadingInitial = false;
  pagination:Pagination|null=null;
  pagingParams=new PagingParams(1);
  predicate = new Map().set("all",true);
  constructor() {
    makeAutoObservable(this);

    reaction(()=>this.predicate.keys(),()=>{
      this.pagingParams = new PagingParams();
      this.activityRegistry.clear();
      this.loadactivities();
    }

    )
  }
  setPagingParams=(pagingParams:PagingParams)=>{
    this.pagingParams = pagingParams;
  }

  setPredicate=(predicate:string,value:string|Date)=>{
    const resetPredicate = ()=>{
      this.predicate.forEach((value,key)=>{
        if(key !=='startDate')this.predicate.delete(key);

      })
    }
        switch (predicate) {
          case "all":
            resetPredicate();
            this.predicate.set("all",true);
            break;
          case "isGoing":
            resetPredicate();
            this.predicate.set("isGoing",true);
            break;
          case "isHost":
            resetPredicate();
            this.predicate.set("isHost",true);
            break;
          case "startDate":
            
            this.predicate.delete("startDate");
            this.predicate.set("startDate",value);
            break;
          default:
            break;
        }
  }

  get axiosParams(){
    const params = new URLSearchParams();
    params.append('pageNumber',this.pagingParams.pageNumber.toString())
    params.append("pageSize",this.pagingParams.pageSize.toString());
    this.predicate.forEach((value,key)=>{
      if(key==="start"){
        params.append(key,(value as Date).toISOString())
      }else{
        params.append(key,value);
      }
    })
    return params;
  }
  get ActivitiesByDate() {
    return Array.from(this.activityRegistry.values()).sort(
      (a, b) => a.date!.getTime() - b.date!.getTime()
    );
  }
  loadactivities = async () => {
    this.setLoadingInitial(true);
    try {
      const result = await agent.Activities.list(this.axiosParams);
      runInAction(() => {
        result.data.forEach((activity) => {
          this.setActivity(activity);
        });
        this.setPagination(result.pagination)
        this.setLoadingInitial(false);
      });
    } catch (error) {
      console.log(error);
      this.setLoadingInitial(false);
    }
  };
  setPagination =(pagination:Pagination)=>{
      this.pagination = pagination;
  }
  get groupedActivities() {
    return Object.entries(
      this.ActivitiesByDate.reduce((activities, activity) => {
        const date = format(activity.date!, "dd MMM yyyy");
        activities[date] = activities[date]
          ? [...activities[date], activity]
          : [activity];
        return activities;
      }, {} as { [key: string]: Activity[] })
    );
  }
  loadActivity = async (id: string) => {
    let activity = this.getActivity(id);
    if (activity) {
      this.selectedActivity = activity;
      return activity;
    } else {
      this.loadingInitial = true;
      try {
        activity = await agent.Activities.details(id);
        this.setActivity(activity);
        this.selectedActivity = activity;
        this.setLoadingInitial(false);
        return activity;
      } catch (error) {
        console.log(error);
        this.setLoadingInitial(false);
      }
    }
  };
  private setActivity = (activity: Activity) => {
    const user = store.userStore.user;
    if (user) {
      activity.isGoing = activity.attendees!.some(
        (a) => a.username === user.username
      );
      activity.isHost = activity.hostUsername === user.username;
      activity.host = activity.attendees?.find((a)=>a.username===activity.hostUsername)
    }

    activity.date = new Date(activity.date!);
    this.activityRegistry.set(activity.id, activity);
  };
  private getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  };
  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  };
  setLoading = (state: boolean) => {
    this.loading = state;
  };

  createActivity = async (activity: ActivityFormValues) => {
    const user = store.userStore.user;
    const attendee = new Profile(user!);
    try {
      await agent.Activities.create(activity);
      const newActivity = new Activity(activity);
      newActivity.hostUsername = user!.username;
      newActivity.attendees = [attendee];
      this.setActivity(newActivity);
      runInAction(() => {
       
        this.selectedActivity = newActivity;
        
      });
   
    } catch (error) {
      console.log(error);
    
    }
  };
  editActivity = async (activity: ActivityFormValues) => {
   
    try {
      await agent.Activities.update(activity);
      runInAction(() => {
        if(activity.id){
          let editedActivity = {...this.getActivity(activity.id),...activity}
           this.activityRegistry.set(activity.id, editedActivity as Activity);
           this.selectedActivity = editedActivity as Activity;
        }
       
        
      
      });
     
    } catch (error) {
      console.log(error);
    
    }
  };
  deleteActivity = async (id: string) => {
    this.setLoading(true);
    try {
      await agent.Activities.delete(id);
      runInAction(() => {
        this.activityRegistry.delete(id);
      });
      this.setLoading(false);
    } catch (error) {
      console.log(error);
      this.setLoading(false);
    }
  };
  updateAttendance = async () =>{
    const user = store.userStore.user;
    this.loading = true;
    try{
      await agent.Activities.attend(this.selectedActivity!.id)
      runInAction(() =>{
        if(this.selectedActivity?.isGoing){
          this.selectedActivity.attendees = this.selectedActivity.attendees?.filter(a=> a.username !==user?.username)
          this.selectedActivity.isGoing = false;
        }else{
          const attendee = new Profile(user!)
          this.selectedActivity?.attendees?.push(attendee);
          this.selectedActivity!.isGoing = true;
        }
        this.activityRegistry.set(this.selectedActivity!.id,this.selectedActivity!)
      })
    }catch(error){
      console.log(error);
    }
    finally{
      runInAction(() =>this.loading=false);
    }
  }
  cancelActivityToggle=async()=>{
    this.loading=true;
    try{
      await agent.Activities.attend(this.selectedActivity!.id);
      runInAction(() =>{
        this.selectedActivity!.isCancelled = !this.selectedActivity!.isCancelled;
        this.activityRegistry.set(this.selectedActivity!.id,this.selectedActivity!);
      })
    }catch(error){
      console.log(error);
    }finally{
      runInAction(() =>this.loading=false)
    }
  }
  clearSelectedActivity =()=>{
    this.selectedActivity = undefined;
  }
  updateAttendeeFollowing = (username:string) =>{
    this.activityRegistry.forEach(activity=> {
      activity.attendees.forEach(attendee=>{
        if(attendee.username===username){
          attendee.following?attendee.followersCount--:attendee.followersCount++;
          attendee.following= !attendee.following;
          

        }
      })
    })
  }
}
