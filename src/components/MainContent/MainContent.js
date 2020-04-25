import React, { Suspense } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import classes from './MainContent.module.css';
import Spinner from '../UI/Spinner/Spinner';

import Header from '../Header/Header';
import AdminSidebar from '../../components/Sidebar/AdminSidebar';
import TeacherSidebar from '../../components/Sidebar/TeacherSidebar';
import Footer from '../../components/Footer/Footer';
// import Error404 from '../../components/Pages/404/404';

// Admin Imports using lazy loading
const AdminProfile = React.lazy(() =>
  import('../Pages/AdminPages/Profile/Profile')
);
const AdminCoursesList = React.lazy(() =>
  import('../Pages/AdminPages/Courses/CoursesList/CoursesList')
);
const AdminAddCourse = React.lazy(() =>
  import('../Pages/AdminPages/Courses/AddCourse/AddCourse')
);
const AdminCourse = React.lazy(() =>
  import('../Pages/AdminPages/Courses/Course/Course')
);
const AdminTeacher = React.lazy(() =>
  import('../Pages/AdminPages/Teachers/Teacher/Teacher')
);
const AdminTeachers = React.lazy(() =>
  import('../Pages/AdminPages/Teachers/TeacherList/TeacherList')
);
const AdminAddTeacher = React.lazy(() =>
  import('../Pages/AdminPages/Teachers/AddTeacher/AddTeacher')
);
const AdminReports = React.lazy(() =>
  import('../Pages/AdminPages/Reports/Reports')
);

// Teacher imports using lazy loading
const ProfilePage = React.lazy(() =>
  import('../Pages/TeacherPages/Profile/Profile')
);
const Courses = React.lazy(() =>
  import('../Pages/TeacherPages/Courses/CoursesList/CoursesList')
);
const Course = React.lazy(() =>
  import('../Pages/TeacherPages/Courses/Course/Course')
);
const TakeCourse = React.lazy(() =>
  import('../Pages/TeacherPages/Courses/AddCourse/AddCourse')
);
const CoursesDescription = React.lazy(() =>
  import('../Pages/TeacherPages/CoursesDescription/CoursesDescription')
);
const CoursesLog = React.lazy(() =>
  import('../Pages/TeacherPages/CoursesLog/CoursesLog')
);
const CoursesMonitoring = React.lazy(() =>
  import('../Pages/TeacherPages/CoursesMonitoring/CoursesMonitoring')
);
const Grading = React.lazy(() =>
  import('../Pages/TeacherPages/Grading/Grading')
);
const Assignments = React.lazy(() =>
  import('../Pages/TeacherPages/Assignments/Assignments')
);
const Papers = React.lazy(() => import('../Pages/TeacherPages/Papers/Papers'));
const Quizzes = React.lazy(() =>
  import('../Pages/TeacherPages/Quizzes/Quizzes')
);
const Material = React.lazy(() =>
  import('../Pages/TeacherPages/Material/Material')
);
const AddResult = React.lazy(() =>
  import('../Pages/TeacherPages/AddResult/AddResult')
);
const Reports = React.lazy(() =>
  import('../Pages/TeacherPages/Reports/Reports')
);

const MainContent = (props) => {
  return (
    <div className={classes.CMS}>
      {props.isAdmin ? <AdminSidebar /> : <TeacherSidebar />}

      <div className={classes.mainContent}>
        <Header
          isAdmin={props.authData.isAdmin}
          logoutHandler={props.logoutHandler}
        />
        {props.isAdmin ? (
          <Suspense
            fallback={
              <div style={{ textAlign: 'center' }}>
                <Spinner />
              </div>
            }
          >
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
                path='/course/:courseId'
                render={({ match, history, location }) => (
                  <AdminCourse
                    match={match}
                    location={location}
                    history={history}
                    {...props.authData}
                  />
                )}
              />
              <Route
                exact
                path='/teacher/:teacherId'
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
              <Route
                exact
                path='/reports'
                render={({ match, history, location }) => (
                  <AdminReports
                    match={match}
                    location={location}
                    history={history}
                    {...props.authData}
                  />
                )}
              />
              <Redirect to='/' />
              {/* <Route path='*' component={Error404} /> */}
            </Switch>
          </Suspense>
        ) : (
          <Suspense
            fallback={
              <div style={{ textAlign: 'center' }}>
                <Spinner />
              </div>
            }
          >
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
                path='/grading'
                render={({ match, history, location }) => (
                  <Grading
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
                path='/material'
                render={({ match, history, location }) => (
                  <Material
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
              <Redirect to='/' />
              {/* <Route path='*' component={Error404} /> */}
            </Switch>
          </Suspense>
        )}
      </div>
      <Footer />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    isAdmin: state.adminSidebar,
  };
};

export default connect(mapStateToProps)(MainContent);
