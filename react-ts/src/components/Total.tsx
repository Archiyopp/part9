import React from 'react';
import { CoursePart } from '../App';

const Total = ({ courseParts }: { courseParts: CoursePart[] }) => {
  return (
    <p>
      Number of exercises:{' '}
      {courseParts.reduce(
        (sum, course) => (sum += course.exerciseCount),
        0
      )}
    </p>
  );
};

export default Total;
