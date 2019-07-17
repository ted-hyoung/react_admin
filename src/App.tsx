// base
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import routes, { PrivateRoute } from './routes';

// modules
import { Layout, Row, Col } from 'antd';
import { Menu } from 'components';

// components

// defines
const { Content, Sider, Header } = Layout;

const NotFound = () => {
  return <div>Not Found!</div>;
};

function App() {
  return (
    <Router>
      <div id="app">
        <Layout style={{ minHeight: '100vh' }}>
          <Sider>
            <Menu />
          </Sider>
          <Layout style={{ backgroundColor: '#ffffff' }}>
            <Header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e8e8e8' }}>FROM C</Header>
            <Content id="content" style={{ padding: 50 }}>
              <Suspense fallback={<div>Loading...</div>}>
                <Switch>
                  {routes.map(({ path, component, secret }, index) => {
                    if (secret) {
                      return <PrivateRoute exact key={index} path={path} component={component} />;
                    }

                    return <Route exact key={index} path={path} component={component} />;
                  })}
                  <Route path="*" component={NotFound} />
                </Switch>
              </Suspense>
            </Content>
          </Layout>
        </Layout>
      </div>
    </Router>
  );
}

export default App;
