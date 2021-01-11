import { Route, Redirect } from "react-router-dom";
import React from 'react';
import { useSelector } from "react-redux";

const PublicRoute = ({component: Component, ...rest}) => {
  const stateData = useSelector(state => state);
  return ( 
    <Route
      {...rest}
      render={props =>
        (!stateData.userData.token) ? (
          <Component {...props} />
        ) : (
          <Redirect to={{pathname: rest.redirectRoute, extras: {...rest.location}}} />
        )
      }
    />
   );
}
 
export default PublicRoute;