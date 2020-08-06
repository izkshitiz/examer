import React, { Component } from 'react';
import classes from './Test.module.css';
import QuestionNavigation from '../../Components/StudentTest/QuestionNavigation';
import firebase from '../../Firebase/Firebase';
import 'firebase/firestore'
import { message } from 'antd';
import { Button } from 'antd';
import { Spin } from 'antd';
import {LoadingOutlined,RightSquareOutlined,HistoryOutlined,UndoOutlined,RightOutlined,LeftOutlined,SaveOutlined} from '@ant-design/icons';
import 'antd/es/button/style/index.css';
import 'antd/es/message/style/index.css';
import logo from '../../assets/logo.png';
const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

class Test extends Component {
  state = {
    loading: true,
    questions: [],
    answers: {
      0: ""
    },
    currentQuestionIndex: 0,
    currentQuestion: { answer1: 'loading', answer2: 'loading', answer3: 'laoding', answer4: 'loading', question: 'loading' },
    selectedOption: "",
    questionNotAnsweredCounter: 0,
    questionAnsweredCounter: 0,   
    questionInReivewCounter: 0,   
    questionNotVisitedCounter: 0,  
  }


  componentDidMount() {
    this.pullTestQuestions();
  }


  // Pulls the test questions from firebase.
  pullTestQuestions = () => {
    let testRef = firebase.firestore().collection('test').doc('DlXxshW06CPEFPLnnjyQ');
    testRef.get()
      .then((doc) => {
        console.log(doc.id, '=>', doc.data());
        let l = doc.data().paper.length;
        this.setState({ questions: doc.data().paper, currentQuestion: doc.data().paper[0], questionNotAnsweredCounter: l, questionNotVisitedCounter: l - 1, loading: false });
      })
      .catch(err => {
        console.log('Error getting question paper', err);
      });
  }

  // Answer select or change options handler.
  answerSelectHandler = changeEvent => {
    this.setState({
      selectedOption: changeEvent.target.value
    });
  };

  // Invoked by "Save and Next" button.
  // Saves selected answer to the state.
  // Calls "nextQuestion" function in the end.
  saveAnswer = (selectedOption, currentQuestionIndex) => {
    let previousAnswer = this.state.answers[currentQuestionIndex]; // Find ( if any) previous answer user has given to the question.

    //  If user clicks on "Save and Next" without selecting an option, we return the user without executing rest of the function.
    if (selectedOption === "") {
      message.warn("Please select an answer !");
      return;
    }
    // If user clicks "Save and Next" without selecting an option AND question has been marked for review previously, we return the user without executing rest of the function.
    if (selectedOption === "mrkfrrevw7") {
      message.warn("Please select an answer !");
      return;
    }

    // If user clicks on "Save and Next" after selecting an option and question is marked for review already.
    if (previousAnswer === "mrkfrrevw7") {
      this.setState(prevState => ({ questionAnsweredCounter: prevState.questionAnsweredCounter + 1, questionInReivewCounter: prevState.questionInReivewCounter - 1, questionNotAnsweredCounter: prevState.questionNotAnsweredCounter - 1 }));
    }

    // If user clicks on "Save and Next" after selecting an option and there is NO previous answer to it.
    if (previousAnswer === "") {
      this.setState(prevState => {
        return ({ questionNotAnsweredCounter: prevState.questionNotAnsweredCounter - 1, questionAnsweredCounter: prevState.questionAnsweredCounter + 1, answers: { ...this.state.answers, [currentQuestionIndex]: selectedOption } });
      });
    }
    // If user clicks on "Save and Next" and there IS previous answer to it. We set the current selected option as answer in answers array.
    else {
      this.setState(prevState => ({ answers: { ...this.state.answers, [currentQuestionIndex]: selectedOption } }));
    }

    this.nextQuestion(currentQuestionIndex);
  }

  // Invoked by "Clear" button.
  // Clears all previous types of answers.
  clearAnswer = (currentQuestionIndex) => {
    let previousAnswer = this.state.answers[currentQuestionIndex];
    // If there is No previous answer, return.
    if (previousAnswer === "") {
      message.warn("Nothing to Clear !");
      return;
    }
    // If preivous answer is "mrkfrrevw7" meaning marked for review.
    if (previousAnswer === "mrkfrrevw7") {
      this.setState(prevState => ({ selectedOption: "", questionInReivewCounter: prevState.questionInReivewCounter - 1, answers: { ...this.state.answers, [currentQuestionIndex]: "" } }));
    }
    // If there exists any previous answer to the question except "mrkfrrevw7".
    else if (typeof previousAnswer === "string") {
      this.setState(prevState => ({ selectedOption: "", questionNotAnsweredCounter: prevState.questionNotAnsweredCounter + 1, questionAnsweredCounter: prevState.questionAnsweredCounter - 1, answers: { ...this.state.answers, [currentQuestionIndex]: "" } }));
    }
  }

