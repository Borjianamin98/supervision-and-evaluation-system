import {CircularProgress, Table, TableBody, TableContainer, TableHead, TableRow} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import {makeStyles, ThemeProvider} from "@material-ui/core/styles";
import EditIcon from "@material-ui/icons/Edit";
import {useSnackbar} from "notistack";
import React from 'react';
import {rtlTheme} from "../../App";
import ExtendedTableRow from "../../components/Table/ExtendedTableRow";
import FullRowCell from "../../components/Table/FullRowCell";
import OptionalTableCell, {OptionalTableCellProps} from "../../components/Table/OptionalTableCell";
import {getGeneralErrorMessage} from "../../config/axios-config";
import {University} from "../../model/university/university";
import UniversityService from "../../services/api/university/UniversityService";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flexDirection: "column"
    },
    rowButton: {
        // margin: theme.spacing(1),
    },
    tableContainer: {
        maxHeight: 400,
        overflowX: "hidden",
    },
    circularProgress: {
        margin: theme.spacing(2),
    },
    header: {
        position: 'sticky',
        top: 0,
    },
}));

const UniversityListView: React.FunctionComponent = () => {
    const classes = useStyles();
    const [universities, setUniversities] = React.useState<University[]>([]);
    const [loaded, setLoaded] = React.useState<boolean>(false);
    const {enqueueSnackbar} = useSnackbar();

    React.useEffect(() => {
        UniversityService.retrieveUniversities()
            .then(value => {
                setUniversities(Array.apply(null, Array(30)).map(_ => value.data[0]));
                setLoaded(true);
            })
            .catch(error => {
                const {message, statusCode} = getGeneralErrorMessage(error);
                if (statusCode) {
                    enqueueSnackbar(`در دریافت اطلاعات از سرور خطای ${statusCode} دریافت شد. دوباره تلاش نمایید.`,
                        {variant: "error"});
                } else {
                    enqueueSnackbar(message, {variant: "error"});
                }
            });
    }, [enqueueSnackbar])

    const tableHeaderCells: OptionalTableCellProps[] = [
        {content: "نام", width: "50%"},
        {content: "مکان", optional: true, width: "20%"},
        {content: "آدرس اینترنتی", width: "25%"},
        {content: "", width: "5%"}
    ]

    const tableRows = universities.map(university => {
        const editButton = (
            <ThemeProvider theme={rtlTheme}>
                <Button
                    variant="contained"
                    color="secondary"
                    className={classes.rowButton}
                    endIcon={<EditIcon/>}
                >
                    ویرایش
                </Button>
            </ThemeProvider>
        )
        const cells: OptionalTableCellProps[] = [
            {content: university.name},
            {content: university.location, optional: true},
            {content: university.webAddress, dir: "ltr"},
            {content: editButton}
        ];

        return (
            <ExtendedTableRow key={university.id!} cells={cells}/>
        );
    });

    const universityRows = universities.length === 0 ? (
        <FullRowCell headersCount={tableHeaderCells.length}>مسئله‌ای یافت نشد.</FullRowCell>
    ) : tableRows;

    return (
        <div dir="rtl" className={classes.root}>
            <TableContainer component={Paper} elevation={4} className={classes.tableContainer}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            {tableHeaderCells.map((cell, index) => (
                                <OptionalTableCell key={index} align="right" {...cell}/>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            loaded ? universityRows :
                                (
                                    <FullRowCell headersCount={tableHeaderCells.length}>
                                        <CircularProgress className={classes.circularProgress}/>
                                    </FullRowCell>
                                )
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default UniversityListView;