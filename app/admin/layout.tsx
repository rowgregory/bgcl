import React, { FC } from "react";
import AdminLayoutClient from "./admin-layout-client";
// import { getAdminData } from "../lib/actions/getAdminData";
import { ILayout } from "@/types/common";

const AdminLayout: FC<ILayout> = async ({ children }) => {
  // Check authentication first
  // const session = await auth();

  // if (!session || !session.user) {
  //   redirect("/login");
  // }

  // Fetch all admin data
  // const result = await getAdminData();

  // If unauthorized (not admin), redirect
  // if (!result.success) {
  //   redirect("/auth/login");
  // }

  // Extract the data
  // const data = {
  //   users: result.data?.users?.users || null,
  //   usersPagination: result.data?.users?.pagination || null,
  //   events: result.data?.events?.events || null,
  //   eventsPagination: result.data?.events?.pagination || null,
  //   heroes: result.data?.heroes || null,
  //   stats: result.data?.stats || null,
  //   user: null,
  // };

  const data = {
    users: null,
    usersPagination: null,
    events: null,
    eventsPagination: null,
    heroes: null,
    stats: null,
    user: null,
  };

  return <AdminLayoutClient data={data}>{children}</AdminLayoutClient>;
};

export default AdminLayout;
