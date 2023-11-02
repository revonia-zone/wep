import React, {useEffect, useState} from 'react';
import './App.css';
import {
  Link,
  RouterProvider,
} from "react-router-dom";
import router from "./routes/router";
import {container} from "tsyringe";
import {AuthUnit} from "./units/AuthUnit";
import {P2pUnit} from "./units/P2pUnit";

function App() {
  const [loading, setLoading] = useState(true);
  const [loginProcess, setLoginProcess] = useState(false);

  useEffect(() => {
    (async () => {
      if (loginProcess) {
        return
      }
      setLoginProcess(true)
      const auth = container.resolve(AuthUnit)
      const p2p = container.resolve(P2pUnit)
      let user = await auth.getCurrentUser()
      if (!user) {
        user = await auth.createGuestUser()
        auth.setCurrentUser(user)
      }
      await p2p.start()
      setLoading(false)
    })()
  }, [loginProcess]);

  return (
    <div>
      {loading ? <h1>loading...</h1> : <RouterProvider router={router} />}
    </div>
  );
}

export default App;
