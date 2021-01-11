import React, { Component, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import * as router from 'react-router-dom';
import { connect } from "react-redux";
import { removeUser } from '../../redux/actions/user-data';
import { ToastsStore } from "react-toasts";

import {
  AppAside,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppBreadcrumb2 as AppBreadcrumb,
  AppSidebarNav2 as AppSidebarNav,
} from '@coreui/react';
// sidebar nav config
import navigation from '../../_nav';
import ProtectedRoute from '../../components/protected-routes';
import ToDos from './../../pages/todos-page';
import ProfilePreview from "../../pages/profile-preview-page"

const DefaultAside = React.lazy(() => import('./DefaultAside'));
const DefaultFooter = React.lazy(() => import('./DefaultFooter'));
const DefaultHeader = React.lazy(() => import('./DefaultHeader'));

class DefaultLayout extends Component {

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  signOut(e) {
    e.preventDefault();
    this.props.removeUser();
    localStorage.clear();
    ToastsStore.success("Logged out successfully...");
    this.props.history.push('/login')
  }

  componentDidMount() {
    console.log('in layout :>> ');
  }

  render() {
    return (
      <div className="app">
        <AppHeader fixed>
          <Suspense fallback={this.loading()}>
            <DefaultHeader onLogout={e => this.signOut(e)} />
          </Suspense>
        </AppHeader>
        <div className="app-body">
          <AppSidebar fixed>
            <AppSidebarHeader />
            <AppSidebarForm />
            <Suspense>
              <AppSidebarNav navConfig={navigation} {...this.props} router={router} />
            </Suspense>
            <AppSidebarFooter />
            <AppSidebarMinimizer />
          </AppSidebar>
          <main className="main">
            <Switch>

              <ProtectedRoute
                path={`/todos`}
                component={ToDos}
                redirectRoute={"/login"}
              />

              <ProtectedRoute
                path={`/profile-preview`}
                component={ProfilePreview}
                redirectRoute={"/login"}
              />

              <Route path="/" render={() => <Redirect to="/todos" />} />
            </Switch>
          </main>
        </div>
        <AppFooter>
          <Suspense fallback={this.loading()}>
            <DefaultFooter />
          </Suspense>
        </AppFooter>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userData: state.userData
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    removeUser: () => dispatch(removeUser())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DefaultLayout);
