import {ThemeProvider} from "@material-ui/core/styles";
import DoneIcon from '@material-ui/icons/Done';
import NewReleasesIcon from '@material-ui/icons/NewReleases';
import moment from "jalali-moment";
import React from 'react';
import {useQuery, useQueryClient} from "react-query";
import {rtlTheme} from "../../App";
import TooltipIconButton from "../../components/Button/TooltipIconButton";
import ExtendedTableRow from "../../components/Table/ExtendedTableRow";
import {OptionalTableCellProps} from "../../components/Table/OptionalTableCell";
import StatelessPaginationTable from "../../components/Table/StatelessPaginationTable";
import CustomTypography from "../../components/Typography/CustomTypography";
import {toLoadingState} from "../../model/enum/loadingState";
import {AppNotification} from "../../model/notification/Notification"
import NotificationService from "../../services/api/notification/NotificationService";

const NotificationListView: React.FunctionComponent = () => {

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const queryClient = useQueryClient();
    const {
        data: notifications,
        ...notificationsQuery
    } = useQuery(["notifications", rowsPerPage, page],
        () => NotificationService.retrieveNotifications(rowsPerPage, page,
            ["createdDate", "id"], ["desc", "desc"]), {
            keepPreviousData: true
        });

    return (
        <ThemeProvider theme={rtlTheme}>
            <StatelessPaginationTable
                total={notifications ? notifications.totalElements : 0}
                page={page}
                onPageChange={newPage => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={newRowsPerPage => {
                    setRowsPerPage(newRowsPerPage);
                    setPage(0);
                }}
                rowsPerPageOptions={[5, 10]}
                loadingState={toLoadingState(notificationsQuery)}
                collectionData={notifications ? notifications.content : []}
                tableHeaderCells={[
                    {content: "تاریخ", width: "25%", xsOptional: true},
                    {content: "مسئول", width: "10%", mdOptional: true},
                    {content: "پیام", width: "60%"},
                    {content: "وضعیت", smOptional: true, width: "5%"},
                ]}
                tableRow={(row: AppNotification, actions) => {
                    const cells: OptionalTableCellProps[] = [
                        {
                            content: moment(row.createdDate).locale('fa').format('ddd، D MMMM YYYY (h:mm a)'),
                            xsOptional: true
                        },
                        {content: row.createdBy, mdOptional: true},
                        {content: <CustomTypography>{row.content}</CustomTypography>},
                        {
                            content: row.seen ? (
                                <TooltipIconButton tooltipTitle={"مشاهده‌شده"} color={"secondary"}>
                                    <DoneIcon/>
                                </TooltipIconButton>
                            ) : (
                                <TooltipIconButton tooltipTitle={"جدید"} color={"secondary"}>
                                    <NewReleasesIcon/>
                                </TooltipIconButton>
                            ),
                            smOptional: true
                        },
                    ];

                    return <ExtendedTableRow key={row.id} cells={cells}/>;
                }}
                noDataMessage={"هیچ اطلاعیه‌ای وجود ندارد."}
                hasDelete={() => false}
                isDeletable={() => false}
                onDeleteRow={() => undefined}
                hasEdit={() => false}
                isEditable={() => false}
                onEditRow={() => undefined}
                extraActions={[]}
                onRetryClick={() => queryClient.invalidateQueries(["notifications", rowsPerPage, page])}
            />
        </ThemeProvider>
    );
}

export default NotificationListView;