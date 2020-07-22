import React, {useState, useEffect, useRef} from 'react';
import ReactLoading from 'react-loading';
import {withRouter} from 'react-router-dom';
import {myFirestore, myStorage} from '../../Config/MyFirebase';
import images from './../Themes/Images';
import './Profile.css';
import {AppString} from './../Const';
import 'react-toastify/dist/ReactToastify.css';

function Profile(props){

    const [profileDate, setProfileDate] = useState({
        id: localStorage.getItem(AppString.ID),
        nickname: localStorage.getItem(AppString.NICKNAME),
        aboutMe: localStorage.getItem(AppString.ABOUT_ME),
        photoUrl: localStorage.getItem(AppString.PHOTO_URL)
    })
    const [newAvatar, setNewAvatar] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        checkLogin()
    }) 

    const checkLogin = () => {
        if (!localStorage.getItem(AppString.ID)) {
            props.history.push('/')
        }
    }

    const onChangeNickname = event => {
        setProfileDate({...profileDate, "nickname": event.target.value})
    }

    const onChangeAboutMe = event => {
        setProfileDate({...profileDate, "aboutMe": event.target.value})
    }

    const onChangeAvatar = event => {
        if (event.target.files && event.target.files[0]) {
            const prefixFiletype = event.target.files[0].type.toString()
            if (prefixFiletype.indexOf(AppString.PREFIX_IMAGE) !== 0) {
                props.showToast(0, 'This file is not an image')
                return
            }
            setNewAvatar(event.target.files[0]);
            setProfileDate({...profileDate, photoUrl: URL.createObjectURL(event.target.files[0])})
        } else {
            props.showToast(0, 'Something wrong with input file')
        }
    }

    const uploadAvatar = () => {
        setIsLoading(true)
        if (newAvatar) {
            const uploadTask = myStorage
                .ref()
                .child(profileDate.id)
                .put(newAvatar)
            uploadTask.on(
                AppString.UPLOAD_CHANGED,
                null,
                err => {
                    props.showToast(0, err.message)
                },
                () => {
                    uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                        updateUserInfo(true, downloadURL)
                    })
                }
            )
        } else {
            updateUserInfo(false, null)
        }
    }

    const updateUserInfo = (isUpdatePhotoUrl, downloadURL) => {
        let newInfo
        if (isUpdatePhotoUrl) {
            newInfo = {
                nickname: profileDate.nickname,
                aboutMe: profileDate.aboutMe,
                photoUrl: downloadURL
            }
        } else {
            newInfo = {
                nickname: profileDate.nickname,
                aboutMe: profileDate.aboutMe
            }
        }
        myFirestore
            .collection(AppString.NODE_USERS)
            .doc(profileDate.id)
            .update(newInfo)
            .then(data => {
                localStorage.setItem(AppString.NICKNAME, profileDate.nickname)
                localStorage.setItem(AppString.ABOUT_ME, profileDate.aboutMe)
                if (isUpdatePhotoUrl) {
                    localStorage.setItem(AppString.PHOTO_URL, downloadURL)
                }
                setIsLoading(false);
                props.showToast(1, 'Update info success')
            })
    }

    const refInput = useRef(null);
    console.log('url', profileDate.photoUrl)
    return (
        <div className="root">
            <div className="header">
                <span>PROFILE</span>
            </div>

            <img className="avatar" alt="Avatar" src={profileDate.photoUrl}/>

            <div className="viewWrapInputFile">
                <img
                    className="imgInputFile"
                    alt="icon gallery"
                    src={images.ic_input_file}
                    onClick={() => refInput.current.click()}
                />
                <input
                    ref={refInput}
                    accept="image/*"
                    className="viewInputFile"
                    type="file"
                    onChange={onChangeAvatar}
                />
            </div>

            <span className="textLabel">Nickname:</span>
            <input
                className="textInput"
                value={profileDate.nickname ? profileDate.nickname : ''}
                placeholder="Your nickname..."
                onChange={onChangeNickname}
            />
            <span className="textLabel">About me:</span>
            <input
                className="textInput"
                value={profileDate.aboutMe ? profileDate.aboutMe : ''}
                placeholder="Tell about yourself..."
                onChange={onChangeAboutMe}
            />

            <button className="btnUpdate" onClick={uploadAvatar}>
                UPDATE
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

export default withRouter(Profile)
