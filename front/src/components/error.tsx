import React from 'react';

interface ErrorProps {
  message: string;
}

const Error: React.FC<ErrorProps> = ({ message }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'red',
        color: 'white',
        padding: '10px',
        borderRadius: '4px',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      <p>Error: {message}</p>
    </div>
  );
};

export default Error;
