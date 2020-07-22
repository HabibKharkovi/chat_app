import firebase from 'firebase'
import React, {useState, useEffect} from 'react'
import ReactLoading from 'react-loading'
import {withRouter} from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import {myFirebase, myFirestore} from '../../Config/MyFirebase'
import './Login.css'
import {AppString} from './../Const'

function Login(props){

    const provider = new firebase.auth.GoogleAuthProvider()

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        checkLogin()
    })

    const checkLogin = () => {
        if (localStorage.getItem(AppString.ID)) {
            setIsLoading(false);
            props.showToast(1, 'Login success')
            props.history.push('/main')
        } else {
            setIsLoading(false);
        }
    }

    const onLoginPress = () => {
        setIsLoading(false);
        myFirebase
            .auth()
            .signInWithPopup(provider)
            .then(async result => {
                let user = result.user
                if (user) {
                    const result = await myFirestore
                        .collection(AppString.NODE_USERS)
                        .where(AppString.ID, '==', user.uid)
                        .get()

                    if (result.docs.length === 0) {
                        myFirestore
                            .collection('users')
                            .doc(user.uid)
                            .set({
                                id: user.uid,
                                nickname: user.displayName,
                                aboutMe: '',
                                photoUrl: user.photoURL
                            })
                            .then(data => {
                                localStorage.setItem(AppString.ID, user.uid)
                                localStorage.setItem(AppString.NICKNAME, user.displayName)
                                localStorage.setItem(AppString.PHOTO_URL, user.photoURL)
                                setIsLoading(false);
                                props.showToast(1, 'Login success')
                                props.history.push('/main')
                            })
                    } else {
                        localStorage.setItem(AppString.ID, result.docs[0].data().id)
                        localStorage.setItem(
                            AppString.NICKNAME,
                            result.docs[0].data().nickname
                        )
                        localStorage.setItem(
                            AppString.PHOTO_URL,
                            result.docs[0].data().photoUrl
                        )
                        localStorage.setItem(
                            AppString.ABOUT_ME,
                            result.docs[0].data().aboutMe
                        )
                        setIsLoading(false);
                        props.showToast(1, 'Login success')
                        props.history.push('/main')
                        
                    }
                } else {
                    props.showToast(0, 'User info not available')
                }
            })
            .catch(err => {
                props.showToast(0, err.message)
                setIsLoading(false);
            })
    }

    return (
        <div className="viewRoot">
            <div className="header">CHAT DEMO</div>
            <button className="btnLogin" type="submit" onClick={onLoginPress}>
                SIGN IN WITH GOOGLE
            </button>

            {isLoading ? (
                <div className="viewLoading">
                    <ReactLoading
                        type={'spin'}
                        color={'#203152'}
                        height={'3%'}
                        width={'3%'}
                    />
                </div>
            ) : null}
        </div>
    )
}

export default withRouter(Login);
