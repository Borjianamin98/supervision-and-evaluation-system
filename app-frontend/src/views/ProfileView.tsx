import {Avatar, Badge, Card, Grid} from "@material-ui/core";
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import React from 'react';
import InputFileIconButton from "../components/Input/InputFileIconButton";

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
                                    <InputFileIconButton accept="image/*">
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