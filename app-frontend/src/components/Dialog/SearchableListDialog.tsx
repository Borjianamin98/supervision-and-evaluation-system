import {Checkbox, ListItemIcon, ListItemText} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import InputAdornment from "@material-ui/core/InputAdornment";
import ListItem from "@material-ui/core/ListItem";
import {makeStyles, useTheme} from "@material-ui/core/styles";
import SearchIcon from '@material-ui/icons/Search';
import React from 'react';
import {FixedSizeList, ListChildComponentProps} from "react-window";
import CustomTextField from "../Text/CustomTextField";

const useStyles = makeStyles((theme) => ({
    justifyAlign: {
        textAlign: "justify",
    },
}));

interface SearchableListDialogProps<T> {
    open: boolean,
    title: string,
    description: string,
    items: T[],
    getItemLabel: (item: T) => string,
    getItemKey: (index: number, item: T) => number,
    onSelect: (item?: T) => void,
}

function SearchableListDialog<T>(props: SearchableListDialogProps<T>) {
    const classes = useStyles();
    const theme = useTheme();
    const {open, title, description, items, getItemLabel, getItemKey, onSelect, ...rest} = props;

    const [searchContent, setSearchContent] = React.useState("");
    const [checkedIndex, setCheckedIndex] = React.useState(-1);
    React.useEffect(() => {
        setSearchContent("");
        setCheckedIndex(-1);
    }, [open])
    React.useEffect(() => {
        setCheckedIndex(-1);
    }, [searchContent])

    const onDialogClose = (shouldUpdate: boolean) => {
        if (shouldUpdate) {
            onSelect(items[checkedIndex]);
        } else {
            onSelect();
        }
    };

    function renderRow(props: ListChildComponentProps) {
        const {index, style} = props;
        const item = items[index];
        return (
            <ListItem role={undefined} button style={style} key={getItemKey(index, item)}
                      onClick={event => setCheckedIndex(index)}>
                <ListItemIcon>
                    <Checkbox
                        edge="start"
                        checked={checkedIndex !== -1 && checkedIndex === index}
                        tabIndex={-1}
                        disableRipple
                    />
                </ListItemIcon>
                <ListItemText primary={getItemLabel(item)}/>
            </ListItem>
        )
    }

    return (
        <Dialog
            dir={theme.direction}
            open={open}
            onClose={event => onDialogClose(false)}
            {...rest}
        >
            <DialogTitle id="dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="dialog-description" className={classes.justifyAlign}>
                    {description}
                </DialogContentText>
                <CustomTextField
                    variant="outlined"
                    textDir={theme.direction}
                    label="جستجو"
                    value={searchContent}
                    onChange={event => setSearchContent(event.target.value)}
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><SearchIcon/></InputAdornment>,
                    }}
                />
                <FixedSizeList
                    direction={theme.direction}
                    itemSize={48} itemCount={items.length}
                    height={Math.min(items.length * 48, 200)} width={300}
                >
                    {renderRow}
                </FixedSizeList>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={event => onDialogClose(false)}
                    color="primary">
                    انصراف
                </Button>
                <Button
                    onClick={event => onDialogClose(true)}
                    color="primary" autoFocus disabled={checkedIndex === -1}>
                    تایید
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default SearchableListDialog;