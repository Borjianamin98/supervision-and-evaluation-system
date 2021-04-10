import {Avatar, Badge, Card, Grid} from "@material-ui/core";
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import React, {useEffect, useState} from 'react';
import InputFileIconButton from "../components/Input/InputFileIconButton";
import apiAxios, {getGeneralErrorMessage} from "../config/axios-config";
import {API_USER_PROFILE_PICTURE_PATH} from "../services/ApiPaths";
import {resizeImage} from "../utility/image-resize";

const PROFILE_PICTURE_MIME_TYPES = ["image/png", "image/jpeg"];
const PROFILE_PICTURE_MAX_SIZE = 500;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        card: {
            padding: theme.spacing(1, 0),
        },
        avatar: {
            width: theme.spacing(15),
            height: theme.spacing(15),
        },
        center: {
            textAlign: "center"
        },
        imageIcon: {
            display: "flex",
            justifyContent: "center"
        },
    }),
);

const ProfileView: React.FunctionComponent = () => {
    const classes = useStyles();
    const [avatar, setAvatar] = useState<string>("");

    useEffect(() => {
        apiAxios.get<Blob>(API_USER_PROFILE_PICTURE_PATH, {
            responseType: 'blob',
            validateStatus: status => status === 200
        })
            .then(value => setAvatar(window.URL.createObjectURL(value.data)))
            .catch(error => {
                // TODO: Show toast error with below error.
                console.log(getGeneralErrorMessage(error));
            });
    }, [])

    const onFileChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        event.preventDefault();
        const target = event.target;
        if (!target.files) {
            // User canceled upload file window
            return
        }
        const selectedFile = target.files[0];
        if (!PROFILE_PICTURE_MIME_TYPES.some(acceptType => selectedFile.type.match(acceptType))) {
            // TODO: Show toast error for invalid upload file
            return
        }

        resizeImage(selectedFile, PROFILE_PICTURE_MAX_SIZE, true)
            .then(resizedImageBlob => {
                const formData = new FormData();
                const file = new File([resizedImageBlob], "profile");
                formData.append('file', file);
                return apiAxios.post<FormData>(API_USER_PROFILE_PICTURE_PATH, formData, {
                    validateStatus: status => status === 200
                })
                    .then(() => resizedImageBlob)
                    .catch(err => {
                        // TODO: Handle connection error
                        console.log("connection error");
                        return Promise.reject(err);
                    });
            })
            .then(resizedImageBlob => setAvatar(window.URL.createObjectURL(resizedImageBlob)));
    }

    return (
        <div>
            <Grid container
                  spacing={2}
                  justify="center">
                <Grid item xs={12}>
                    <Card className={classes.card}>
                        <div className={classes.imageIcon}>
                            <Badge
                                badgeContent={
                                    <InputFileIconButton
                                        onFileChange={onFileChangeHandler}
                                        accept={PROFILE_PICTURE_MIME_TYPES.join(",")}
                                        edge="end"
                                        color="primary"
                                    >
                                        <PhotoCameraIcon/>
                                    </InputFileIconButton>
                                }
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                overlap="circle"
                            >
                                <Avatar src={avatar} className={classes.avatar}/>
                            </Badge>
                        </div>
                        <div className={classes.center}>
                            <h4>نام و نام خانوادگی</h4>
                            <h5>
                                دانشجوی مهندسی کامپیوتر
                            </h5>
                        </div>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
}

export default ProfileView;