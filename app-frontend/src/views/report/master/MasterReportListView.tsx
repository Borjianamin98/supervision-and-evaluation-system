import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {makeStyles, ThemeProvider} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import VisibilityIcon from '@material-ui/icons/Visibility';
import React, {useState} from 'react';
import {useQuery, useQueryClient} from "react-query";
import {rtlTheme} from "../../../App";
import ExtendedTableRow from "../../../components/Table/ExtendedTableRow";
import {OptionalTableCellProps} from "../../../components/Table/OptionalTableCell";
import StatelessPaginationTable from "../../../components/Table/StatelessPaginationTable";
import SearchTextField from "../../../components/Text/SearchTextField";
import browserHistory from "../../../config/browserHistory";
import {toLoadingState} from "../../../model/enum/loadingState";
import {Master} from "../../../model/user/master/Master";
import MasterService from "../../../services/api/user/MasterService";
import {MASTER_REPORT_VIEW_PATH} from "../../ViewPaths";

const useStyles = makeStyles((theme) => ({
    searchGrid: {
        margin: theme.spacing(1, 0),
        padding: theme.spacing(2),
    },
    gridItem: {
        padding: theme.spacing(0, 1),
    },
}));

const MasterReportListView: React.FunctionComponent = () => {
    const classes = useStyles();

    const [masterNameQuery, setMasterNameQuery] = useState("");
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const queryClient = useQueryClient();
    const {
        data: masters,
        ...mastersQuery
    } = useQuery(['masters', masterNameQuery, rowsPerPage, page],
        () => MasterService.retrieveMasters(rowsPerPage, page, masterNameQuery), {
            keepPreviousData: true
        });

    return (
        <ThemeProvider theme={rtlTheme}>
            <Grid container direction="column">
                <Grid container dir="rtl"
                      component={Paper}
                      elevation={4}
                      className={classes.searchGrid}
                >
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Typography variant="h6" gutterBottom>
                            اطلاعات پایان‌نامه (پروژه)
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className={classes.gridItem}>
                        <SearchTextField
                            value={masterNameQuery}
                            onChange={event => setMasterNameQuery(event.target.value)}
                        />
                    </Grid>
                </Grid>
                <StatelessPaginationTable
                    total={masters ? masters.totalElements : 0}
                    page={page}
                    onPageChange={newPage => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={newRowsPerPage => {
                        setRowsPerPage(newRowsPerPage);
                        setPage(0);
                    }}
                    rowsPerPageOptions={[5, 10]}
                    loadingState={toLoadingState(mastersQuery)}
                    collectionData={masters ? masters.content : []}
                    tableHeaderCells={[
                        {content: "نام", width: "20%"},
                        {content: "نام خانوداگی", width: "20%"},
                        {content: "دانشگاه", smOptional: true, width: "20%"},
                        {content: "دانشکده", mdOptional: true, width: "20%"},
                        {content: "مدرک", xsOptional: true, width: "15%"},
                        {content: "", width: "2.5%"},
                    ]}
                    tableRow={(row: Master, actions) => {
                        const cells: OptionalTableCellProps[] = [
                            {content: row.firstName},
                            {content: row.lastName},
                            {content: row.university.name, smOptional: true},
                            {content: row.faculty.name, mdOptional: true},
                            {content: row.degree, xsOptional: true},
                            {content: actions}
                        ];

                        return <ExtendedTableRow key={row.id} cells={cells}/>;
                    }}
                    noDataMessage={"هیچ استادی در سامانه ثبت نشده است."}
                    hasDelete={() => false}
                    isDeletable={() => false}
                    onDeleteRow={() => undefined}
                    hasEdit={() => false}
                    isEditable={() => false}
                    onEditRow={() => undefined}
                    extraActions={[
                        {
                            tooltipTitle: "مشاهده",
                            icon: <VisibilityIcon/>,
                            onClickAction: (master) =>
                                browserHistory.push(`${MASTER_REPORT_VIEW_PATH}/${master.id}`)
                        },
                    ]}
                    onRetryClick={() => queryClient.invalidateQueries(['masters', masterNameQuery, rowsPerPage, page])}
                />
            </Grid>
        </ThemeProvider>
    );
}

export default MasterReportListView;