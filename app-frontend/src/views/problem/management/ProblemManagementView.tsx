import {Box, Button, Grid, Paper} from "@material-ui/core";
import {createStyles, makeStyles, Theme, ThemeProvider} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import AddCommentIcon from "@material-ui/icons/AddComment";
import GradeIcon from '@material-ui/icons/Grade';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import ScheduleIcon from '@material-ui/icons/Schedule';
import {AxiosError} from "axios";
import {useSnackbar} from "notistack";
import React from 'react';
import {useMutation, useQueryClient} from "react-query";
import {rtlTheme} from "../../../App";
import KeywordsList from "../../../components/Chip/KeywordsList";
import SearchableListDialog from "../../../components/Dialog/SearchableListDialog";
import {generalErrorHandler} from "../../../config/axios-config";
import browserHistory from "../../../config/browserHistory";
import {educationMapToPersian} from "../../../model/enum/education";
import {Role} from "../../../model/enum/role";
import {Problem} from "../../../model/problem/problem";
import {Master} from "../../../model/user/master/Master";
import AuthenticationService from "../../../services/api/AuthenticationService";
import ProblemMasterService from "../../../services/api/problem/ProblemMasterService";
import MasterService from "../../../services/api/user/MasterService";
import NumberUtils from "../../../utility/NumberUtils";
import {PROBLEM_SCHEDULE_VIEW_PATH} from "../../ViewPaths";
import ProblemEventsList from "../ProblemEventsList";
import ProblemAddEvent from "./PorblemAddEvent";
import ProfileInfoCard from "./ProfileInfoCard";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        columnContent: {
            padding: theme.spacing(4),
        },
        column: {
            padding: theme.spacing(1),
        },
        justifyAlign: {
            textAlign: "justify"
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

interface ProblemManagementViewProps {
    problem: Problem,
}

const ProblemManagementView: React.FunctionComponent<ProblemManagementViewProps> = (props) => {
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();
    const {problem} = props;
    const problemId = problem.id;

    const queryClient = useQueryClient();
    const referees = problem.referees;
    const updateReferees = useMutation(
        (data: Parameters<typeof ProblemMasterService.updateReferees>) => ProblemMasterService.updateReferees(data[0], data[1]),
        {
            onSuccess: async data => {
                queryClient.setQueryData(['problem', problemId], data);
                await queryClient.invalidateQueries(['events', problemId])
            },
            onError: (error: AxiosError) => generalErrorHandler(error, enqueueSnackbar),
        });

    const jwtPayloadRole = AuthenticationService.getJwtPayloadRole()!;
    const [commentDialogOpen, setCommentDialogOpen] = React.useState(false);
    const [selectedRefereeDialog, setSelectedRefereeDialog] = React.useState(0);
    const [refereeDialogOpen, setRefereeDialogOpen] = React.useState(false);
    const onRefereeSelect = (master?: Master) => {
        if (master) {
            if (referees.some(value => value.id === master.id)) {
                enqueueSnackbar(
                    "داور انتخاب‌شده در لیست داورهای از قبل انتخاب شده می‌باشد. امکان انتخاب یک داور برای بیش از یک بار وجود ندارد.",
                    {variant: "error"})
                return;
            } else if (master.id === problem!.supervisor.id) {
                enqueueSnackbar(
                    "داور انتخاب‌شده نمی‌تواند استاد راهنمای مسئله باشد.",
                    {variant: "error"})
                return;
            }
            if (selectedRefereeDialog === -1) {
                updateReferees.mutate([problemId, [...referees, master]]);
            } else {
                const copyReferees = [...referees];
                copyReferees[selectedRefereeDialog] = master;
                updateReferees.mutate([problemId, copyReferees])
            }
        }
        setRefereeDialogOpen(false);
    }

    const onScheduleClick = () => {
        browserHistory.push({
            pathname: `${PROBLEM_SCHEDULE_VIEW_PATH}/${problemId}`,
            state: problem
        });
    }

    return (
        <ThemeProvider theme={rtlTheme}>
            <Grid dir="rtl" container direction="row">
                <Grid container item direction="column" xs={12} sm={12} md={12} lg={4} xl={4}
                      className={classes.column}>
                    <Grid item>
                        <Box marginBottom={1}>
                            <ProfileInfoCard
                                user={problem.student}
                                onEdit={() => undefined}
                                onDelete={() => undefined}
                                subheader="دانشجوی پایان‌نامه (پروژه)"
                            />
                        </Box>
                    </Grid>
                    <Grid item>
                        <Paper className={classes.columnContent}>
                            <Typography variant="h6" paragraph>
                                اطلاعات کلی
                            </Typography>
                            <Typography paragraph>
                                {`دوره تحصیلی: ${problem ? educationMapToPersian(problem.education) : ""}`}
                            </Typography>
                            <Typography paragraph
                                        className={classes.justifyAlign}>{`عنوان: ${problem?.title}`}</Typography>
                            <Typography paragraph className={classes.justifyAlign}>
                                {`عنوان انگلیسی: ${problem?.englishTitle}`}
                            </Typography>
                            <Typography paragraph>کلیدواژه‌ها: </Typography>
                            <Box marginBottom={2}>
                                <KeywordsList keywords={problem ? problem.keywords : []} marginDir="left"/>
                            </Box>
                            <Typography paragraph
                                        className={classes.justifyAlign}>{`تعریف: ${problem?.definition}`}</Typography>
                            <Typography paragraph
                                        className={classes.justifyAlign}>{`بیشینه: ${problem?.history}`}</Typography>
                            <Typography paragraph
                                        className={classes.justifyAlign}>{`ملاحظات: ${problem?.considerations}`}</Typography>
                        </Paper>
                    </Grid>
                </Grid>
                <Grid container item direction="column" xs={12} sm={12} md={12} lg={4} xl={4}
                      className={classes.column}>
                    <Grid item>
                        <Box marginBottom={1}>
                            <ProfileInfoCard
                                user={problem.supervisor}
                                onEdit={() => undefined}
                                onDelete={() => undefined}
                                subheader="استاد راهنمای پایان‌نامه (پروژه)"
                            />
                        </Box>
                    </Grid>
                    <Grid item>
                        <Paper className={classes.columnContent}>
                            <Grid container>
                                <Typography variant="h6">
                                    رخدادهای اخیر
                                </Typography>
                                <Box style={{marginRight: "auto"}}>
                                    <Button
                                        color="secondary"
                                        variant="contained"
                                        startIcon={<AddCommentIcon/>}
                                        onClick={() => setCommentDialogOpen(true)}
                                    >
                                        ثبت نظر
                                    </Button>
                                </Box>
                            </Grid>
                            <Box marginTop={2}>
                                {problem ? <ProblemEventsList problemId={problem.id!} pageSize={3}/> : undefined}
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
                <Grid container item direction="column" xs={12} sm={12} md={12} lg={4} xl={4}
                      className={classes.column}>
                    <Grid item>
                        <Box component={Paper} padding={1} marginBottom={1}>
                            <Typography className={classes.centerAlign}>
                                داورها
                            </Typography>
                        </Box>
                        {
                            [...Array(2)].map((e, index) => {
                                const orderString = NumberUtils.mapNumberToPersianOrderName(index + 1);
                                let content: React.ReactNode;
                                if (index < referees.length && referees[index] != null) {
                                    content = <ProfileInfoCard
                                        user={referees[index]}
                                        subheader={`داور ${orderString} پایان‌نامه (پروژه)`}
                                        hasEdit={jwtPayloadRole === Role.MASTER}
                                        hasDelete={jwtPayloadRole === Role.MASTER}
                                        onEdit={() => {
                                            setSelectedRefereeDialog(index);
                                            setRefereeDialogOpen(true);
                                        }}
                                        onDelete={() => {
                                            const copyReferees = [...referees];
                                            copyReferees.splice(index, 1);
                                            updateReferees.mutate([+problemId, copyReferees])
                                        }}
                                    />;
                                } else {
                                    let buttonContent: string;
                                    switch (jwtPayloadRole) {
                                        case Role.STUDENT:
                                            buttonContent = `داور ${orderString} مشخص نشده است.`;
                                            break;
                                        case Role.MASTER:
                                        case Role.ADMIN:
                                            buttonContent = `تایین داور ${orderString}`;
                                            break;
                                    }
                                    content = (
                                        <Button
                                            fullWidth
                                            startIcon={jwtPayloadRole !== Role.STUDENT ?
                                                (<PersonAddIcon style={{fontSize: 40}}/>) : undefined}
                                            className={classes.refereeSelectionButton}
                                            onClick={() => {
                                                setSelectedRefereeDialog(-1);
                                                setRefereeDialogOpen(true);
                                            }}
                                            disabled={jwtPayloadRole === Role.STUDENT}
                                        >
                                            {buttonContent}
                                        </Button>
                                    )
                                }
                                return <Box key={index} marginBottom={1}>
                                    {content}
                                </Box>;
                            })
                        }
                    </Grid>
                    <Grid item>
                        <Box component={Paper} px={4} marginTop={1}>
                            <Grid container spacing={1} className={classes.columnContent}>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <Typography variant="h6" className={classes.centerAlign} paragraph>
                                        عملیات
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        color="secondary"
                                        startIcon={<ScheduleIcon/>}
                                        onClick={onScheduleClick}
                                    >
                                        زمان‌بندی دفاع
                                    </Button>
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        color="secondary"
                                        startIcon={<GradeIcon/>}
                                    >
                                        نمره‌دهی
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
                <div aria-label={"dialogs"}>
                    <ProblemAddEvent
                        open={commentDialogOpen}
                        problemId={+problemId}
                        problemTitle={problem ? problem.title : ""}
                        onClose={() => setCommentDialogOpen(false)}
                    />
                    <SearchableListDialog
                        title={`انتخاب استاد داور ${NumberUtils.mapNumberToPersianOrderName(selectedRefereeDialog + 1)}`}
                        description={"استاد مربوطه را مشخص نمایید."}
                        open={refereeDialogOpen}
                        getItems={searchQuery => [
                            ['masters', searchQuery],
                            MasterService.retrieveMasters(100, 0, searchQuery).then(value => value.content)
                        ]}
                        getItemLabel={(item: Master) => item.fullName!}
                        getItemKey={(index, item) => item.id!}
                        onSelect={onRefereeSelect}
                    />
                </div>
            </Grid>
        </ThemeProvider>
    );
}

export default ProblemManagementView;