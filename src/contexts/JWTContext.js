import { createContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
// utils
import axios from '../utils/axios';
import { isValidToken, setSession } from '../utils/jwt';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { firebaseConfig } from '../config';
import { loginToServer } from 'src/redux/slices/user';
import { useDispatch, useSelector } from 'react-redux';

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

        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken);
          const x = JSON.parse(atob(accessToken.split('.')[1]))
          console.log("check admin token", x);
          if (x?.role === "Admin") {
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
            const firebaseToken = localStorage.getItem('firebaseToken')
            const respone = await axios.post(`/api/login/firebase`, { headers: { Authorization: `Baerer ${firebaseToken}` } })
            const { account } = respone.data.result
            if (respone.data.statusCode === 200) {
              dispatch({
                type: 'INITIALIZE',
                payload: { isAuthenticated: true, user: { id: account.id, displayName: account.name, email: account.email, role: 'User', photoURL: account.imageURL }, isInitialized: true }
              })
            } else {
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
        user.getIdToken().then((token) => { setSession(token); localStorage.setItem('firebaseToken', token) })
        // dispatchUser(loginToServer())
        dispatch({
          type: 'LOGINGOOGLE',
          payload: { user }
        });
      } else {
        dispatch({
          type: 'INITIALIZE',
          payload: { isAuthenticated: false, user: null }
        });
      }
    })
  };
  const login = async (Username, Password) => {
    const response = await axios.post('/api/login/admin', {
      Username,
      Password
    });
    const { token, account } = response.data.result;

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
