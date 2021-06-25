import {InputAdornment} from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import React from "react";
import CustomTextField, {CustomTextFieldProps} from "./CustomTextField";

const SearchTextField: React.FunctionComponent<Omit<CustomTextFieldProps, "InputProps">> = (params) => {
    return (
        <CustomTextField
            variant="outlined"
            label="جستجو"
            InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon/></InputAdornment>,
            }}
            {...params}
        />
    )
}

export default SearchTextField;