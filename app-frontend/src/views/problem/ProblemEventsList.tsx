import {Box, CircularProgress} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {Pagination} from "@material-ui/lab";
import React from 'react';
import {useQuery, useQueryClient} from "react-query";
import CenterGrid from "../../components/Grid/CenterGrid";
import {ProblemEvent} from "../../model/problem/problemEvent";
import ProblemAuthenticatedService from "../../services/api/problem/ProblemAuthenticatedService";
import ProblemEventCard from "./ProblemEventCard";

interface ProblemEventListProps {
    problemId: number,
    pageSize: number,
}

const ProblemEventsList: React.FunctionComponent<ProblemEventListProps> = (props) => {
    const {problemId, pageSize} = props;

    const [page, setPage] = React.useState(0);

    const queryClient = useQueryClient();
    const {data: events, isLoading, isError} = useQuery(['events', problemId, pageSize, page],
        () => {
            return ProblemAuthenticatedService.retrieveProblemEvents(pageSize, page, problemId);
        }, {
            keepPreviousData: true
        });

    if (isLoading) {
        return <CenterGrid p={2}>
            <CircularProgress/>
        </CenterGrid>
    }

    if (isError) {
        return <CenterGrid p={2}>
            <Button
                variant="outlined"
                color="primary"
                onClick={() => queryClient.invalidateQueries(["events", problemId, pageSize, page])}
            >
                تلاش دوباره
            </Button>
        </CenterGrid>
    }

    // <ProblemEventCard
    //     title={"سامانه"}
    //     subheader={"سامانه"}
    //     body={"رخدادی ثبت نشده است."}
    // />
    return (
        <>
            {
                events?.content.sort((a, b) =>
                    new Date(a.createdDate!).valueOf() - new Date(b.createdDate!).valueOf())
                    .reverse()
                    .slice(0, 10)
                    .map((event: ProblemEvent) =>
                        <Box my={1}>
                            <ProblemEventCard
                                key={event.id}
                                title={event.createdBy!}
                                subheader={"کاربر"}
                                body={event.message}
                                date={event.createdDate!}
                            />
                        </Box>
                    )
            }
            <CenterGrid>
                <Pagination
                    count={events ? events.totalPages : 0}
                    page={page}
                    onChange={(event, newPage) => setPage(newPage)}
                />
            </CenterGrid>
        </>
    );
}

export default ProblemEventsList;