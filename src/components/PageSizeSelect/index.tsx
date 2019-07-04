import React, { useCallback } from 'react';
import { Select } from 'antd';

const pageSizeRange = ['10', '20', '50', '100'];

interface Props {
  getData: (page: number, size: number, searchCondition?: any) => void;
}

function PageSizeSelect(props: Props) {
  const { getData } = props;

  const handlePageSizeChange = useCallback(
    (value: string) => {
      getData(0, Number(value));
    },
    [getData],
  );

  return (
    <Select
      defaultValue={pageSizeRange[0]}
      style={{ width: 150, float: 'right', marginBottom: 15 }}
      onChange={handlePageSizeChange}
    >
      {pageSizeRange.map(size => (
        <Select.Option key={size} value={size}>
          {size}개씩 보기
        </Select.Option>
      ))}
    </Select>
  );
}

export default PageSizeSelect;
