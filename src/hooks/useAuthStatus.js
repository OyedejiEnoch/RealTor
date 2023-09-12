import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";

export function useAuthStatus() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
      }
      setLoading(false);
    });
    // i.e onAuthStateChange i.e when the auth state changes (the auth can change to if there is a user or not),
    // if there is a user setLoggedIn
    // and once the state changes i.e if there is a state setLoading to false

    // therefore the onAuthStateChanged servers like a redux action listening to changes in out state
  }, []);
  return { loggedIn, loading };
}
