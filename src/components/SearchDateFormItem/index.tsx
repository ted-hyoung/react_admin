// base
import React, { useReducer, Reducer, useEffect, useState } from 'react';

// modules
import moment from 'moment';
import { Row, Col, DatePicker, Button } from 'antd';
import { DatePickerDecorator } from 'antd/lib/date-picker/interface';

enum ActionType {
  ALL = 'ALL',
  TODAY = 'TODAY',
  RECENT_DAYS = 'RECENT_DAYS',
  RECENT_WEEK = 'RECENT_WEEK',
  DEFAULT = 'DEFAULT',
}

interface State {
  dates: undefined | [moment.Moment, moment.Moment];
  dateStrings: [string, string];
}

interface Action {
  type: ActionType;
  payload?: {
    dates: undefined | [moment.Moment, moment.Moment];
    dateStrings: [string, string];
  };
}

const initialState: State = {
  dates: undefined,
  dateStrings: ['', ''],
};

const reducer: React.Reducer<State, Action> = (state, action) => {
  const start = moment().startOf('day');
  const end = moment().endOf('day');

  switch (action.type) {
    case ActionType.ALL: {
      return {
        dates: undefined,
        dateStrings: ['', ''],
      };
    }
    case ActionType.TODAY: {
      return {
        dates: [start, end],
        dateStrings: [start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD')],
      };
    }
    case ActionType.RECENT_DAYS: {
      start.subtract(2, 'day');

      return {
        dates: [start, end],
        dateStrings: [start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD')],
      };
    }
    case ActionType.RECENT_WEEK: {
      start.subtract(6, 'day');

      return {
        dates: [start, end],
        dateStrings: [start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD')],
      };
    }
    default: {
      if (action.payload) {
        const { dates, dateStrings } = action.payload;

        return {
          dates: dates && dates.length === 2 ? [dates[0].startOf('day'), dates[1].endOf('day')] : undefined,
          dateStrings,
        };
      } else {
        throw new Error('Not found action.payload');
      }
    }
  }
};

// defines
const { RangePicker } = DatePicker;

interface SearchDateFormItemProps {
  value?: undefined | [moment.Moment, moment.Moment];
  onChange?: (dates: undefined | [moment.Moment, moment.Moment], dataString: [string, string]) => void;
}

const SearchDateFormItem = React.forwardRef<DatePickerDecorator, SearchDateFormItemProps>((props, ref) => {
  const { value, onChange }: SearchDateFormItemProps = props;

  const [isMount, setIsMount] = useState(false);
  const [state, dispatch] = useReducer<Reducer<State, Action>>(reducer, initialState);

  const handleChange = (dates: [moment.Moment, moment.Moment], dateStrings: [string, string]) => {
    dispatch({ type: ActionType.DEFAULT, payload: { dates, dateStrings } });
  };

  useEffect(() => {
    setIsMount(true);
  }, []);

  useEffect(() => {
    if (isMount && onChange) {
      onChange(state.dates, state.dateStrings);
    }
  }, [isMount, onChange, state]);

  return (
    <Row type="flex" align="middle" gutter={10}>
      <Col>
        <RangePicker
          placeholder={['시작일', '종료일']}
          value={value}
          onChange={(dates, dateStrings) => handleChange(dates as [moment.Moment, moment.Moment], dateStrings)}
        />
      </Col>
      <Col>
        <Button onClick={() => dispatch({ type: ActionType.ALL })}>전체</Button>
      </Col>
      <Col>
        <Button onClick={() => dispatch({ type: ActionType.TODAY })}>오늘</Button>
      </Col>
      <Col>
        <Button onClick={() => dispatch({ type: ActionType.RECENT_DAYS })}>최근 3일</Button>
      </Col>
      <Col>
        <Button onClick={() => dispatch({ type: ActionType.RECENT_WEEK })}>최근 7일</Button>
      </Col>
    </Row>
  );
});

export default SearchDateFormItem;
