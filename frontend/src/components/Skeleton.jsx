import React from 'react';

const Skeleton = ({ className, ...props }) => {
    return (
        <div
            className={`animate-pulse bg-cyber-gray/30 rounded ${className}`}
            {...props}
        />
    );
};

export default Skeleton;
