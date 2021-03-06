import React from "react";
import Head from "next/head";
import { NextPage } from "next";
import { useNavigationContext } from "@contexts/hooks";

const Activity: NextPage = () => {
  const { useMountPage } = useNavigationContext();
  useMountPage((page) => page.ACTIVITY);

  return (
    <div>
      <Head>
        <title>활동 | Slam - 우리 주변 농구장을 빠르게</title>
      </Head>
      Activity
    </div>
  );
};

export default Activity;
