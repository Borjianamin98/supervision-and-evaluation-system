import Chip from "@material-ui/core/Chip";
import {makeStyles} from "@material-ui/core/styles";
import classNames from "classnames";
import React from 'react';

const useStyles = makeStyles((theme) => ({
    leftMargin: {
        margin: theme.spacing(1, theme.direction === "ltr" ? 0 : 1, 1, theme.direction === "ltr" ? 1 : 0),
    },
    rightMargin: {
        margin: theme.spacing(1, theme.direction === "ltr" ? 1 : 0, 1, theme.direction === "ltr" ? 0 : 1),
    },
}));

interface ChipListProps {
    keywords: string[],
    marginDir: "left" | "right"
}

const KeywordsList: React.FunctionComponent<ChipListProps> = (props) => {
    const classes = useStyles();
    const {keywords, marginDir} = props;

    return (
        <span>
            {
                keywords.length === 0 ? (
                    props.children
                ) : (
                    keywords.map((keyword, index) =>
                        <Chip
                            className={classNames({
                                [classes.leftMargin]: marginDir === "left",
                                [classes.rightMargin]: marginDir === "right",
                            })}
                            key={index}
                            variant="outlined" color="primary"
                            label={keyword}
                        />
                    )
                )
            }
        </span>
    )
}

export default KeywordsList;