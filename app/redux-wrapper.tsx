"use client";

import React from "react";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import PageWrapper from "./page-wrapper";
import { IHeroEntity } from "@/types/entities/hero";

interface ReduxWrapperProps {
  children: React.ReactNode;
  data: { hero: IHeroEntity | null };
}

export default function ReduxWrapper({ children, data }: ReduxWrapperProps) {
  return (
    <Provider store={store}>
      <PageWrapper data={data}>{children}</PageWrapper>
    </Provider>
  );
}
