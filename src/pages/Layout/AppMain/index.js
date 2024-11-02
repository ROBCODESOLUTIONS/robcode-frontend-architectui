import { Route, Redirect } from "react-router-dom";
import React, { Suspense, lazy, Fragment } from "react";
import Loader from "react-loaders";

import { ToastContainer } from "react-toastify";

const UserPages = lazy(() => import("../../UserPages"));
// const Applications = lazy(() => import("../../DemoPages/Applications"));
// const Dashboards = lazy(() => import("../../DemoPages/Dashboards"));

// const Widgets = lazy(() => import("../../DemoPages/Widgets"));
// const Elements = lazy(() => import("../../DemoPages/Elements"));
// const Components = lazy(() => import("../../DemoPages/Components"));
// const Charts = lazy(() => import("../../DemoPages/Charts"));
// const Forms = lazy(() => import("../../DemoPages/Forms"));
// const Tables = lazy(() => import("../../DemoPages/Tables"));


const AppMain = () => {

    return (
        <Fragment>

            {/* Pages */}
            <Route path="/pages" component={UserPages}/>

            <Route exact path="/" render={() => (
                <Redirect to="/pages/login"/>
            )}/>
            <ToastContainer />
        </Fragment>
    )
};

export default AppMain;
