import YearlyHolidayList from '@/app/(view)/admin/yearly_holiday/yearly_holiday_list/page';
import React from 'react';

const YearlyHolidayAll = ({searchParams}) => {
    return (
        <div>
            <YearlyHolidayList
              searchParams={searchParams}
            ></YearlyHolidayList>
        </div>
    );
};

export default YearlyHolidayAll;