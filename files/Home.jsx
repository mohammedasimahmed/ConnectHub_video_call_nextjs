import React, { Suspense, lazy } from "react";
const ConnectHub = lazy(() => import("@/components/ConnectHub"));

const Home = () => {
  return (
    <>
      <Suspense fallback={<div className="text-white">Loading...</div>}>
        <ConnectHub />
      </Suspense>
    </>
  );
};

export default Home;
