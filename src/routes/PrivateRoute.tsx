// base
import React, { useState } from 'react';
import { Route, RouteProps } from 'react-router';

// libs
import { getToken, isTokenExpired, getRefreshToken } from 'lib/utils';
import { requestRefreshToken } from 'lib/protocols';

function PrivateRoute(props: RouteProps) {
  const { component, ...rest } = props;

  const [token, setToken] = useState(getToken());

  if (isTokenExpired(token)) {
    requestRefreshToken(token, getRefreshToken()).then(res => setToken(res.data.access_token));
  }

  return <Route {...rest} component={token ? component : undefined} />;
}

export default PrivateRoute;
