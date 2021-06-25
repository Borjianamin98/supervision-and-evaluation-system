import {Avatar, Box, CircularProgress, createStyles, Grid, makeStyles, Theme, useTheme} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import GradeIcon from '@material-ui/icons/Grade';
import {Pagination} from "@material-ui/lab";
import React from 'react';
import {useQuery, useQueryClient} from "react-query";
import CustomAlert from "../../../components/Alert/CustomAlert";
import CenterBox from "../../../components/Grid/CenterBox";
import CustomRating from "../../../components/Rating/CustomRating";
import CustomTypography from "../../../components/Typography/CustomTypography";
import {PeerReview} from "../../../model/review/peer/PeerReview";
import MasterService from "../../../services/api/user/MasterService";
import LocaleUtils from "../../../utility/LocaleUtils";
import PeerReviewCard from "./PeerReviewCard";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            border: "1px solid",
            borderRadius: 5,
            borderColor: theme.palette.info.main,
            boxShadow: "none",
            padding: theme.spacing(1, 0),
        },
    }),
);

interface MasterPeerReviewListProps {
    masterId: number,
    pageSize: number,
}

const MasterPeerReviewList: React.FunctionComponent<MasterPeerReviewListProps> = (props) => {
    const classes = useStyles();
    const theme = useTheme();
    const {masterId, pageSize} = props;

    const [page, setPage] = React.useState(0);
    const queryClient = useQueryClient();
    const {
        data: aggregatedPeerReviews,
        isLoading,
        isError
    } = useQuery(["masterPeerReviews", masterId, pageSize, page],
        () => {
            return MasterService.retrieveAggregatedMasterPeerReviews(pageSize, page, masterId,
                "createdDate", "desc");
        }, {
            keepPreviousData: true
        });

    if (isLoading) {
        return <CenterBox p={2}>
            <CircularProgress/>
        </CenterBox>
    }

    if (isError || aggregatedPeerReviews === undefined) {
        return <CenterBox p={2}>
            <Button
                variant="outlined"
                color="primary"
                onClick={() => queryClient.invalidateQueries(["masterPeerReviews", masterId, pageSize, page])}
            >
                تلاش دوباره
            </Button>
        </CenterBox>
    }

    const peerReviews = aggregatedPeerReviews.peerReviews;
    if (peerReviews.totalElements === 0) {
        return <CustomAlert severity="info">هیچ نظری تاککنون برای استاد ثبت نشده است..</CustomAlert>;
    }

    return (
        <>
            <Grid container alignItems={"center"} className={classes.root}>
                <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                    <CenterBox>
                        <Avatar style={{marginBottom: 8, backgroundColor: theme.palette.primary.main}}>
                            <GradeIcon/>
                        </Avatar>
                        <CustomTypography>
                            {LocaleUtils.convertToPersianDigits(aggregatedPeerReviews.averageScore.toString())}
                        </CustomTypography>
                        <CustomTypography>
                            {`از مجموع ${LocaleUtils.convertToPersianDigits(peerReviews.totalElements.toString())} نظر`}
                        </CustomTypography>
                    </CenterBox>
                </Grid>
                <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                    {
                        Object.entries(aggregatedPeerReviews.scoresCount)
                            .sort(([key1,], [key2,]) => key1.localeCompare(key2))
                            .map(([score, count]) => {
                                return <CenterBox flexDirection={"row"} justifyContent={"flex-start"} marginBottom={1}>
                                    <CustomRating
                                        name={`rating-${score}`}
                                        labelPosition={"none"}
                                        value={parseInt(score)}
                                        onValueChange={() => undefined}
                                        readOnly
                                    />
                                    <Box ml={2}>
                                        {`${LocaleUtils.convertToPersianDigits(count.toString())} نفر`}
                                    </Box>
                                </CenterBox>
                            })
                    }
                </Grid>
            </Grid>
            {
                peerReviews.content.map((peerReview: PeerReview) => <Box my={1} key={peerReview.id}>
                    <PeerReviewCard
                        content={peerReview.content}
                        score={peerReview.score}
                        date={peerReview.createdDate}
                    />
                </Box>)
            }
            <CenterBox>
                <Pagination
                    count={peerReviews.totalPages}
                    page={page + 1}
                    color="primary"
                    onChange={(event, newPage) => setPage(newPage - 1)}
                />
            </CenterBox>
        </>
    );
}

export default MasterPeerReviewList;