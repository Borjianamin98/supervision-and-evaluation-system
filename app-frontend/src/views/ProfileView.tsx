import {Avatar, Badge, Card, Grid} from "@material-ui/core";
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import React from 'react';
import InputFileIconButton from "../components/Input/InputFileIconButton";
import apiAxios from "../config/axios-config";
import {API_USER_PROFILE_PICTURE_PATH} from "../services/ApiPaths";

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

    const onFileChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        event.preventDefault();
        if (!event.target.files) {
            // User canceled upload file window
            return
        }

        const formData = new FormData();
        formData.append('file', event.target.files[0]);
        apiAxios.post(API_USER_PROFILE_PICTURE_PATH, formData)
            .then(res => {
                if (res.status === 200) {
                    console.log(res.data);
                    alert("File uploaded successfully.")
                } else {
                    console.log("error");
                }
            })
            .catch(err => console.log("error"));


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
                                    <InputFileIconButton onFileChange={onFileChangeHandler} accept="image/png">
                                        <PhotoCameraIcon/>
                                    </InputFileIconButton>
                                }
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                overlap="circle"
                            >
                                <Avatar className={classes.avatar}/>
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