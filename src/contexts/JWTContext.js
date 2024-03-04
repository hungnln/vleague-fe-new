import { createContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
// utils
import axios from '../utils/axios';
import { isValidToken, setSession } from '../utils/jwt';
// import firebase from 'firebase/app';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { SUCCESS, firebaseConfig } from '../config';
import { loginToServer } from 'src/redux/slices/user';
import { useDispatch, useSelector } from 'react-redux';
import { getStorage } from 'firebase/storage';

// ----------------------------------------------------------------------

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  // firebase.firestore();
}
export const storage = getStorage(firebase.app())
const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user
    };
  },
  LOGIN: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null
  }),
  REGISTER: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  LOGINGOOGLE: (state, action) => {
    const { user } = action.payload;
    return {
      ...state,
      isAuthenticated: true,
      user
    };
  }
};

const reducer = (state, action) => (handlers[action.type] ? handlers[action.type](state, action) : state);

const AuthContext = createContext({
  ...initialState,
  method: 'jwt',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
  loginWithGoogle: () => Promise.resolve(),
});

AuthProvider.propTypes = {
  children: PropTypes.node
};

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const dispatchUser = useDispatch()
  // const accessToken = window.localStorage.getItem('accessToken');


  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem('accessToken');
        console.log("check admin token", accessToken);
        const firebaseToken = localStorage.getItem('firebaseToken')

        if (accessToken&& isValidToken(accessToken)) {
          setSession(accessToken);
          const x = JSON.parse(atob(accessToken.split('.')[1]))
          console.log("check admin token", x);
          if (x?.authorities === "ADMIN") {
            dispatch({
              type: 'INITIALIZE',
              payload: {
                isAuthenticated: true,
                user: { role: 'Admin', displayName: 'Admin' }
              }
            });
          }
          else {
            console.log('check  firebase');
            const respone = await axios.post(`/login/firebase`, { token: firebaseToken })
            const { account } = respone.data.data
            if (respone.data.status === SUCCESS) {
              dispatch({
                type: 'INITIALIZE',
                payload: { isAuthenticated: true, user: { id: account.id, displayName: account.name, email: account.email, role: 'User', photoURL: account.imageURL }, isInitialized: true }
              })
            } else {
              localStorage.removeItem('firebaseToken')
              dispatch({
                type: 'INITIALIZE',
                payload: {
                  isAuthenticated: false,
                  user: null
                }
              });
            }

          }
        }

        // const response = await axios.post('/api/login/admin');

        else {
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: false,
              user: null
            }
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null
          }
        });
      }
    };

    initialize();
  }, []);
  // useEffect(
  //   () =>
  //     firebase.auth().onAuthStateChanged((user) => {
  //       if (user) {
  //         // const docRef = firebase.firestore().collection('users').doc(user.uid);
  //         user.getIdToken().then((idToken) => { localStorage.setItem('accessToken', idToken); console.log(idToken, "firebase token"); })
  //         dispatchUser(loginToServer())
  //         // docRef
  //         //   .get()
  //         //   .then((doc) => {
  //         //     if (doc.exists) {
  //         //       setProfile(doc.data());
  //         //     }
  //         //   })
  //         //   .catch((error) => {
  //         //     console.error(error);
  //         //   });

  //         dispatch({
  //           type: 'INITIALISE',
  //           payload: { isAuthenticated: true, user }
  //         });
  //       } else {
  //         dispatch({
  //           type: 'INITIALISE',
  //           payload: { isAuthenticated: false, user: null }
  //         });
  //       }
  //     }),
  //   [dispatch]
  // );
  const loginWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        user.getIdToken().then(async (token) => {
          localStorage.setItem('firebaseToken', token)
          // setSession(token)
          const respone = await axios.post(`/login/firebase`, { token })
          if (respone.data.status === SUCCESS) {
            const { token, account } = respone.data.data;
            setSession(token);
            dispatch({
              type: 'LOGINGOOGLE',
              payload: { user: { id: account.id, displayName: account.name, email: account.email, role: 'User', photoURL: account.imageURL } }
            });
          }

        })


      } else {
        dispatch({
          type: 'INITIALIZE',
          payload: { isAuthenticated: false, user: null }
        });
      }
    })
  };
  const login = async (username, password) => {
    // if(username !== 'admin' || password !== 'admin'){
    //   return
    // }
    const response = await axios.post('/login/admin', {
      username,
      password
    });
    const { token, account } = response.data.data;
    // const fakeToken='eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkbWluIiwiYWRtaW4iOnRydWUsImlhdCI6MTcwMDY1MDE3MiwiZXhwIjoxNzAwNjUzNzcyLCJyb2xlIjoiQWRtaW4ifQ.PBtYkUq1ZxqrvVzVpSvJPIikD4Mw2U-Ld-KDfENrEmQ'
    setSession(token);

    dispatch({
      type: 'LOGIN',
      payload: {
        user: { role: 'Admin', displayName: 'Admin' }
      }
    });

  };

  const register = async (email, password, firstName, lastName) => {
    const response = await axios.post('/api/account/register', {
      email,
      password,
      firstName,
      lastName
    });
    const { accessToken, user } = response.data;

    window.localStorage.setItem('accessToken', accessToken);
    dispatch({
      type: 'REGISTER',
      payload: {
        user
      }
    });
  };

  const logout = async () => {
    console.log("logout");
    setSession(null);
    localStorage.removeItem('firebaseToken')
    await firebase.auth().signOut();
    dispatch({ type: 'LOGOUT' });
  };

  const resetPassword = () => { };

  const updateProfile = () => { };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        login,
        logout,
        register,
        resetPassword,
        updateProfile,
        loginWithGoogle
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
