import React, { FC, ReactNode } from "react";
// import { cookies } from "next/headers";
import AdminLayoutClient from "./admin-layout-client";

// const asyncFetch = async (
//   apiPath: string,
//   fetchOptions: RequestInit | undefined
// ) => {
//   const response = await fetch(
//     `${process.env.NEXTAUTH_URL}/api/admin/${apiPath}`,
//     fetchOptions
//   );

//   return response;
// };

const AdminLayout: FC<{ children: ReactNode }> = async ({ children }) => {
  //   const cookieStore = await cookies();

  //   const fetchOptions = {
  //     cache: "no-store" as RequestCache,
  //     headers: {
  //       "Content-Type": "application/json",
  //       Cookie: cookieStore.toString(),
  //     },
  //   };

  //   const adminOverviewResponse = await asyncFetch("overview", fetchOptions);
  //   console.log("Admin overview response status:", adminOverviewResponse.status);

  //   if (!adminOverviewResponse.ok) {
  //     const errorText = await adminOverviewResponse.text();
  //     console.error("Admin API error:", errorText);
  //     return <div>Error loading admin overview</div>;
  //   }

  //   const data = await adminOverviewResponse.json();
  const data = { users: null, user: null };

  return <AdminLayoutClient data={data}>{children}</AdminLayoutClient>;
};

export default AdminLayout;
