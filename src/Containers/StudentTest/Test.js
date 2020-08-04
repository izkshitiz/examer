
import React,{Component} from 'react';
// import {Prompt} from 'react-router';
import classes from './Test.module.css';
// import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import QuestionNavigation from '../../Components/StudentTest/QuestionNavigation';
import firebase from '../../Firebase/Firebase';
import {message} from 'antd';
import 'antd/es/message/style/css';



class Test extends Component{
    state={
        loading:true,
        questions:[],
        answers:{
          0:""
        },
        currentquestionindex:0,
        currentquestion:{answer1:'loading',answer2:'loading',answer3:'laoding',answer4:'loading',question:'loading'},
        selectedOption:"",
        qnac:0,   // question not answered counter.
        qac:0,    //question answered counter.
        qirc:0,   //question in review counter.
        qnvc:0    //question not visited counter.
    }


componentWillMount(){
  this.loadtest(); 
  }


// Loads the test if user is authenticated esle rdirect to signin screen.
loadtest=()=>{
let testRef = firebase.firestore().collection('test');
    let ResTestRef = testRef.get()   
    .then(snapshot => {
      snapshot.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
        let l = doc.data().paper.length;
        this.setState({questions:doc.data().paper,currentquestion:doc.data().paper[0],qnac:l,qnvc:l-1,loading:false});
      });
    })
    .catch(err => {
      console.log('Error getting documents', err);
    });
}

// function to change selected options.
handleOptionChange = changeEvent => {
    this.setState({
      selectedOption: changeEvent.target.value
    });
  };


// Saves answers to the local state. takes curent selected option in state and current question index in state as arguments.
// Calls "nextQuestion" function in the end.
// Arguments include selectedOption and currentQuestionIndex
saveAnswer=(sOption,cInd)=>{
  let i = this.state.answers[cInd];
  console.log('executed')
  //  If user clicks on "Save and Next" without selecting an option. we return the user without executing rest of the function.
  if(sOption===""){
    message.warn("Please select an answer !");
    return;
  }
  if(sOption==="mrkfrrevw7"){
    message.warn("Please select an answer !");
    return;
  }
 
  //  If user clicks on "Save and Next" and question is marked for review already. we adjust the state for qirc before executing rest of the function.
  if(i==="mrkfrrevw7"){
    this.setState(prevState=>({qac:prevState.qac+1,qirc:prevState.qirc-1,qnac:prevState.qnac-1}));
  }

  //  If user clicks on "Save and Next" and there is NO previous answer to it. We adjust qac and qnac in addition we set the current selected option as answer in answers array.
  if(i===""){
    
    this.setState(prevState=>{
      return ({ qnac: prevState.qnac-1, qac: prevState.qac+1, answers: { ...this.state.answers, [cInd]: sOption } });
    });
  }

  //  If user clicks on "Save and Next" and there IS previous answer to it. We set the current selected option as answer in answers array.
  else{
    this.setState(prevState=>({answers:{...this.state.answers,[cInd]:sOption}}));
  }

  
    this.nextQuestion(cInd);
}

clearAnswer=(sOption,cIndex)=>{
  // let stateAnswers= this.state.answers;
  // delete stateAnswers[cIndex];
  let i =this.state.answers[cIndex];

  if(i===""){
    message.warn("Nothing to Clear !");
    return;
  }
 if(i==="mrkfrrevw7"){
  this.setState(prevState=>({selectedOption:"",qirc:prevState.qirc-1,answers:{...this.state.answers,[cIndex]:""}}));
 }
  else if(typeof i==="string"){
    this.setState(prevState=>({selectedOption:"",qnac:prevState.qnac+1,qac:prevState.qac-1,answers:{...this.state.answers,[cIndex]:""}}));
  }
}

markForReview=(cIndex)=>{
  let i =this.state.answers[cIndex];
  if(i==="mrkfrrevw7"){
    message.warn("Already marked for review !");
    return;
  }
  if( typeof i === "string" && i !== "mrkfrrevw7" && i !==""){
    this.setState(prevState=>({qac:prevState.qac-1,qnac:prevState.qnac+1}));
  }
  this.setState(prevState=>({selectedOption:"mrkfrrevw7",qirc:prevState.qirc+1,answers:{...this.state.answers,[cIndex]:"mrkfrrevw7"}}));
  this.nextQuestion(cIndex);
}

nextQuestion=(cInd)=>{
  let i = cInd;
  if(i>=this.state.questions.length-1)
  {
    message.warn("This is the last Question !");
    return;
  }
  if(this.state.answers[i+1]===undefined){
    this.setState(prevState=>({qnvc:prevState.qnvc-1, answers:{...prevState.answers,[i+1]:""}}))
  }else{
    this.setState({selectedOption:this.state.answers[i+1]})
  }
  this.setState({currentquestion:this.state.questions[i+1],currentquestionindex:i+1});
}

