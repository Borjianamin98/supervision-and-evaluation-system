import {Avatar, Box, Button, Grid, Paper} from "@material-ui/core";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import React from 'react';
import CenterBox from "../../../components/Grid/CenterBox";
import {User, userRoleInfo} from "../../../model/user/User";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        avatar: {
            width: 120,
            height: 120,
        },
        centerAlignment: {
            textAlign: "center",
        },
    }),
);

interface ProfileInfoCardProps {
    user?: User,
    subheader?: string,
    hasDelete?: boolean,
    onDelete: () => void,
}

const ProfileInfoCard: React.FunctionComponent<ProfileInfoCardProps> = (params) => {
    const classes = useStyles();
    const {user, subheader, hasDelete, onDelete} = params;
    const hasButtons = hasDelete;

    return (
        <Box component={Paper} display="flex" padding={2} flexDirection="column">
            <CenterBox marginRight={1}>
                <Avatar src={""} className={classes.avatar}/>
            </CenterBox>
            <Box display="flex" flexDirection="column" flexGrow={1} className={classes.centerAlignment}>
                <Typography variant="h6" gutterBottom className={classes.centerAlignment}>{user?.fullName}</Typography>
                <Typography variant="subtitle1" color="textSecondary">
                    {user ? userRoleInfo(user) : ""}
                </Typography>
                {
                    subheader ? (
                        <Typography variant="subtitle1" color="textSecondary">
                            {subheader}
                        </Typography>
                    ) : undefined
                }
                <Box marginTop={hasButtons ? 1 : undefined} display={hasButtons ? undefined : "none"}>
                    <Grid container alignItems="center" justify="center" spacing={1}>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="secondary"
                                startIcon={<DeleteIcon/>}
                                onClick={() => onDelete()}
                            >
                                حذف داور
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Box>
    )
}

export default ProfileInfoCard;