// base
import React, { useEffect, useState, useRef } from 'react';

// modules
import Scrollspy, { ScrollspyProps } from 'react-scrollspy';

import './index.less';
import { usePrevious } from 'lib/hooks';

const cloneElementProps = {
  className: 'ant-tabs-tab',
};

interface ScrollspyTabsProps extends ScrollspyProps {
  children: JSX.Element | JSX.Element[];
  onChange?: (activeKey: string) => void;
}

function ScrollspyTabs(props: ScrollspyTabsProps) {
  const { children, onChange = () => undefined } = props;

  const [activeKey, setActiveKey] = useState(0);
  const prevActiveKey = usePrevious(activeKey);

  const scrollSpyRef = useRef<Scrollspy>(null);

  useEffect(() => {
    if (scrollSpyRef.current) {
      scrollSpyRef.current.offEvent = () => undefined;
    }
  }, [scrollSpyRef]);

  useEffect(() => {
    if (prevActiveKey !== undefined && activeKey !== prevActiveKey) {
      onChange(String(activeKey + 1));
    }
  }, [activeKey, prevActiveKey]);

  return (
    <div className="scroll-spy-tabs">
      <div className="ant-tabs ant-tabs-top ant-tabs-card ant-tabs-no-animation">
        <div className="ant-tabs-bar ant-tabs-top-bar ant-tabs-card-bar">
          <div className="ant-tabs-nav-container">
            <div className="ant-tabs-nav-wrap">
              <div className="ant-tabs-nav-scroll">
                <div className="ant-tabs-nav ant-tabs-nav-animated">
                  <Scrollspy ref={scrollSpyRef} {...props}>
                    {Array.isArray(children)
                      ? children.map((child, index) => {
                          return React.cloneElement(child, {
                            ...cloneElementProps,
                            key: index,
                            onClick: () => setActiveKey(index),
                          });
                        })
                      : React.cloneElement(children, cloneElementProps)}
                  </Scrollspy>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScrollspyTabs;
