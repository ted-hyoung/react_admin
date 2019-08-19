// base
import React, { useCallback } from 'react';

// modules
import { DatePicker, Button } from 'antd';
import { DatePickerDecorator, RangePickerProps, RangePickerValue } from 'antd/lib/date-picker/interface';
import moment, { Moment } from 'moment';

// utils
import { defaultDateFormat } from 'lib/utils';

// enums
import { DateRange } from 'enums';

export function validateDate(val: any, key: string) {
  if (val[key].length > 0) {
    val.startDate = val[key][0];
    val.endDate = val[key][1];
  }
  delete val[key];
}

export function getValueFromEventForSearchDate(dates: RangePickerValue, dateStrings: [string, string]) {
  return dateStrings;
}

export function getValuePropsForSearchDate(value: any) {
  if (value) {
    const newValue = [...value];
    value.forEach((item: any, index: any) => {
      if (typeof item === 'string') {
        if (item.length === 0) {
          newValue[index] = null;
        } else {
          newValue[index] = moment(item);
        }
      }
    });
    return { value: newValue };
  }
  return value;
}

const ShippingSearchDate = React.forwardRef<DatePickerDecorator, RangePickerProps>((props, ref) => {
  const { value, onChange } = props;

  const handleChange = useCallback(
    (dates: RangePickerValue, dateStrings: [string, string]) => {
      if (onChange) {
        const newDates = [...dates] as RangePickerValue;
        const newDateStrings = [...dateStrings] as [string, string];
        if (dates) {
          dates.forEach((item, i) => {
            if (item) {
              if (i === 0) {
                const start = item.startOf('day');
                newDates[i] = start;
                newDateStrings[i] = start.format(defaultDateFormat);
              } else {
                const end = item.endOf('day');
                newDates[i] = end;
                newDateStrings[i] = end.format(defaultDateFormat);
              }
            }
          });
        }
        onChange(newDates, newDateStrings);
      }
    },
    [onChange],
  );

  const setDate = useCallback(
    (value: string) => {
      const today = moment();
      const dates: RangePickerValue = [today, today];
      const dateStrings: [string, string] = ['', ''];
      switch (value) {
        case DateRange.RECENT_3DAYS: {
          dates[0] = moment().subtract(3, 'day');
          break;
        }
        case DateRange.RECENT_WEEK: {
          dates[0] = moment().subtract(1, 'week');
          break;
        }
        case DateRange.RECENT_MONTH: {
          dates[0] = moment().subtract(1, 'month');
          break;
        }
        case DateRange.RECENT_3MONTHS: {
          dates[0] = moment().subtract(3, 'month');
          break;
        }
      }
      dates.forEach((date: Moment | undefined, index: number) => {
        if (date) {
          dateStrings[index] = date.format('YYYY-MM-DD');
        }
      });
      handleChange(dates, dateStrings);
    },
    [handleChange],
  );
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <DatePicker.RangePicker allowClear={false} value={value} onChange={handleChange} style={{ marginRight: 15 }} />
      {Object.keys(DateRange).map((key: any) => (
        <Button key={key} onClick={() => setDate(DateRange[key])} style={{ marginRight: 5 }}>
          {DateRange[key]}
        </Button>
      ))}
    </div>
  );
});

export default ShippingSearchDate;
