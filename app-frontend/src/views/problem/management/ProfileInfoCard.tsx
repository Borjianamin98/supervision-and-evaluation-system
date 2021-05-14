import {Avatar, Box, Button, Card, CardMedia, Grid} from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import React from 'react';
import {User, userRoleInfo} from "../../../model/user/user";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        avatar: {
            width: 130,
            height: 130,
        },
        root: {
            display: "flex",
            flexDirection: "row-reverse",
        },
        content: {
            flex: "1 0 auto",
        },
        media: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
        },
    }),
);

interface ProfileInfoCardProps {
    user?: User,
    actionVisible: boolean,
    subheader?: string,
}

const ProfileInfoCard: React.FunctionComponent<ProfileInfoCardProps> = (params) => {
    const classes = useStyles();
    const {user, actionVisible, subheader} = params;

    return (
        <Card className={classes.root}>
            <Grid container direction="column">
                <CardContent className={classes.content}>
                    <Typography variant="h5" paragraph>{user?.fullName}</Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        {user ? userRoleInfo(user) : ""}
                    </Typography>
                    {
                        subheader ? (
                            <Typography variant="subtitle1" color="textSecondary" paragraph>
                                {subheader}
                            </Typography>
                        ) : undefined
                    }
                    <Box marginTop={1} display={actionVisible ? undefined : "none"}>
                        <Grid container alignItems="center" justify="center" spacing={1}>
                            <Grid item>
                                <Button variant="contained" color="secondary" startIcon={<EditIcon/>}>
                                    ویرایش
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button variant="contained" color="secondary" startIcon={<DeleteIcon/>}>
                                    حذف
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </CardContent>
            </Grid>
            <CardMedia className={classes.media}>
                <Box mx={1}>
                    <Avatar src={""} className={classes.avatar}/>
                </Box>
            </CardMedia>
        </Card>
    )
}

export default ProfileInfoCard;