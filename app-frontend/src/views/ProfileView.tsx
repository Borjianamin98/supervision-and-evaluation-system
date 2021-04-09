import {Avatar, Card, Grid} from "@material-ui/core";
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        card: {
            padding: theme.spacing(1, 0),
        },
        avatar: {
            width: theme.spacing(15),
            height: theme.spacing(15),
            marginLeft: "auto",
            marginRight: "auto"
        },
        center: {
            textAlign: "center"
        }
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
                        <Avatar className={classes.avatar}/>
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