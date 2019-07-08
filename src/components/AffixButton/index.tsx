// base
import React from 'react';

// modules
import { Button, Affix } from 'antd';
import { AffixProps } from 'antd/lib/affix';

interface Props extends AffixProps {
  title?: string;
  icon?: string;
  size?: 'small' | 'default' | 'large' | undefined;
  onClick?: (...args: any[]) => void;
}

function AffixButton(props: Props) {
  const { title = 'title', icon = 'setting', size = 'large', onClick, ...rest } = props;

  return (
    <Affix offsetBottom={10} style={{ position: 'absolute', right: 50 }} {...rest}>
      <Button type="primary" icon={icon} size={size} onClick={onClick}>
        {title}
      </Button>
    </Affix>
  );
}

export default AffixButton;
