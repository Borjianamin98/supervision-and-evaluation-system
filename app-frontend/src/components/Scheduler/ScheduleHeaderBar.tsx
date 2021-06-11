import {Box, IconButton} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import moment from "jalali-moment";
import React from 'react';
import DateUtils from "../../utility/DateUtils";

interface ScheduleHeaderBarProps {
    totalDaysInView: number,
    minimumDate: Date,
    maximumDate: Date,
    onDateChange: (startDate: Date) => void,
}

const ScheduleHeaderBar: React.FunctionComponent<ScheduleHeaderBarProps> = (props) => {
    const {totalDaysInView, minimumDate, maximumDate, onDateChange} = props;

    const [startDate, setStartDate] = React.useState(DateUtils.getCurrentDate());
    const startDateMoment = moment(startDate).locale("fa");
    const endDateMoment = moment(DateUtils.addDays(moment(startDateMoment), totalDaysInView - 1)).locale("fa");

    const startDateMonth = startDateMoment.format("MMMM");
    const endDateMonth = endDateMoment.format("MMMM");
    const startDateYear = startDateMoment.format("YYYY");
    const endDateYear = endDateMoment.format("YYYY");
    let headerDate: string;
    if (startDateYear !== endDateYear) {
        headerDate = startDateMoment.format("D MMMM YYYY تا ")
            + endDateMoment.format("D MMMM YYYY")
    } else if (startDateMonth !== endDateMonth) {
        headerDate = startDateMoment.format("D MMMM تا ")
            + endDateMoment.format("D MMMM YYYY")
    } else {
        headerDate = startDateMoment.format("D تا ")
            + endDateMoment.format("D MMMM YYYY")
    }

    const changeIntervalOnClick = (days: number) => {
        const targetDate = DateUtils.addDays(startDate, days);
        setStartDate(targetDate);
        onDateChange(targetDate);
    }

    const [beyondMaxRange, setBeyondMaxRange] = React.useState(true);
    const [beforeMinRange, setBeforeMinRange] = React.useState(true);
    React.useEffect(() => {
        setBeforeMinRange(startDateMoment.add(-1, "days").isBefore(minimumDate));
        setBeyondMaxRange(startDateMoment.add(totalDaysInView, "days").isAfter(maximumDate));
    }, [minimumDate, maximumDate, startDateMoment, totalDaysInView]);

    return (
        <Box dir="rtl" paddingY={1} className="e-schedule e-schedule-toolbar">
            <Grid
                container alignItems="center" justify="space-between"
                wrap="nowrap"
            >
                <Grid item>
                    <IconButton
                        color="primary"
                        onClick={() => changeIntervalOnClick(-totalDaysInView)}
                        disabled={beforeMinRange}
                    >
                        <KeyboardArrowRight/>
                    </IconButton>
                </Grid>
                <Grid item>
                    <Typography color="textPrimary" variant="body1" style={{textAlign: "center"}}>
                        {headerDate}
                    </Typography>
                </Grid>
                <Grid item>
                    <IconButton
                        color="primary"
                        onClick={() => changeIntervalOnClick(totalDaysInView)}
                        disabled={beyondMaxRange}
                    >
                        <KeyboardArrowLeft/>
                    </IconButton>
                </Grid>
            </Grid>
        </Box>
    );
}

export default ScheduleHeaderBar;