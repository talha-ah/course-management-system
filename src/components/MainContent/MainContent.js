import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import classes from './MainContent.module.css';

import Header from '../Header/Header';
import AdminSidebar from '../../components/Sidebar/AdminSidebar';
import TeacherSidebar from '../../components/Sidebar/TeacherSidebar';
import Footer from '../../components/Footer/Footer';
import Error404 from '../../components/Pages/404/404';

// Admin Imports
import AdminProfile from '../Pages/AdminPages/Profile/Profile';
import AdminCoursesList from '../Pages/AdminPages/Courses/CoursesList/CoursesList';
import AdminAddCourse from '../Pages/AdminPages/Courses/AddCourse/AddCourse';
import AdminTeacher from '../Pages/AdminPages/Teachers/Teacher/Teacher';
import AdminTeachers from '../Pages/AdminPages/Teachers/TeacherList/TeacherList';
import AdminAddTeacher from '../Pages/AdminPages/Teachers/AddTeacher/AddTeacher';

// Teacher Imports
import ProfilePage from '../Pages/TeacherPages/Profile/Profile';
import Courses from '../Pages/TeacherPages/Courses/CoursesList/CoursesList';
import Course from '../Pages/TeacherPages/Courses/Course/Course';
import TakeCourse from '../Pages/TeacherPages/Courses/AddCourse/AddCourse';
import CoursesDescription from '../Pages/TeacherPages/CoursesDescription/CoursesDescription';
import CoursesLog from '../Pages/TeacherPages/CoursesLog/CoursesLog';
import CoursesMonitoring from '../Pages/TeacherPages/CoursesMonitoring/CoursesMonitoring';
import Assignments from '../Pages/TeacherPages/Assignments/Assignments';
import Papers from '../Pages/TeacherPages/Papers/Papers';
import Quizzes from '../Pages/TeacherPages/Quizzes/Quizzes';
import AddResult from '../Pages/TeacherPages/AddResult/AddResult';
import Reports from '../Pages/TeacherPages/Reports/Reports';

const MainContent = props => {
  return (
    <div className={classes.CMS}>
      {props.isAdmin ? <AdminSidebar /> : <TeacherSidebar />}

      <div className={classes.mainContent}>
        <Header
          isAdmin={props.authData.isAdmin}
          logoutHandler={props.logoutHandler}
        />
        {props.isAdmin ? (
          <Switch>
            <Route
              exact
              path='/'
              render={({ match, history, location }) => (
                <AdminCoursesList
                  match={match}
                  location={location}
                  history={history}
                  {...props.authData}
                />
              )}
            />
            <Route
              exact
              path='/profile'
              render={({ match, history, location }) => (
                <AdminProfile
                  match={match}
                  location={location}
                  history={history}
                  {...props.authData}
                />
              )}
            />

            <Route
              exact
              path='/addcourse'
              render={({ match, history, location }) => (
                <AdminAddCourse
                  match={match}
                  location={location}
                  history={history}
                  {...props.authData}
                />
              )}
            />
            <Route
              exact
              path='/teacher'
              render={({ match, history, location }) => (
                <AdminTeacher
                  match={match}
                  location={location}
                  history={history}
                  {...props.authData}
                />
              )}
            />
            <Route
              exact
              path='/teachers'
              render={({ match, history, location }) => (
                <AdminTeachers
                  match={match}
                  location={location}
                  history={history}
                  {...props.authData}
                />
              )}
            />
            <Route
              exact
              path='/addteacher'
              render={({ match, history, location }) => (
                <AdminAddTeacher
                  match={match}
                  location={location}
                  history={history}
                  {...props.authData}
                />
              )}
            />
            <Route path='*' component={Error404} />
          </Switch>
        ) : (
          <Switch>
            <Route
              exact
              path='/'
              render={({ match, history, location }) => (
                <Courses
                  match={match}
                  location={location}
                  history={history}
                  {...props.authData}
                />
              )}
            />
            <Route
              exact
              path='/profile'
              render={({ match, history, location }) => (
                <ProfilePage
                  match={match}
                  location={location}
                  history={history}
                  {...props.authData}
                />
              )}
            />
            <Route
              exact
              path='/course/:courseId'
              render={({ match, history, location }) => (
                <Course
                  match={match}
                  location={location}
                  history={history}
                  {...props.authData}
                />
              )}
            />
            <Route
              exact
              path='/takecourse'
              render={({ match, history, location }) => (
                <TakeCourse
                  match={match}
                  location={location}
                  history={history}
                  {...props.authData}
                />
              )}
            />
            <Route
              exact
              path='/coursesdescription'
              render={({ match, history, location }) => (
                <CoursesDescription
                  match={match}
                  location={location}
                  history={history}
                  {...props.authData}
                />
              )}
            />
            <Route
              exact
              path='/courseslog'
              render={({ match, history, location }) => (
                <CoursesLog
                  match={match}
                  location={location}
                  history={history}
                  {...props.authData}
                />
              )}
            />
            <Route
              exact
              path='/coursesmonitoring'
              render={({ match, history, location }) => (
                <CoursesMonitoring
                  match={match}
                  location={location}
                  history={history}
                  {...props.authData}
                />
              )}
            />
            <Route
              exact
              path='/assignments'
              render={({ match, history, location }) => (
                <Assignments
                  match={match}
                  location={location}
                  history={history}
                  {...props.authData}
                />
              )}
            />
            <Route
              exact
              path='/papers'
              render={({ match, history, location }) => (
                <Papers
                  match={match}
                  location={location}
                  history={history}
                  {...props.authData}
                />
              )}
            />
            <Route
              exact
              path='/quizzes'
              render={({ match, history, location }) => (
                <Quizzes
                  match={match}
                  location={location}
                  history={history}
                  {...props.authData}
                />
              )}
            />
            <Route
              exact
              path='/addresult'
              render={({ match, history, location }) => (
                <AddResult
                  match={match}
                  location={location}
                  history={history}
                  {...props.authData}
                />
              )}
            />
            <Route
              exact
              path='/reports'
              render={({ match, history, location }) => (
                <Reports
                  match={match}
                  location={location}
                  history={history}
                  {...props.authData}
                />
              )}
            />
            <Route path='*' component={Error404} />
          </Switch>
        )}
      </div>
      <Footer />
    </div>
  );
};

const mapStateToProps = state => {
  return {
    isAdmin: state.adminSidebar
  };
};

export default connect(mapStateToProps)(MainContent);
