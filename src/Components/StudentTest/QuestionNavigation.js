import React from 'react';
import classes from './QuestionNavigation.module.css';
const questionnavigation = (props) => {
    let color = '';
    let borderColor = '';
    if(props.ind === props.cqind){
        borderColor = '1px solid black'
    }

    if (props.useranswer === "" || props.useranswer === null) { color = '#ffa39e' }
    else if (props.useranswer === undefined) { color = '#eee' }
    else if (props.useranswer === "mrkfrrevw7") { color = '#d3adf7' }
    else { color = '#adff2f' }
    return (
        <div onClick={props.click} style={{ backgroundColor: color, border: borderColor }} className={classes.questionnavigationboxes}>
            <div className={classes.questionnavigationboxesnumber}>{props.ind + 1}</div>
        </div>
    );

}
export default questionnavigation;