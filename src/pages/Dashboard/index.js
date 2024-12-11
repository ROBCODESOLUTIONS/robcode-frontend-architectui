import React, { Fragment } from "react";
import { Route } from "react-router-dom";

// DASHBOARDS

// import AnalyticsDashboard from "./Analytics/";
// import SalesDashboard from "./Sales/";
// import CommerceDashboard from "./Commerce/";
// import CRMDashboard from "./CRM/";
import HomeIndex from "./Home/index";

import EntitiesIndex from "./Entities/index";
import EntitiesCreate from "./Entities/createUpdate";


import StudentsIndex from "./Students/index";
import TeachersIndex from "./Teachers/index";
import CoursesIndex from "./Courses/index";
import ResourcesIndex from "./Resources/index";
import MaterialIndex from "./Material/index";

// Layout
import AppHeader from "../Layout/AppHeader";
import AppSidebar from "../Layout/AppSidebar";

// Theme Options
// import ThemeOptions from "../../Layout/ThemeOptions/";

const Dashboards = ({ match }) => (
  <Fragment>
    {/* <ThemeOptions /> */}
    <AppHeader />
    <div className="app-main">
      <AppSidebar />
      <div className="app-main__outer">
        <div className="app-main__inner">

          {/* Informative Pages */}
          <Route path={`${match.url}/main`} component={HomeIndex}/>
          <Route path={`${match.url}/about`} component={HomeIndex}/>

          {/* CRUD Pages - Entities */}
          <Route path={`${match.url}/create/entity`} component={EntitiesCreate}/>
          <Route path={`${match.url}/entities`} component={EntitiesIndex}/>
          
          {/* CRUD Pages - Students */}
          <Route path={`${match.url}/create/student`} component={EntitiesCreate}/>
          <Route path={`${match.url}/students`} component={StudentsIndex}/>
          <Route path={`${match.url}/create/teacher`} component={EntitiesCreate}/>

          {/* CRUD Pages - Teachers */}
          <Route path={`${match.url}/teachers`} component={TeachersIndex}/>
          <Route path={`${match.url}/create/course`} component={EntitiesCreate}/>

          {/* CRUD Pages - Courses */}
          <Route path={`${match.url}/courses`} component={CoursesIndex}/>
          <Route path={`${match.url}/create/resource`} component={EntitiesCreate}/>

          {/* CRUD Pages - Resources */}
          <Route path={`${match.url}/resources`} component={ResourcesIndex}/>

          {/* Static non connected pages */}
          <Route path={`${match.url}/material`} component={MaterialIndex}/>
        </div>
      </div>
    </div>
  </Fragment>
);

export default Dashboards;
