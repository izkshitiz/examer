import React from 'react';
import classes from './QuestionNavigation.module.css';
const questionnavigation = (props) => {
let color='';
if(props.useranswer===""||props.useranswer===null){color='red'}
else if(props.useranswer===undefined){color='grey'}
else if(props.useranswer==="mrkfrrevw7"){color='purple'}
else{color='green'}
return (
<div onClick={props.click} style={{backgroundColor:color}} className={classes.boxwrapper}>
<p>{props.ind+1}</p>
</div>
);

}
export default questionnavigation;