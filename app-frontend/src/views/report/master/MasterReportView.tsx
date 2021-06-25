import {Box, Grid, Paper} from "@material-ui/core";
import {createStyles, makeStyles, Theme, ThemeProvider} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from 'react';
import {useQuery, useQueryClient} from "react-query";
import {rtlTheme} from "../../../App";
import ExtendedTableRow from "../../../components/Table/ExtendedTableRow";
import {OptionalTableCellProps} from "../../../components/Table/OptionalTableCell";
import StatelessPaginationTable from "../../../components/Table/StatelessPaginationTable";
import SearchTextField from "../../../components/Text/SearchTextField";
import {toLoadingState} from "../../../model/enum/loadingState";
import {RefereeReportItem} from "../../../model/report/RefereeReportItem";
import {Master} from "../../../model/user/master/Master";
import MasterService from "../../../services/api/user/MasterService";
import LocaleUtils from "../../../utility/LocaleUtils";
import ProfileInfoCard from "../../profile/ProfileInfoCard";
import MasterInfoList from "./MasterInfoList";
import MasterPeerReviewList from "./MasterPeerReviewList";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        columnContent: {
            padding: theme.spacing(4),
        },
        column: {
            padding: theme.spacing(1),
        },
        centerAlign: {
            textAlign: "center"
        },
        refereeSelectionButton: {
            borderStyle: "dashed",
            borderWidth: "3px",
            borderRadius: "0px",
            borderColor: theme.palette.action.active,
            height: 130,
        },
    }),
);


interface MasterReportViewProps {
    master: Master,
}

const MasterReportView: React.FunctionComponent<MasterReportViewProps> = (props) => {
    const classes = useStyles();
    const queryClient = useQueryClient();
    const {master} = props;

    const [universityNameQuery, setUniversityNameQuery] = React.useState("");
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const {
        data: refereeReportItems,
        ...refereeReportQuery
    } = useQuery(['refereeReport', master.id, universityNameQuery, rowsPerPage, page],
        () => MasterService.retrieveMasterRefereeReport(master.id, rowsPerPage, page,
            "universityName", "asc", universityNameQuery), {
            keepPreviousData: true
        });

    return (
        <ThemeProvider theme={rtlTheme}>
            <Grid dir="rtl" container direction="row">
                <Grid container item direction="column" xs={12} sm={12} md={12} lg={4} xl={4}
                      className={classes.column}>
                    <Grid item>
                        <Box marginBottom={1}>
                            <ProfileInfoCard
                                user={master}
                                hasDelete={false}
                                onDelete={() => undefined}
                            />
                        </Box>
                    </Grid>
                    <Grid item>
                        <Paper className={classes.columnContent}>
                            <Typography variant="h6" paragraph>
                                اطلاعات کلی
                            </Typography>
                            <MasterInfoList master={master}/>
                        </Paper>
                    </Grid>
                </Grid>
                <Grid container item direction="column" xs={12} sm={12} md={12} lg={4} xl={4}
                      className={classes.column}>
                    <Grid item>
                        <Box component={Paper} padding={1} marginBottom={1}>
                            <Typography className={classes.centerAlign}>
                                نظرات
                            </Typography>
                        </Box>
                        <Box component={Paper} className={classes.columnContent}>
                            <MasterPeerReviewList masterId={master.id} pageSize={5}/>
                        </Box>
                    </Grid>
                </Grid>
                <Grid container item direction="column" xs={12} sm={12} md={12} lg={4} xl={4}
                      className={classes.column}>
                    <Grid item>
                        <Box component={Paper} padding={1} marginBottom={1}>
                            <Typography className={classes.centerAlign}>
                                داوری‌ها
                            </Typography>
                        </Box>
                        <Box component={Paper} padding={1} marginBottom={1}>
                            <SearchTextField
                                label={"دانشگاه"}
                                value={universityNameQuery}
                                onChange={event => setUniversityNameQuery(event.target.value)}
                            />
                        </Box>
                        <StatelessPaginationTable
                            size={"medium"}
                            total={refereeReportItems ? refereeReportItems.totalElements : 0}
                            page={page}
                            onPageChange={newPage => setPage(newPage)}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={newRowsPerPage => {
                                setRowsPerPage(newRowsPerPage);
                                setPage(0);
                            }}
                            rowsPerPageOptions={[5, 10]}
                            loadingState={toLoadingState(refereeReportQuery)}
                            collectionData={refereeReportItems ? refereeReportItems.content : []}
                            tableHeaderCells={[
                                {content: "دانشگاه", width: "40%"},
                                {content: "تعداد پروژه اتمام‌یافته", width: "35%"},
                                {content: "دفعات داوری", width: "25%"},
                            ]}
                            tableRow={(row: RefereeReportItem) => {
                                const cells: OptionalTableCellProps[] = [
                                    {content: row.universityName},
                                    {content: LocaleUtils.convertToPersianDigits(row.totalProblems)},
                                    {content: LocaleUtils.convertToPersianDigits(row.refereeCount)},
                                ];
                                return <ExtendedTableRow key={row.universityName} cells={cells}/>;
                            }}
                            noDataMessage={"هیچ موردی یافت نشد."}
                            hasDelete={() => false}
                            isDeletable={() => false}
                            onDeleteRow={() => undefined}
                            hasEdit={() => false}
                            isEditable={() => false}
                            onEditRow={() => undefined}
                            extraActions={[]}
                            onRetryClick={() => queryClient.invalidateQueries(['refereeReport', master.id, universityNameQuery, rowsPerPage, page])}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}

export default MasterReportView;