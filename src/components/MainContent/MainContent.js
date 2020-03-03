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
import AdminProfile from '../Pages/AdminPages/Profile/ProfilePage/ProfilePage';
import AdminEditProfile from '../Pages/AdminPages/Profile/EditProfile/EditProfile';
import AdminCoursesList from '../Pages/AdminPages/Courses/CoursesList/CoursesList';
import AdminAddCourse from '../Pages/AdminPages/Courses/AddCourse/AddCourse';

// Teacher Imports
import ProfilePage from '../Pages/TeacherPages/Profile/ProfilePage/ProfilePage';
import EditProfilePage from '../Pages/TeacherPages/Profile/EditProfile/EditProfile';
import Courses from '../Pages/TeacherPages/Courses/CoursesList/CoursesList';
import TakeCourse from '../Pages/TeacherPages/Courses/AddCourse/AddCourse';
import CoursesDescription from '../Pages/TeacherPages/CoursesDescription/CoursesDescription';
import CoursesLog from '../Pages/TeacherPages/CoursesLog/CoursesLog';
import CoursesMonitoring from '../Pages/TeacherPages/CoursesMonitoring/CoursesMonitoring';
import Assignments from '../Pages/TeacherPages/Assignments/Assignments';
import Papers from '../Pages/TeacherPages/Papers/Papers';
import Quizzes from '../Pages/TeacherPages/Quizzes/Quizzes';
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
              render={() => <AdminProfile {...props.authData} />}
            />
            <Route
              exact
              path='/profile'
              render={() => <AdminProfile {...props.authData} />}
            />
            <Route
              exact
              path='/editprofile'
              render={() => <AdminEditProfile {...props.authData} />}
            />
            <Route
              exact
              path='/courses'
              render={() => <AdminCoursesList {...props.authData} />}
            />
            <Route
              exact
              path='/addcourse'
              render={() => <AdminAddCourse {...props.authData} />}
            />
            <Route path='*' component={Error404} />
          </Switch>
        ) : (
          <Switch>
            <Route exact path='/' component={ProfilePage} />
            <Route exact path='/profile' component={ProfilePage} />
            <Route exact path='/editprofile' component={EditProfilePage} />
            <Route exact path='/courses' component={Courses} />
            <Route exact path='/takecourse' component={TakeCourse} />
            <Route
              exact
              path='/coursesdescription'
              component={CoursesDescription}
            />
            <Route exact path='/courseslog' component={CoursesLog} />
            <Route
              exact
              path='/coursesmonitoring'
              component={CoursesMonitoring}
            />
            <Route exact path='/assignments' component={Assignments} />
            <Route exact path='/papers' component={Papers} />
            <Route exact path='/quizzes' component={Quizzes} />
            <Route exact path='/reports' component={Reports} />
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
