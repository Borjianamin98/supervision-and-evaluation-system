import {Card, CardMedia, CardProps, makeStyles} from "@material-ui/core";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from '@material-ui/core/CardActions';
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import React from 'react';

interface MediaCardProps extends CardProps {
    media: string,
    title: string,
    subTitle: string[],
}

const useStyles = makeStyles((theme) => ({
    subtitle: {
        margin: theme.spacing(1, 0)
    },
}));

const MediaCard: React.FunctionComponent<MediaCardProps> = (props) => {
    const classes = useStyles();
    const {media, title, subTitle, ...rest} = props;

    return (
        <Card {...rest}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    height="180"
                    image={media}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5">
                        {title}
                    </Typography>
                    {
                        subTitle.map((value, index) =>
                            <Typography key={index} className={classes.subtitle} variant="body2" color="textSecondary">
                                {value}
                            </Typography>
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