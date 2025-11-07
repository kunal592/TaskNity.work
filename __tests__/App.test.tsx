import React from 'react';
import { render } from '@testing-library/react';
import AttendancePage from '../src/app/attendance/page';

describe('AttendancePage', () => {
  it('renders without crashing', () => {
    render(<AttendancePage />);
  });
});
