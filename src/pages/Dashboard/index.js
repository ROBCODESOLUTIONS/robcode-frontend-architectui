import React, { Fragment } from "react";
import { Route } from "react-router-dom";

// DASHBOARDS

// import AnalyticsDashboard from "./Analytics/";
// import SalesDashboard from "./Sales/";
// import CommerceDashboard from "./Commerce/";
// import CRMDashboard from "./CRM/";
import HomeIndex from "./Home/index";

import EntitiesIndex from "./Entities/index";
import EntitiesCreateUpdate from "./Entities/createUpdate";


import StudentsIndex from "./Students/index";
import StudentsCreateUpdate from "./Students/createUpdate";

import TeachersIndex from "./Teachers/index";
import TeachersCreateUpdate from "./Teachers/createUpdate";

import CoursesIndex from "./Courses/index";
import CoursesCreateUpdate from "./Courses/createUpdate";

import ResourcesIndex from "./Resources/index";
import GamesIndex from "./Games/index";
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
          <Route path={`${match.url}/entities`} component={EntitiesIndex}/>
          <Route path={`${match.url}/create/entity`} component={EntitiesCreateUpdate}/>
          <Route path={`${match.url}/edit/entities/:entityId`} component={EntitiesCreateUpdate}/>
          
          {/* CRUD Pages - Students */}
          <Route path={`${match.url}/create/student`} component={StudentsCreateUpdate}/>
          <Route path={`${match.url}/students`} component={StudentsIndex}/>
          <Route path={`${match.url}/edit/students/:studentId`} component={StudentsCreateUpdate}/>

          {/* CRUD Pages - Teachers */}
          <Route path={`${match.url}/create/teacher`} component={TeachersCreateUpdate}/>
          <Route path={`${match.url}/teachers`} component={TeachersIndex}/>
          <Route path={`${match.url}/edit/teachers/:teacherId`} component={TeachersCreateUpdate}/>

          {/* CRUD Pages - Courses */}
          <Route path={`${match.url}/courses`} component={CoursesIndex}/>
          <Route path={`${match.url}/create/course`} component={CoursesCreateUpdate}/>
          <Route path={`${match.url}/edit/course/:entityId`} component={CoursesCreateUpdate}/>

          {/* CRUD Pages - Resources */}
          <Route path={`${match.url}/games`} component={GamesIndex}/>
          <Route path={`${match.url}/resources`} component={ResourcesIndex}/>
          <Route path={`${match.url}/create/resource`} component={EntitiesCreateUpdate}/>

          {/* Static non connected pages */}
          <Route path={`${match.url}/material`} component={MaterialIndex}/>
          <Route path={`${match.url}/create/material`} component={EntitiesCreateUpdate}/>
        </div>
      </div>
    </div>
  </Fragment>
);

export default Dashboards;
