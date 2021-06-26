import {Card, CardMedia, CardProps, makeStyles} from "@material-ui/core";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from '@material-ui/core/CardActions';
import CardContent from "@material-ui/core/CardContent";
import React from 'react';
import CustomTypography from "../Typography/CustomTypography";

const useStyles = makeStyles((theme) => ({
    root: {
        margin: theme.spacing(1),
    },
}));

interface MediaCardProps extends CardProps {
    media: string,
    mediaHeight?: number,
    title: string,
    subTitle: string[],
}

const MediaCard: React.FunctionComponent<MediaCardProps> = (props) => {
    const classes = useStyles();
    const {media, mediaHeight, title, subTitle, ...rest} = props;

    return (
        <Card className={classes.root} {...rest}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    height={mediaHeight ?? 180}
                    image={media}
                />
                <CardContent>
                    <CustomTypography gutterBottom variant="h5">
                        {title}
                    </CustomTypography>
                    {
                        subTitle.map((value, index) =>
                            <CustomTypography
                                key={index}
                                lineHeight={2}
                                variant="body2"
                                color="textSecondary">
                                {value}
                            </CustomTypography>
                        )
                    }
                </CardContent>
            </CardActionArea>
            <CardActions>
                {props.children}
            </CardActions>
        </Card>
    );
}

export default MediaCard;