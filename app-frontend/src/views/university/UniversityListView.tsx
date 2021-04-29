import {CircularProgress, Table, TableBody, TableContainer, TableHead, TableRow} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import {makeStyles} from "@material-ui/core/styles";
import {useSnackbar} from "notistack";
import React from 'react';
import ExtendedTableRow from "../../components/Table/ExtendedTableRow";
import FullRowCell from "../../components/Table/FullRowCell";
import OptionalTableCell, {OptionalTableCellProps} from "../../components/Table/OptionalTableCell";
import {getGeneralErrorMessage} from "../../config/axios-config";
import {University} from "../../model/university/university";
import UniversityService from "../../services/api/university/UniversityService";

const useStyles = makeStyles((theme) => ({
    circularProgress: {
        margin: theme.spacing(2),
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
                setUniversities(value.data);
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
        {content: "نام"},
        {content: "مکان", optional: true},
        {content: "آدرس اینترنتی"},
    ]

    const tableRows = universities.map(university => {
        const cells: OptionalTableCellProps[] = [
            {content: university.name},
            {content: university.location, optional: true},
            {content: university.webAddress, dir: "ltr"},
        ];

        return (
            <ExtendedTableRow cells={cells}/>
        );
    });

    const universityRows = universities.length === 0 ? (
        <FullRowCell headersCount={tableHeaderCells.length}>مسئله‌ای یافت نشد.</FullRowCell>
    ) : tableRows;

    return (
        <TableContainer dir="rtl" component={Paper} elevation={4}>
            <Table>
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
    );
}

export default UniversityListView;