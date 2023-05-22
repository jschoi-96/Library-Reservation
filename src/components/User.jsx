import React from "react";

export default function User({ user: { photoURL, displayName } }) {
  return (
    <div className="flex items-center">
      <img
        className="w-10 h-10 rounded-full mr-3"
        src={photoURL}
        alt={displayName}
      />
      <span className="hidden sm:block mr-3"> {displayName} </span>
    </div>
  );
}
