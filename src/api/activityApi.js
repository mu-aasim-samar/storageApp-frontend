import { axiosWithCreds } from "./axiosInstances";

export const getActivities = async (userId = null) => {
  const url = userId ? `/activity?userId=${userId}` : "/activity";
  const { data } = await axiosWithCreds.get(url);
  return data;
};

export const markActivitiesAsRead = async () => {
  const { data } = await axiosWithCreds.patch("/activity/read");
  return data;
};
