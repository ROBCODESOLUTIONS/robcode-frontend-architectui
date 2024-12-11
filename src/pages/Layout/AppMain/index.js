import { Route, Redirect } from "react-router-dom";
import React, { lazy, Fragment } from "react";
import Loader from "react-loaders";
import { Suspense } from "react";

import { ToastContainer } from "react-toastify";

const UserPages = lazy(() => import("../../UserPages"));
const Dashboards = lazy(() => import("../../Dashboard"));

const AppMain = () => {

    return (
        <Fragment>

            {/* Pages */}
            <Suspense fallback={
                <div className="loader-container">
                    <div className="loader-container-inner">
                        <div className="text-center">
                            <Loader type="ball-pulse-rise" />
                        </div>
                        <h6 className="mt-5">
                            Please wait while we load all the Components
                        </h6>
                    </div>
                </div>
            }>
                <Route path="/pages" component={UserPages} />
                <Route path="/pages/dashboard" component={Dashboards} />

                <Route exact path="/" render={() => (
                    <Redirect to="/pages/dashboard/main" />
                )} />
            </Suspense>
            <ToastContainer />
        </Fragment>
    )
};

export default AppMain;
