// base
import React, { Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';
import routes, { PrivateRoute } from './routes';

// modules
import { Layout } from 'antd';
import { EventTemplate } from 'pages';

// components
import { Menu, Header } from 'components';

// defines
const { Content, Sider } = Layout;

const NotFound = () => {
  return <div>Not Found!</div>;
};

function App() {
  return (
    <div id="app">
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route exact path="/events/:id/template" component={EventTemplate} />;
          {routes.map(({ path, component: Component, secret }, index) => {
            if (secret) {
              return (
                <PrivateRoute
                  exact
                  key={index}
                  path={path}
                  component={() => (
                    <Layout style={{ minHeight: '100vh' }}>
                      <Sider breakpoint="lg" collapsedWidth="0">
                        <Menu />
                      </Sider>
                      <Layout style={{ backgroundColor: '#ffffff' }}>
                        <Header />
                        <Content id="content" style={{ padding: '50px 20px' }}>
                          <Component />
                        </Content>
                      </Layout>
                    </Layout>
                  )}
                />
              );
            }
            return <Route exact key={index} path={path} component={Component} />;
          })}
          <Route path="*" component={NotFound} />
        </Switch>
      </Suspense>
    </div>
  );
}
export default App;
