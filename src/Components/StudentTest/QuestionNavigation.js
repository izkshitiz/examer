import React from 'react';
import classes from './QuestionNavigation.module.css';
const questionnavigation = (props) => {
    let color = '';
    let borderColor = '';
    if(props.questionIndex === props.currentQuestionIndex){
        borderColor = '1px solid black'
    }

    if (props.userAnswer === "" || props.userAnswer === null) { color = '#ffa39e' }
    else if (props.userAnswer === undefined) { color = '#eee' }
    else if (props.userAnswer === "mrkfrrevw7") { color = '#d3adf7' }
    else { color = '#adff2f' }
    return (
        <div onClick={props.click} style={{ backgroundColor: color, border: borderColor }} className={classes.questionnavigationboxes}>
            <div className={classes.questionnavigationboxesnumber}>{props.questionIndex + 1}</div>
        </div>
    );

}
export default questionnavigation;