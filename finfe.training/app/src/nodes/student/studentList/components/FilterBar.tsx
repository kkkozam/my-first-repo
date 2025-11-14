import React from 'react';
import { Select } from '@ss/mtd-react3'; 
import {mockGenderOptions,mockClassOptions,mockEnrollmentYearOptions,mockHobbyOptions} from '../../../../apis/mockData';

const BasicfilterBar = () => {
    return (
        <>
        <div>
            <p>姓别：</p>
            <Select 
                placeholder="请选择" 
                style={{ width: '160px' } }
                options={mockGenderOptions}
            />
        </div>
        <div>
            <p>班级：</p>
            <Select 
                placeholder="请选择" 
                style={{ width: '160px' } }
                options={mockClassOptions}
            />
        </div>
        <div>
            <p>入学年份：</p>
            <Select 
                placeholder="请选择" 
                style={{ width: '160px' } }
                options={mockEnrollmentYearOptions}
            />
        </div>
        </>

    );
}

const AdvancedFilterBar = () => {
    return (
        <div>
            <p>高级筛选：</p>
            <Select 
                multiple
                placeholder="请选择" 
                style={{ width: '170px' } }
                options={mockHobbyOptions}
            />
        </div>
    );
}


export  {BasicfilterBar};
export { AdvancedFilterBar };
