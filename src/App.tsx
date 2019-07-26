// base
import React, { Suspense, useEffect } from 'react';
import { Switch, Route, Redirect, withRouter, RouteComponentProps } from 'react-router-dom';
import routes, { PrivateRoute } from './routes';

// modules
import { Layout, Row, Col } from 'antd';
import { useSelector } from 'react-redux';
import { StoreState } from 'store';
import { EventTemplate } from 'pages';

// components
import { Menu, Header } from 'components';

// pages
import { Login } from 'pages';

// lib
import { isTokenExpired, getToken, getRefreshToken } from 'lib/utils';
import { requestRefreshToken } from 'lib/protocols';

// defines
const { Content, Sider } = Layout;

const NotFound = () => {
  return <div>Not Found!</div>;
};

function App(props: RouteComponentProps) {
  const accessToken = getToken();
  const tokenExpired = isTokenExpired(accessToken);

  const { location, action } = useSelector((state: StoreState) => state.router);

  useEffect(() => {
    // componentDidMount
    if (accessToken && tokenExpired) {
      requestRefreshToken(accessToken, getRefreshToken()).then(res => {
        window.location.reload();
      });
    }
    if (!accessToken) {
      props.history.push('/login');
    }
  }, []);

  if (location.pathname.indexOf('template') !== -1) {
    return <Route exact path="/events/:id/template" component={EventTemplate} />;
  }

  return (
    <div id="app">
      <Switch>
        <Route path="/login" component={Login} />
        <Route
          path="/"
          component={() => (
            <Layout style={{ minHeight: '100vh' }}>
              <Sider>
                <Menu />
              </Sider>
              <Layout style={{ backgroundColor: '#ffffff' }}>
                <Header />
                <Content id="content" style={{ padding: 50 }}>
                  <Suspense fallback={<div>Loading...</div>}>
                    <Switch>
                      {routes.map(({ path, component, secret }, index) => {
                        if (secret) {
                          return <PrivateRoute key={index} path={path} component={component} />;
                        }

                        return <Route key={index} path={path} component={component} />;
                      })}
                      <Route path="*" component={NotFound} />
                    </Switch>
                  </Suspense>
                </Content>
              </Layout>
            </Layout>
          )}
        />
      </Switch>
    </div>
  );
}
export default withRouter(App);
