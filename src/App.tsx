// base
import React, { Suspense, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import routes, { PrivateRoute } from './routes';

// modules
import { Layout } from 'antd';

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

function App() {
  const accessToken = getToken();
  const tokenExpired = isTokenExpired(accessToken);

  useEffect(() => {
    // componentDidMount
    if (accessToken && tokenExpired) {
      requestRefreshToken(accessToken, getRefreshToken()).then(res => {
        window.location.reload();
      });
    }
  }, []);

  if (!accessToken) {
    return <Login />;
  } else if (accessToken && tokenExpired) {
    return <NotFound />;
  }

  return (
    <div id="app">
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
    </div>
  );
}

export default App;
