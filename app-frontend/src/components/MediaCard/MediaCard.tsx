import {Card, CardMedia, CardProps} from "@material-ui/core";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from '@material-ui/core/CardActions';
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import React from 'react';

interface MediaCardProps extends CardProps {
    media: string,
    title: string,
    subTitle: string,
}

const MediaCard: React.FunctionComponent<MediaCardProps> = (props) => {
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
                    <Typography variant="body2" color="textSecondary">
                        {subTitle}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                {props.children}
            </CardActions>
        </Card>
    );
}

export default MediaCard;