  // Invoked by "Mark for Review and Next" button.
  // Marks question for reivew by assigning "markfrrevw7" string as an answer to the question.
  // Calls "nextQuestion" function in the end.
  markForReview = (currentQuestionIndex) => {
    let previousAnswer = this.state.answers[currentQuestionIndex];
    // If question is already marked for review already.
    if (previousAnswer === "mrkfrrevw7") {
      message.warn("Already marked for review !");
      return;
    }
    // If question is answered before marking for review.
    if (typeof previousAnswer === "string" && previousAnswer !== "mrkfrrevw7" && previousAnswer !== "") {
      this.setState(prevState => ({ questionAnsweredCounter: prevState.questionAnsweredCounter - 1, questionNotAnsweredCounter: prevState.questionNotAnsweredCounter + 1 }));
    }
    // Marks question for reivew by assigning "markfrrevw7" string as an answer to the question. 
    this.setState(prevState => ({ selectedOption: "mrkfrrevw7", questionInReivewCounter: prevState.questionInReivewCounter + 1, answers: { ...this.state.answers, [currentQuestionIndex]: "mrkfrrevw7" } }));
    this.nextQuestion(currentQuestionIndex);
  }

  // Invoked by "Next" button.
  // Traverse to the next question and update appropriate counters in the state.
  nextQuestion = (currentQuestionIndex) => {
    if (currentQuestionIndex >= this.state.questions.length - 1) {
      message.warn("This is the last Question !");
      return;
    }
    if (this.state.answers[currentQuestionIndex + 1] === undefined) {
      this.setState(prevState => ({ questionNotVisitedCounter: prevState.questionNotVisitedCounter - 1, answers: { ...prevState.answers, [currentQuestionIndex + 1]: "" } }))
    } else {
      this.setState({ selectedOption: this.state.answers[currentQuestionIndex + 1] })
    }
    this.setState({ currentQuestion: this.state.questions[currentQuestionIndex + 1], currentQuestionIndex: currentQuestionIndex + 1 });
  }

  // Invoked by "Previous" button.
  // Traverse to the previous question and update appropriate counters in the state.
  previousQuestion = (currentQuestionIndex) => {
    if (currentQuestionIndex === 0) {
      return;
    }
    this.setState({ currentQuestion: this.state.questions[currentQuestionIndex - 1], currentQuestionIndex: currentQuestionIndex - 1 });
    if (this.state.answers[currentQuestionIndex - 1] === undefined) {
      this.setState(prevState => ({ questionNotVisitedCounter: prevState.questionNotVisitedCounter - 1, answers: { ...this.state.answers, [currentQuestionIndex - 1]: "" } }));
    } else {
      this.setState({ selectedOption: this.state.answers[currentQuestionIndex - 1] })
    }
  }

  // Invoked by clicking on question number in navigation box.
  // Traverse to the selected question and update appropriate counters in the state.
  questionNavigationClick = (questionAnswerObj, questionIndex) => {
    // Loads question to view by setting question answer object to state and updates current question index. 
    this.setState({ currentQuestion: questionAnswerObj, currentQuestionIndex: questionIndex });
    // If question has never been traversed or clicked on before.
    if (this.state.answers[questionIndex] === undefined) {
      this.setState(prevState => ({ questionNotVisitedCounter: prevState.questionNotVisitedCounter - 1, answers: { ...this.state.answers, [questionIndex]: "" } }))
    }
    // If question has been traversed or clicked on before but not answered. sets selected option in state as previous answer.
    if (this.state.answers[questionIndex] !== "mrkfrrevw7" || this.state.answers[questionIndex] !== "") {
      this.setState({ selectedOption: this.state.answers[questionIndex] })
    }
  }

