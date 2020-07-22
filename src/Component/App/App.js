import React, {Component} from 'react'
import './App.css'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import Login from '../Login/Login'
import Main from '../Main/Main'
import Profile from '../Profile/Profile'
import {toast, ToastContainer} from 'react-toastify'

function App(){
    const showToast = (type, message) => {
        switch (type) {
            case 0:
                toast.warning(message)
                break
            case 1:
                toast.success(message)
                break
            default:
                break
        }
    }

    return (
        <BrowserRouter>
            <div>
                <ToastContainer
                    autoClose={2000}
                    hideProgressBar={true}
                    position={toast.POSITION.BOTTOM_RIGHT}
                />
                <Switch>
                    <Route
                        exact
                        path="/"
                        render={props => <Login showToast={showToast} {...props} />}
                    />
                    <Route
                        exact
                        path="/main"
                        render={props => <Main showToast={showToast} {...props} />}
                    />
                    <Route
                        exact
                        path="/profile"
                        render={props => (
                            <Profile showToast={showToast} {...props} />
                        )}
                    />
                </Switch>
            </div>
        </BrowserRouter>
    )
}

export default App;