previousQuestion=()=>{
  let i = this.state.currentquestionindex;
  if(i===0){
    return;
  }
  this.setState({currentquestion:this.state.questions[i-1],currentquestionindex:i-1});
  if(this.state.answers[i-1]===undefined){
    this.setState(prevState=>({qnvc:prevState.qnvc-1,answers:{...this.state.answers,[i-1]:""}}));
  }else{
    this.setState({selectedOption:this.state.answers[i-1]})
  }
}


navigationClick=(e,i)=>{
  this.setState({currentquestion:e,currentquestionindex:i});
  console.log("answertype "+typeof this.state.answers[i]);
  // typeof this.state.answers[i]==="string" || this.state.answers[i]===""
  if(this.state.answers[i]===undefined){
    this.setState(prevState=>({qnvc:prevState.qnvc-1,answers:{...this.state.answers,[i]:""}}))
  }
  if(this.state.answers[i]!=="mrkfrrevw7" || this.state.answers[i]!=="")
  {
    this.setState({selectedOption:this.state.answers[i]})
  }
}

render(){
return(
<div className={classes.contentwrapper}>
{/* <Prompt
      when={true}
      message='You have unsaved changes, are you sure you want to leave?'
    />    */}
{this.state.loading?<p>Loading..</p>:
(<React.Fragment>
<div className={classes.userinfobannerwrapper}>
    <div className={classes.userimage}>userimage</div>
    <div className={classes.userdetailsandtime} >user details and time left</div> 
</div>

<div className={classes.questionpaperandcontrolswrapper}>
<div className={classes.questionpaperview}>
 
<p><b>Question No.{this.state.currentquestionindex+1}</b>{"  "+this.state.currentquestion.question}</p>
 <div className={classes.hrline}></div><br></br>
 <span className={classes.optionstext}>Options:</span>
 <label className={classes.marginbottom}>
      <input
        type="radio"
        name="qa"
        checked={this.state.selectedOption === this.state.currentquestion.answer1 }
        value={this.state.currentquestion.answer1}
        onChange={this.handleOptionChange}
        className="form-check-input"
      />
      {this.state.currentquestion.answer1}
 </label>
 <label className={classes.marginbottom}>
      <input
        type="radio"
        name="qa"
        checked={this.state.selectedOption === this.state.currentquestion.answer2 }
        value={this.state.currentquestion.answer2}
        onChange={this.handleOptionChange}
        className="form-check-input"
      />
      {this.state.currentquestion.answer2}
 </label>
 <label className={classes.marginbottom}>
      <input
        type="radio"
        name="qa"
        checked={this.state.selectedOption === this.state.currentquestion.answer3 }
        value={this.state.currentquestion.answer3}
        onChange={this.handleOptionChange}
        className="form-check-input"
      />
      {this.state.currentquestion.answer3}
 </label>
 <label className={classes.marginbottom}>
      <input
        type="radio"
        name="qa"
        checked={this.state.selectedOption === this.state.currentquestion.answer4 }
        value={this.state.currentquestion.answer4}
        onChange={this.handleOptionChange}
        className="form-check-input"
      />
      {this.state.currentquestion.answer4}
 </label>

</div>
<div className={classes.questionpapercontrols}>
<div className={classes.questionpapercontrolsrowone}>
<button onClick={()=>this.saveAnswer(this.state.selectedOption,this.state.currentquestionindex)}>Save and Next</button>
<button onClick={()=>this.clearAnswer(this.state.selectedOption,this.state.currentquestionindex)}>Clear</button>
<button onClick={()=>this.markForReview(this.state.currentquestionindex)}>Mark For Review and Next</button>
</div>
<div className={classes.questionpapercontrolsrowtwo}>
<button disabled={this.state.currentquestionindex===0} onClick={this.previousQuestion}>Previous</button>
<button disabled={this.state.currentquestionindex===this.state.questions.length-1} onClick={()=>this.nextQuestion(this.state.currentquestionindex)}>Next</button>
<button>Submit</button>
</div>
</div>
</div>

{/* Keep track of elements in the answers object*/}
<div className={classes.questionanswerinformationwrapper}>
<div className={classes.questionanswercount}>
<div className={classes.aligncenter}>
<div className={classes.questionnotvisited}><p>{this.state.qnvc}</p></div>
<span >Questions Not Visited</span>
</div>
<div className={classes.aligncenter}>
<div className={classes.questionanswered}><p>{this.state.qac}</p></div>
<span>Questions Answered</span>
</div>
<div className={classes.aligncenter}>
<div className={classes.questioninreview}><p>{this.state.qirc}</p></div>
<span>Questions In Review</span>
</div>
<div className={classes.aligncenter}>
<div className={classes.questionnotanswered}><p>{this.state.qnac}</p></div>
<span>Questions Not Answered</span>
</div>
</div>
<div className={classes.questionanswernavigation}>
{this.state.questions.map((e,i)=>{
// let answerone=e.answer1;
// let answertwo=e.answer2;
// let answerthree=e.answer3;
// let answerfour=e.answer4;
// let question=e.question;
return <QuestionNavigation click={()=>this.navigationClick(e,i)} useranswer={this.state.answers[i]} key={i} qa={e} ind={i} />;
})}
</div>
</div>
</React.Fragment>)}
</div>

);
}
}
export default Test;