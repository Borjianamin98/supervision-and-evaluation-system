import Typography from '@material-ui/core/Typography';
import React from 'react';
import CustomTextField from "../../../components/Text/CustomTextField";
import {UniversityCreateSectionsProps} from './UniversityCreateView';

const UniversityCreateInfo: React.FunctionComponent<UniversityCreateSectionsProps> = (props) => {
    const {commonClasses, university, setUniversity, errorChecking} = props;

    const isNotBlank = (c: string) => !errorChecking || c.length > 0;

    return (
        <React.Fragment>
            <Typography className={commonClasses.title} variant="h6">
                اطلاعات دانشگاه
            </Typography>
            <CustomTextField
                required
                label="نام دانشگاه"
                value={university.name}
                onChange={(e) =>
                    setUniversity({...university, name: e.target.value})}
                helperText={isNotBlank(university.name) ? "" : "نام دانشگاه باید مشخص شود."}
                error={!isNotBlank(university.name)}
                maxLength={40}
            />
            <CustomTextField
                label="مکان"
                value={university.location}
                onChange={(e) =>
                    setUniversity({...university, location: e.target.value})}
                maxLength={40}
            />
            <CustomTextField
                label="آدرس اینترنتی"
                value={university.webAddress}
                onChange={(e) =>
                    setUniversity({...university, webAddress: e.target.value})}
                maxLength={100}
            />
        </React.Fragment>
    );
}

export default UniversityCreateInfo;