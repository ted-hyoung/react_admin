// base
import React, { useCallback } from 'react';

// modules
import { Table, Button, Select, Row, Col } from 'antd';
import { TableComponents, TableProps } from 'antd/lib/table';

// defines
const pageSizeRange = ['10', '20', '50', '100'];

interface Props<T> extends TableProps<T> {
  onChangePageSize?: (value: string) => void;
  onChangeExpose?: (value: boolean) => void;
}

function PaginationTable<T>(props: Props<T>) {
  const { onChangePageSize, onChangeExpose, ...rest } = props;

  return (
    <>
      <Row type="flex" justify="space-between" style={{ marginBottom: 15 }}>
        <Col>
          {onChangeExpose && (
            <span>
              <Button onClick={() => onChangeExpose(true)} style={{ marginRight: 5 }} type="primary">
                선택 공개
              </Button>
              <Button onClick={() => onChangeExpose(false)} type="danger">
                선택 비공개
              </Button>
            </span>
          )}
        </Col>
        <Col>
          {onChangePageSize && (
            <Select defaultValue={pageSizeRange[0]} style={{ width: 150 }} onChange={onChangePageSize}>
              {pageSizeRange.map(size => (
                <Select.Option key={size} value={size}>
                  {size}개씩 보기
                </Select.Option>
              ))}
            </Select>
          )}
        </Col>
      </Row>
      <Table {...rest} />
    </>
  );
}

export default PaginationTable;
