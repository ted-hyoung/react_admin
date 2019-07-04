import React, { useCallback } from 'react';
import { RangePickerProps, DatePickerDecorator, RangePickerValue } from 'antd/lib/date-picker/interface';
import { DatePicker, Button } from 'antd';
import moment from 'moment';

enum DateRange {
  ENTIRE = '전체',
  TODAY = '오늘',
  RECENT_3DAYS = '최근 3일',
  RECENT_WEEK = '최근 7일',
}

const SearchDate = React.forwardRef<DatePickerDecorator, RangePickerProps>((props, ref) => {
  const { value, onChange } = props;
  const setDate = useCallback(
    (value: string) => {
      let dates: RangePickerValue = [];
      let dateStrings: [string, string] = ['', ''];
      switch (value) {
        case DateRange.ENTIRE: {
          break;
        }
        case DateRange.TODAY: {
          const today = moment();
          dates = [today, today];
          dateStrings = [today.format(), today.format()];
          break;
        }
        case DateRange.RECENT_3DAYS: {
          const startDate = moment().subtract(3, 'day');
          const endDate = moment();
          dates = [startDate, endDate];
          dateStrings = [startDate.format(), endDate.format()];
          break;
        }
        case DateRange.RECENT_WEEK: {
          const startDate = moment().subtract(1, 'week');
          const endDate = moment();
          dates = [startDate, endDate];
          dateStrings = [startDate.format(), endDate.format()];
          break;
        }
      }
      if (onChange) {
        onChange(dates, dateStrings);
      }
    },
    [onChange],
  );
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <DatePicker.RangePicker value={value} onChange={onChange} style={{ marginRight: 15 }} />
      {Object.keys(DateRange).map((key: any) => (
        <Button key={key} onClick={() => setDate(DateRange[key])} style={{ marginRight: 5 }}>
          {DateRange[key]}
        </Button>
      ))}
    </div>
  );
});

export default SearchDate;
