// base
import React, { useCallback, useState } from 'react';

// modules
import moment from 'moment';
import { Button } from 'antd';
import Form, { FormComponentProps } from 'antd/lib/form';

// components
import { SearchDateFormItem } from 'components';

// containers
import { BrandSalesMultiSearch } from 'containers';

// lib
import { startDateFormat, endDateFormat } from 'lib/utils';
import { LOCAL_DATE_TIME_FORMAT } from 'lib/constants';
import { DateActionType } from '../../enums';

interface Props extends FormComponentProps {
  onSearch: (value: { [props: string]: any }) => void;
  onReset: () => void;
}

const BrandSalesSearchBar = Form.create<Props>()((props: Props) => {
  const start = moment().startOf('day');
  const { form, onSearch, onReset } = props;
  const { getFieldDecorator, validateFields, resetFields } = form;
  const [selectedBrand, setSelectedBrand] = useState<number[]>([]);

  const handleSearch = useCallback(() => {
    validateFields((errors, values) => {
      if (!errors) {
        Object.keys(values).map(key => {
          if (values[key] === undefined) {
            delete values[key];
            return false;
          }

          if (key === 'dates') {
            const dates = values[key];
            values.startDate = dates[0].format(LOCAL_DATE_TIME_FORMAT);
            values.endDate = dates[1].format(LOCAL_DATE_TIME_FORMAT);
            delete values[key];
            return;
          }
        });
        if (values.startDate !== undefined ) {
          values.startDate = moment(values.startDate).format(startDateFormat);
          values.endDate = moment(values.endDate).format(endDateFormat);
        }else{ // 검색 기간 미지정 전체 선택시 최장 기간 입력
          values.startDate = moment(start).subtract(6, 'month').format(startDateFormat);
          values.endDate = moment(values.endDate).format(endDateFormat);
        }
        onSearch(values);
      } else {
        console.error(errors);
      }
    });
  }, [onSearch, selectedBrand, validateFields]);

  const handleReset = useCallback(() => {
    resetFields();
    onReset();
    setSelectedBrand([]);
  }, [onReset, resetFields, setSelectedBrand]);

  return (
    <>
      <Form>
        <Form.Item>
          {getFieldDecorator('dates', {
            initialValue: [moment().startOf('day'), moment().endOf('day')],
          })(
            <SearchDateFormItem
              optionDateLength={[
                DateActionType.TODAY,
                DateActionType.RECENT_THREE_DAYS,
                DateActionType.RECENT_WEEK,
                DateActionType.RECENT_MONTH,
                DateActionType.RECENT_THREE_MONTH
              ]}
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('brandIds', {
            rules: [
              {
                required: true,
                message: '브랜드를 선택해 주세요',
              },
            ],
          })(<BrandSalesMultiSearch setSelectedBrand={setSelectedBrand} selectedBrand={selectedBrand} />)}
        </Form.Item>
        <Form.Item>
          <Button onClick={handleSearch} type="primary" style={{ marginRight: 5 }}>
            검색
          </Button>
          <Button onClick={handleReset}>초기화</Button>
        </Form.Item>
      </Form>
    </>
  );
});

export default BrandSalesSearchBar;
