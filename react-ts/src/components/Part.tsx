import React from 'react';
import { CoursePart } from '../App';

const Part = ({ course }: { course: CoursePart }) => {
  const title = (
    <h2 style={{ fontSize: '20px' }}>
      {course.name} {course.exerciseCount}
    </h2>
  );

  switch (course.type) {
    case 'groupProject': {
      return (
        <div>
          {title}
          <div>project exercises {course.groupProjectCount}</div>
        </div>
      );
    }
    case 'normal': {
      return (
        <div>
          {title}
          <div>
            <em>{course.description}</em>
          </div>
        </div>
      );
    }
    case 'submission': {
      return (
        <div>
          {title}
          <div>
            <em>{course.description}</em>
          </div>
          <div>submit to {course.exerciseSubmissionLink}</div>
        </div>
      );
    }
    case 'special': {
      return (
        <div>
          {title}
          <div>
            <em>{course.description}</em>
          </div>
          <div>required skills: {course.requirements.join(', ')}</div>
        </div>
      );
    }

    default:
      return (
        <p style={{ color: 'red' }}>
          <strong>Course part not valid</strong>
        </p>
      );
  }
};

export default Part;
