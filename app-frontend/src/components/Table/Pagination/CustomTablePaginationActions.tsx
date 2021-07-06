import {IconButton} from "@material-ui/core";
import {createStyles, makeStyles, Theme, useTheme} from "@material-ui/core/styles";
import {TablePaginationActionsProps} from "@material-ui/core/TablePagination/TablePaginationActions";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import React from "react";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexShrink: 0,
            marginLeft: theme.spacing(1),
        },
    }),
);

const CustomTablePaginationActions: React.FunctionComponent<TablePaginationActionsProps> = (props) => {
    const classes = useStyles();
    const theme = useTheme();
    const {count, page, rowsPerPage, onPageChange} = props;
    const maxPageNumber = Math.max(0, Math.ceil(count / rowsPerPage) - 1);
    const isRtlTheme = theme.direction === 'rtl';

    const handleFirstPageButtonClick = () => onPageChange(null, 0);
    const handleBackButtonClick = () => onPageChange(null, page - 1);
    const handleNextButtonClick = () => onPageChange(null, page + 1);
    const handleLastPageButtonClick = () => onPageChange(null, maxPageNumber);

    return (
        <div className={classes.root}>
            <IconButton
                onClick={() => isRtlTheme ? handleLastPageButtonClick() : handleFirstPageButtonClick()}
                disabled={isRtlTheme ? page === maxPageNumber : page === 0}
            >
                {isRtlTheme ? <LastPageIcon/> : <FirstPageIcon/>}
            </IconButton>
            <IconButton
                onClick={() => isRtlTheme ? handleNextButtonClick() : handleBackButtonClick()}
                disabled={isRtlTheme ? page === maxPageNumber : page === 0}
            >
                {isRtlTheme ? <KeyboardArrowRight/> : <KeyboardArrowLeft/>}
            </IconButton>
            <IconButton
                onClick={() => isRtlTheme ? handleBackButtonClick() : handleNextButtonClick()}
                disabled={isRtlTheme ? page === 0 : page === maxPageNumber}
            >
                {isRtlTheme ? <KeyboardArrowLeft/> : <KeyboardArrowRight/>}
            </IconButton>
            <IconButton
                onClick={() => isRtlTheme ? handleFirstPageButtonClick() : handleLastPageButtonClick()}
                disabled={isRtlTheme ? page === 0 : page === maxPageNumber}
            >
                {isRtlTheme ? <FirstPageIcon/> : <LastPageIcon/>}
            </IconButton>
        </div>
    );
}

export default CustomTablePaginationActions;