import {Box} from "@material-ui/core";
import {ThemeProvider} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from 'react';
import {rtlTheme} from "../../App";
import KeywordsList from "../../components/Chip/KeywordsList";
import CustomTypography from "../../components/Typography/CustomTypography";
import {educationMapToPersian} from "../../model/enum/education";
import {Problem} from "../../model/problem/problem";

interface ProblemInfoListProps {
    problem: Problem,
}

const ProblemInfoList: React.FunctionComponent<ProblemInfoListProps> = (props) => {
    const {problem} = props;

    return (
        <ThemeProvider theme={rtlTheme}>
            <TitleTypography>دوره تحصیلی</TitleTypography>
            <Typography paragraph>
                {educationMapToPersian(problem.education)}
            </Typography>

            <TitleTypography>عنوان</TitleTypography>
            <CustomTypography paragraph>{problem.title}</CustomTypography>

            <TitleTypography>عنوان انگلیسی</TitleTypography>
            <CustomTypography paragraph>
                {problem.englishTitle}
            </CustomTypography>

            <TitleTypography>کلیدواژه‌ها</TitleTypography>
            <Box marginBottom={2}>
                <KeywordsList keywords={problem.keywords} marginDir="left"/>
            </Box>

            <TitleTypography>تعریف</TitleTypography>
            <CustomTypography paragraph>{problem.definition}</CustomTypography>

            <TitleTypography>بیشینه</TitleTypography>
            <CustomTypography paragraph>{problem.history}</CustomTypography>

            <TitleTypography>ملاحظات</TitleTypography>
            <CustomTypography paragraph>{problem.considerations}</CustomTypography>

            <TitleTypography>استاد راهنما</TitleTypography>
            <Typography paragraph>
                {problem.supervisor.fullName}
            </Typography>

            <TitleTypography>استادهای داور</TitleTypography>
            <Typography paragraph>
                {problem.referees.length !== 0 ? problem.referees.map(r => r.fullName).join("، ") : "داوری تعیین نشده است."}
            </Typography>
        </ThemeProvider>
    );
}

const TitleTypography: React.FunctionComponent = (props) => {
    return (
        <CustomTypography
            variant={"body1"}
            color={"textSecondary"}
            gutterBottom>
            {props.children}
        </CustomTypography>
    );
}

export default ProblemInfoList;