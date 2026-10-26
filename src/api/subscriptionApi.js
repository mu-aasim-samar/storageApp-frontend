import { axiosWithCreds } from "./axiosInstances";

export const createSubscription = async (planId) => {
  const { data } = await axiosWithCreds.post("/subscriptions", { planId });
  return data;
};

export const verifySubscription = async (payload) => {
  const { data } = await axiosWithCreds.post("/subscriptions/verify", payload);
  return data;
};

export const cancelSubscription = async ({ reason, feedback }) => {
  const { data } = await axiosWithCreds.post("/subscriptions/cancel", {
    reason,
    feedback,
  });
  return data;
};
