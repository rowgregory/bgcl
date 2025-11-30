"use client";

import React from "react";
import Toast from "./components/common/Toast";
import { IHeroEntity } from "@/types/entities/hero";

interface PageWrapperProps {
  children: React.ReactNode;
  data: { hero: IHeroEntity | null }; // Changed to accept null
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function PageWrapper({ children, data }: PageWrapperProps) {
  return (
    <>
      <Toast />
      {children}
    </>
  );
}
