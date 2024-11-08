import React, { Fragment } from "react";
import { Route } from "react-router-dom";

// DASHBOARDS

// import AnalyticsDashboard from "./Analytics/";
// import SalesDashboard from "./Sales/";
// import CommerceDashboard from "./Commerce/";
// import CRMDashboard from "./CRM/";
import MinimalDashboard from "./Minimal/Variation1";
// import MinimalDashboard2 from "./Minimal/Variation2";

// Layout

import AppHeader from "../Layout/AppHeader/";
import AppSidebar from "../Layout/AppSidebar/";

// Theme Options
import ThemeOptions from "../../Layout/ThemeOptions/";

const Dashboards = ({ match }) => (
  <Fragment>
    <ThemeOptions />
    <AppHeader />
    <div className="app-main">
      <AppSidebar />
      <div className="app-main__outer">
        <div className="app-main__inner">
          {/* <Route path={`${match.url}/analytics`} component={AnalyticsDashboard}/>
          <Route path={`${match.url}/sales`} component={SalesDashboard} />
          <Route path={`${match.url}/commerce`} component={CommerceDashboard} />
          <Route path={`${match.url}/crm`} component={CRMDashboard} /> */}
          <Route path={`${match.url}/main`} component={MinimalDashboard}/>
          {/* <Route path={`${match.url}/minimal-dashboard-2`} component={MinimalDashboard2}/> */}
        </div>
      </div>
    </div>
  </Fragment>
);

export default Dashboards;
