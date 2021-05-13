import {GridProps} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: theme.spacing(2),
        }
    }),
);

const CenterGrid: React.FunctionComponent<GridProps> = (props) => {
    const classes = useStyles();

    return (
        <Grid container
              direction="column"
              dir="rtl"
              justify="center"
              alignItems="center"
              className={classes.root}
              {...props}
        >
            {props.children}
        </Grid>
    );
}

export default CenterGrid;