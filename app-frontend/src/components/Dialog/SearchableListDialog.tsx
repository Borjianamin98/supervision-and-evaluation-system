import {Box, Checkbox, ListItemIcon, ListItemText} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import InputAdornment from "@material-ui/core/InputAdornment";
import ListItem from "@material-ui/core/ListItem";
import {makeStyles, useTheme} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import SearchIcon from '@material-ui/icons/Search';
import React from 'react';
import {useQuery} from "react-query";
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
    itemsQueryKey: (searchQuery: string) => string[],
    getItems: (searchQuery: string) => Promise<T[]>,
    getItemLabel: (item: T) => string,
    getItemKey: (index: number, item: T) => number,
    onSelect: (item?: T) => void,
}

function SearchableListDialog<T>(props: SearchableListDialogProps<T>) {
    const classes = useStyles();
    const theme = useTheme();
    const {open, title, description, itemsQueryKey, getItems, getItemLabel, getItemKey, onSelect, ...rest} = props;

    const [searchContent, setSearchContent] = React.useState("");
    const [checkedIndex, setCheckedIndex] = React.useState(-1);
    React.useEffect(() => {
        setSearchContent("");
        setCheckedIndex(-1);
    }, [open])
    React.useEffect(() => {
        setCheckedIndex(-1);
    }, [searchContent])

    const {data: calculatedItems, isLoading, isError} = useQuery(itemsQueryKey(searchContent),
        () => getItems(searchContent), {
            enabled: open
        });

    const onDialogClose = (shouldUpdate: boolean) => {
        if (shouldUpdate) {
            onSelect(calculatedItems![checkedIndex]);
        } else {
            onSelect();
        }
    };

    function renderRow(props: ListChildComponentProps) {
        const {index, style} = props;
        const item = calculatedItems![index];
        return (
            <ListItem role={undefined} button style={style} key={getItemKey(index, item)}
                      onClick={() => setCheckedIndex(index)}>
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

    const viewWidth = 300;
    let viewContent: React.ReactNode;
    if (isLoading) {
        viewContent = <Typography style={{width: viewWidth}}>در حال بارگزاری اطلاعات ...</Typography>
    } else if (isError) {
        viewContent =
            <Typography style={{width: viewWidth}}>در بارگزاری اطلاعات خطا رخ داده است. دوباره تلاش نمایید.</Typography>
    } else {
        viewContent = calculatedItems && calculatedItems.length !== 0 ? (
            <FixedSizeList
                direction={theme.direction}
                itemSize={48} itemCount={calculatedItems.length}
                height={Math.min(calculatedItems.length * 48, 200)} width={viewWidth}
            >
                {renderRow}
            </FixedSizeList>
        ) : <Typography style={{width: viewWidth}}>نتیجه‌ای یافت نشد.</Typography>;
    }

    return (
        <Dialog
            dir={theme.direction}
            open={open}
            onClose={() => onDialogClose(false)}
            {...rest}
        >
            <DialogTitle id="dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="dialog-description" className={classes.justifyAlign}>
                    {description}
                </DialogContentText>
                <Box marginBottom={2}>
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
                </Box>
                {viewContent}
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => onDialogClose(false)}
                    color="primary"
                    variant={"outlined"}
                >
                    انصراف
                </Button>
                <Button
                    onClick={() => onDialogClose(true)}
                    color="primary" autoFocus disabled={checkedIndex === -1}
                    variant={"outlined"}
                >
                    تایید
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default SearchableListDialog;