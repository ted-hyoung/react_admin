import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router';

function PrivateRoute(props: RouteProps) {
  const { component, ...rest } = props;

  return (
    <Route
      {...rest}
      render={props => (false ? component : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />)}
    />
  );
}

export default PrivateRoute;
