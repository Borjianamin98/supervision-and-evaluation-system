import React from 'react';

const DashboardView: React.FunctionComponent = () => {
    return (
        <div>
            You are signed in!!
            {localStorage.getItem("auth")}
        </div>
    );
}

export default DashboardView;