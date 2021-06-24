import {Box, CircularProgress} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {Pagination} from "@material-ui/lab";
import React from 'react';
import {useQuery, useQueryClient} from "react-query";
import CustomAlert from "../../../components/Alert/CustomAlert";
import CenterBox from "../../../components/Grid/CenterBox";
import {roleMapToPersian} from "../../../model/enum/role";
import {PeerReview} from "../../../model/review/PeerReview";
import MasterService from "../../../services/api/user/MasterService";
import PeerReviewCard from "./PeerReviewCard";

interface MasterPeerReviewListProps {
    masterId: number,
    pageSize: number,
}

const MasterPeerReviewList: React.FunctionComponent<MasterPeerReviewListProps> = (props) => {
    const {masterId, pageSize} = props;

    const [page, setPage] = React.useState(0);
    const queryClient = useQueryClient();
    const {data: peerReviews, isLoading, isError} = useQuery(["masterPeerReviews", masterId, pageSize, page],
        () => {
            return MasterService.retrieveMasterPeerReviews(pageSize, page, masterId,
                "createdDate", "desc");
        }, {
            keepPreviousData: true
        });

    if (isLoading) {
        return <CenterBox p={2}>
            <CircularProgress/>
        </CenterBox>
    }

    if (isError) {
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

    const problemEventCards = peerReviews?.content.map((peerReview: PeerReview) =>
        <Box my={1} key={peerReview.id}>
            <PeerReviewCard
                content={peerReview.content}
                score={peerReview.score}
                date={peerReview.createdDate}
            />
        </Box>
    )

    return (
        <>
            {
                peerReviews && peerReviews.totalPages !== 0 ? problemEventCards :
                    <CustomAlert severity="info">هیچ نظری تاککنون برای استاد ثبت نشده است..</CustomAlert>
            }
            <CenterBox>
                <Pagination
                    count={peerReviews ? peerReviews.totalPages : 0}
                    hidden={peerReviews && peerReviews.totalPages === 0}
                    page={page + 1}
                    color="primary"
                    onChange={(event, newPage) => setPage(newPage - 1)}
                />
            </CenterBox>
        </>
    );
}

export default MasterPeerReviewList;