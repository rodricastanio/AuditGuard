// Safe: render as text
import React from 'react';

function UserBio({ content }: { content: string }) {
  return <div>{content}</div>;
}

export default UserBio;
