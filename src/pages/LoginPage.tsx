import { useEffect, useState } from 'react';

const client_id = 'bfca6242ab51f259a7e6';

export const LoginPage = () => {
  /**
   * connect to github with client_id
   */
  const connectGihub = async () => {
    console.log('connect');
    window.location.assign(
      `https://github.com/login/oauth/authorize?client_id=${client_id}&scope=public_repo`
    );
  };

  return (
    <div className="App">
      <button onClick={connectGihub}>連接 github</button>
    </div>
  );
};