  render() {
    return (
      <React.Fragment>
        {this.state.loading ? <Spin className={classes.Spinner} indicator={loadingIcon}/> :
          (<div className={classes.contentwrapper}>
            <div className={classes.userinfobannerwrapper}>
              <div className={classes.examClientLogo}><img src={logo} alt="examer-logo" height="30" /></div>
            </div>

            <div className={classes.questionpaperandcontrolswrapper}>
              <div className={classes.questionpaperview}>

                <p className={classes.currentQuestiontext}><b>Question No.{this.state.currentQuestionIndex + 1}</b>{"  " + this.state.currentQuestion.question}</p>
                <div className={classes.hrline}></div><br></br>
                <p className={classes.optionstext}><b>Options:</b></p>
                <label className={classes.marginbottom}>
                  <input
                    type="radio"
                    name="qa"
                    checked={this.state.selectedOption === this.state.currentQuestion.answer1}
                    value={this.state.currentQuestion.answer1}
                    onChange={this.answerSelectHandler}
                    className="form-check-input"
                  />
                  {this.state.currentQuestion.answer1}
                </label>
                <label className={classes.marginbottom}>
                  <input
                    type="radio"
                    name="qa"
                    checked={this.state.selectedOption === this.state.currentQuestion.answer2}
                    value={this.state.currentQuestion.answer2}
                    onChange={this.answerSelectHandler}
                    className="form-check-input"
                  />
                  {this.state.currentQuestion.answer2}
                </label>
                <label className={classes.marginbottom}>
                  <input
                    type="radio"
                    name="qa"
                    checked={this.state.selectedOption === this.state.currentQuestion.answer3}
                    value={this.state.currentQuestion.answer3}
                    onChange={this.answerSelectHandler}
                    className="form-check-input"
                  />
                  {this.state.currentQuestion.answer3}
                </label>
                <label className={classes.marginbottom}>
                  <input
                    type="radio"
                    name="qa"
                    checked={this.state.selectedOption === this.state.currentQuestion.answer4}
                    value={this.state.currentQuestion.answer4}
                    onChange={this.answerSelectHandler}
                    className="form-check-input"
                  />
                  {this.state.currentQuestion.answer4}
                </label>

              </div>
              <div className={classes.questionpapercontrols}>
                <div className={classes.questionpapercontrolsrowone}>
                  <Button type="primary" icon={<RightSquareOutlined />} size="small" onClick={() => this.saveAnswer(this.state.selectedOption, this.state.currentQuestionIndex)}>Save and Next</Button>
                  <Button type="primary" icon={<UndoOutlined />} size="small" onClick={() => this.clearAnswer(this.state.currentQuestionIndex)}>Clear</Button>
                  <Button type="primary" icon={<HistoryOutlined />} size="small" onClick={() => this.markForReview(this.state.currentQuestionIndex)}>Mark For Review and Next</Button>
                </div>
                <div className={classes.questionpapercontrolsrowtwo}>
                  <Button type="primary" icon={<LeftOutlined />} size="small" disabled={this.state.currentQuestionIndex === 0} onClick={()=>this.previousQuestion(this.state.currentQuestionIndex)}>Previous</Button>
                  <Button type="primary" icon={<RightOutlined />} size="small" disabled={this.state.currentQuestionIndex === this.state.questions.length - 1} onClick={() => this.nextQuestion(this.state.currentQuestionIndex)}>Next</Button>
                  <Button type="primary" icon={<SaveOutlined />} size="small" >Submit</Button>
                </div>
              </div>
            </div>

            {/* Keep track of elements in the answers object*/}
            <div className={classes.questionanswerinformationwrapper}>
              <div className={classes.questionanswercount}>
                <div className={classes.aligncenter}>
                  <div className={classes.questionnotvisited}><div>{this.state.questionNotVisitedCounter}</div></div>
                  <span >Questions Not Visited</span>
                </div>
                <div className={classes.aligncenter}>
                  <div className={classes.questionanswered}><div>{this.state.questionAnsweredCounter}</div></div>
                  <span>Questions Answered</span>
                </div>
                <div className={classes.aligncenter}>
                  <div className={classes.questioninreview}><div>{this.state.questionInReivewCounter}</div></div>
                  <span>Questions In Review</span>
                </div>
                <div className={classes.aligncenter}>
                  <div className={classes.questionnotanswered}><div>{this.state.questionNotAnsweredCounter}</div></div>
                  <span>Questions Not Answered</span>
                </div>
              </div>
              <div className={classes.questionanswernavigation}>
                {this.state.questions.map((questionAnswerObj, questionIndex) => {
                  return <QuestionNavigation click={() => this.questionNavigationClick(questionAnswerObj, questionIndex)} userAnswer={this.state.answers[questionIndex]} key={questionIndex} questionIndex={questionIndex} currentQuestionIndex={this.state.currentQuestionIndex} />;
                })}
              </div>
            </div>
          </div>)}
      </React.Fragment>

    );
  }
}
export default Test;