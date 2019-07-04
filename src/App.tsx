// base
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import routes, { PrivateRoute } from './routes';

// modules
import { Layout, Row, Col } from 'antd';
import { Menu } from 'components';

// components

// defines
const { Content } = Layout;

const NotFound = () => {
  return <div>Not Found!</div>;
};

function App() {
  return (
    <Router>
      <div id="app">
        <Row type="flex">
          <Col>
            <Menu />
          </Col>
          <Col style={{ flexGrow: 1 }}>
            <Content style={{ padding: 50 }}>
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
          </Col>
        </Row>
      </div>
    </Router>
  );
}

export default App;
