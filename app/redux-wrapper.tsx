"use client";

import React from "react";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import PageWrapper from "./page-wrapper";
import { IUser } from "@/types/entities";

interface ReduxWrapperProps {
  children: React.ReactNode;
  initialData?: { users: IUser[] };
  error?: { status: number; message: string } | null;
}

export default function ReduxWrapper({
  children,
  initialData,
  error,
}: ReduxWrapperProps) {
  return (
    <Provider store={store}>
      <PageWrapper initialData={initialData} error={error}>
        {children}
      </PageWrapper>
    </Provider>
  );
}
