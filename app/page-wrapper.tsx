"use client";

import React, { useEffect } from "react";
import { useAppDispatch } from "./redux/store";
import { showToast } from "./redux/features/toastSlice";
import { setHydrateUsers } from "./redux/features/userSlice";
import { IUser } from "@/types/entities";
import Toast from "./components/Toast";

interface PageWrapperProps {
  children: React.ReactNode;
  initialData?: { users: IUser[] };
  error?: { status: number; message: string } | null;
}

export default function PageWrapper({
  children,
  initialData,
  error,
}: PageWrapperProps) {
  const dispatch = useAppDispatch();
  // const path = useCustomPathname()
  // const showLink = !['/admin', '/member', '/auth/custom-callback'].some((str) => path.includes(str))

  useEffect(() => {
    if (error) {
      dispatch(
        showToast({
          type: "error",
          message: "Failed to load data",
          description: error.message,
        })
      );
    } else if (initialData) {
      dispatch(setHydrateUsers(initialData?.users));
    }
  }, [dispatch, initialData, error]);

  return (
    <>
      <Toast />
      {children}
    </>
  );
}
