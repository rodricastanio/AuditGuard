// Vulnerable: XSS via dangerouslySetInnerHTML
import React from 'react';

function UserBio({ content }: { content: string }) {
  return (
    // noinspection ReactDangerouslySetInnerHTMLInspection
    <div dangerouslySetInnerHTML={{ __html: content }} />
  );
}

export default UserBio;
