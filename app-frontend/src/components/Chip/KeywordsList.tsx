import Chip from "@material-ui/core/Chip";
import {makeStyles} from "@material-ui/core/styles";
import React from 'react';

const useStyles = makeStyles((theme) => ({
    chip: {
        margin: theme.spacing(1, 0, 1, 1),
    },
}));

interface ChipListProps {
    keywords: string[],
}

const KeywordsList: React.FunctionComponent<ChipListProps> = (props) => {
    const classes = useStyles();
    const {keywords} = props;

    return (
        <div dir={"rtl"}>
            {
                keywords.length === 0 ? (
                    props.children
                ) : (
                    keywords.map((keyword, index) =>
                        <Chip
                            key={index}
                            variant="outlined" color="primary"
                            className={classes.chip}
                            label={keyword}
                        />
                    )
                )
            }
        </div>
    )
}

export default KeywordsList;