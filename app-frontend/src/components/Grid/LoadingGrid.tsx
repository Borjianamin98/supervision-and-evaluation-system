import {CircularProgress, Fade} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";
import LoadingImage from "../../assets/images/loading/loading.png";
import NoConnectionImage from "../../assets/images/noConnection/noConnection.png";
import CenterGrid from "./CenterGrid";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: theme.spacing(2),
        },
        image: {
            maxWidth: 400,
            margin: theme.spacing(0, 0, 2, 0),
        },
        content: {
            margin: theme.spacing(2, 0),
        },
        progress: {
            margin: theme.spacing(2, 0),
        }
    }),
);

interface LoadingGridProps {
    isLoading: boolean,
    isError: boolean,
    onRetryClick: () => void,
}

const LoadingGrid: React.FunctionComponent<LoadingGridProps> = (props) => {
    const classes = useStyles();
    const {isLoading, isError, onRetryClick} = props;

    const timerRef = React.useRef<number>();
    const [show, setShow] = React.useState(false);

    React.useEffect(
        () => () => {
            clearTimeout(timerRef.current);
        },
        [],
    );

    timerRef.current = window.setTimeout(() => {
        setShow(true);
    }, 1000);

    const loadingImage = <img src={LoadingImage} alt="بارگیری" className={classes.image}/>;
    const errorImage = <img src={NoConnectionImage} alt="مشکل در ارتباط" className={classes.image}/>;
    const imageElement = isLoading ? loadingImage : isError ? errorImage : null;


    return (
        <CenterGrid>
            <Fade
                in={show}
                style={{
                    transitionDelay: '1000ms',
                }}
                unmountOnExit
            >
                <>
                    {imageElement}
                    {isLoading ? <CircularProgress className={classes.progress}/> : undefined}
                    <Typography className={classes.content}>
                        {
                            isLoading ? "در حال دریافت اطلاعات" :
                                isError ? "در دریافت اطلاعات از سرور خطایی رخ داده است." :
                                    null
                        }
                    </Typography>
                    {
                        isError ? (
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => onRetryClick()}
                            >
                                تلاش دوباره
                            </Button>
                        ) : undefined
                    }
                </>
            </Fade>
        </CenterGrid>
    );
}

export default LoadingGrid;