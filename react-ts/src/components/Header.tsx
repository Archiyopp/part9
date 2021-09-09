import React from 'react';

function Header({ courseName }: { courseName: string }) {
  return (
    <div>
      <h1>{courseName}</h1>
    </div>
  );
}

export default Header;
