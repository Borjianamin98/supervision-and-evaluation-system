import {Box, CircularProgress} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {Pagination} from "@material-ui/lab";
import {AxiosError} from "axios";
import {useSnackbar} from "notistack";
import React from 'react';
import {useQuery, useQueryClient} from "react-query";
import CustomAlert from "../../components/Alert/CustomAlert";
import CenterBox from "../../components/Grid/CenterBox";
import {generalErrorHandler} from "../../config/axios-config";
import {roleMapToPersian} from "../../model/enum/role";
import {ProblemEvent} from "../../model/problem/problemEvent";
import AuthenticationService from "../../services/api/AuthenticationService";
import ProblemAuthenticatedService from "../../services/api/problem/ProblemAuthenticatedService";
import {BACKEND_SERVICE_HOST} from "../../services/ApiPaths";
import ProblemEventCard from "./ProblemEventCard";

interface ProblemEventListProps {
    problemId: number,
    pageSize: number,
}

const ProblemEventsList: React.FunctionComponent<ProblemEventListProps> = (props) => {
    const {enqueueSnackbar} = useSnackbar();
    const queryClient = useQueryClient();
    const {problemId, pageSize} = props;

    const [page, setPage] = React.useState(0);
    const {data: events, isLoading, isError} = useQuery(["problemEvents", problemId, pageSize, page],
        () => {
            return ProblemAuthenticatedService.retrieveProblemEvents(pageSize, page, problemId,
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
                onClick={() => queryClient.invalidateQueries(["events", problemId, pageSize, page])}
            >
                تلاش دوباره
            </Button>
        </CenterBox>
    }

    const problemEventCards = events?.content.map((event: ProblemEvent) =>
        <Box my={1} key={event.id}>
            <ProblemEventCard
                title={event.createdBy}
                subheader={roleMapToPersian(event.createdByRole)}
                body={event.message}
                date={event.createdDate}
                hasAttachment={event.hasAttachment}
                onAttachmentClick={() => {
                    AuthenticationService.getDownloadToken()
                        .then((value) => {
                            const downloadLink = `${BACKEND_SERVICE_HOST}${event.attachmentLink}?token=${value.token}`;
                            window.open(downloadLink, "_blank");
                        })
                        .catch((error: AxiosError) => generalErrorHandler(error, enqueueSnackbar))
                }}
            />
        </Box>
    )

    return (
        <>
            {
                events && events.totalPages !== 0 ? problemEventCards :
                    <CustomAlert severity="info">هیچ رخدادی ثبت نشده است.</CustomAlert>
            }
            <CenterBox>
                <Pagination
                    count={events ? events.totalPages : 0}
                    hidden={events && events.totalPages === 0}
                    page={page + 1}
                    color="primary"
                    onChange={(event, newPage) => setPage(newPage - 1)}
                />
            </CenterBox>
        </>
    );
}

export default ProblemEventsList;