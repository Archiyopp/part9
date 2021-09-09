import React from 'react';
import { CoursePart } from '../App';
import Part from './Part';

function Content({ courseParts }: { courseParts: CoursePart[] }) {
  return (
    <div>
      {courseParts.map((course) => (
        <Part course={course} key={course.name} />
      ))}
    </div>
  );
}

export default Content;
