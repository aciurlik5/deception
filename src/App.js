import './App.css';
import {useEffect, useState} from 'react';
import pos from 'parts-of-speech';


function App() {

  const [count, setCount] = useState(0);
  const [guess, setGuess] = useState('');
  const [orderStatementDeception, setOrder] = useState();


  useEffect(() => {
    }, [count]);


  function guessLie(){
    let s1 = document.getElementById("s1").value;
    let s2 = document.getElementById("s2").value;
    let s3 = document.getElementById("s3").value;
    let order = getOrderOfDeceptionLiklihood(s1, s2, s3)
    setOrder(order);
    setGuess(order[0].statement);
    setCount(1);

  }

  function getOrderOfDeceptionLiklihood(s1, s2, s3){

    let exclusiveWordsAndPhrases = ['but', 'except', 'without', 'beside', 'besides', 'excepting', 'excluding', 'absent', 'apart from', 'other than'];
    let tentativeWords = ['guess', 'maybe', 'perhaps', 'seem', 'may', 'could', 'appear', 'imply', 'indicate', 'tend', 'suggest', 'often', 'generally', 'possibly', 'probably'];
    let angryWords = ['anger', 'indignation', 'fury', 'irritation', 'outrage', 'wrath', 'rage', 'angry', 'outraged', 'mad', 'enraged', 'indignant', 'ballistic', 'infuriated', 'furious', 'infuriate', 'hate', 'despise', 'disliked', 'detested', 'depised', 'abhorred', 'loathed', 'kill', 'destroy', 'dispatch', 'slay', 'destroyed', 'slaughtered', 'murdered', 'slew', 'dispatched', 'irritate', 'bother', 'bug', 'aggrevate', 'persecute', 'irritated', 'upset', 'displeased', 'bothered', 'angry', 'exasperated', 'aggrevated'];
    let firstPersonPronouns = ['I', 'me', 'my', 'mine', 'we', 'us', 'ours', 'our'];
    let s1o = {statement: s1};
    let s2o = {statement: s2};
    let s3o = {statement: s3};
    let listOfStatements = [s1o, s2o, s3o];


    s1o.words = s1.split(/\s+/);
    s1o.totalWords = s1o.words.length;
    s1o.uniqueWordCount = getUniqueWordCount(s1o.words);
    s1o.exclusiveWordCount = getWordCount(s1o.statement, exclusiveWordsAndPhrases);
    s1o.tentativeWordCount = getWordCount(s1o.statement, tentativeWords);
    s1o.angryWordCount = getWordCount(s1o.statement, angryWords);
    s1o.firstPersonPronounCount = getWordCount(s1o.statement, firstPersonPronouns);

    s2o.words = s2.split(/\s+/);
    s2o.totalWords = s2o.words.length;
    s2o.uniqueWordCount = getUniqueWordCount(s2o.words);
    s2o.exclusiveWordCount = getWordCount(s2o.statement, exclusiveWordsAndPhrases);
    s2o.tentativeWordCount = getWordCount(s2o.statement, tentativeWords);
    s2o.angryWordCount = getWordCount(s2o.statement, angryWords);
    s2o.firstPersonPronounCount = getWordCount(s2o.statement, firstPersonPronouns);



    s3o.words = s3.split(/\s+/);
    s3o.totalWords = s3o.words.length;
    s3o.uniqueWordCount = getUniqueWordCount(s3o.words);
    s3o.exclusiveWordCount = getWordCount(s3o.statement, exclusiveWordsAndPhrases);
    s3o.tentativeWordCount = getWordCount(s3o.statement, tentativeWords);
    s3o.angryWordCount = getWordCount(s3o.statement, angryWords);
    s3o.firstPersonPronounCount = getWordCount(s3o.statement, firstPersonPronouns);

    let nScores = normalizeScores(s1o, s2o, s3o);

    let sorted = nScores.sort((a,b) => a.n_sum - b.n_sum);
    




    //length. 
    console.log(sorted);
    //
    return sorted;

  }


  function normalizeScores(s1, s2, s3){
    let metrics = ['totalWords', 'uniqueWordCount', 'exclusiveWordCount', 'tentativeWordCount', 'angryWordCount', 'firstPersonPronounCount'];

    for(let metric of metrics){
      console.log(metric);
      let maxVal = s1[metric];
      console.log('MV', maxVal);
      if(s2[metric] > maxVal){
        maxVal = s2[metric];
      }
      if(s3[metric] > maxVal){
        maxVal = s3[metric]
      }
      let variableName = 'n_' + metric;
      console.log('MV',maxVal);
      if(maxVal == 0){
        s1[variableName] = 0;
        s2[variableName] = 0;
        s3[variableName] = 0;

      }
      else if(metric != 'angryWordCount'){
        s1[variableName] = s1[metric]/maxVal;
        s2[variableName] = s2[metric]/maxVal;
        s3[variableName] = s3[metric]/maxVal;



      } else{
        s1[variableName] = 1-(s1[metric]/maxVal);
        s2[variableName] = 1-(s2[metric]/maxVal);
        s3[variableName] = 1-(s3[metric]/maxVal);

  

      }
    }

    s1['n_sum'] = 0;
    s2['n_sum'] = 0;
    s3['n_sum'] = 0;
    for(let metric of metrics){
      let value = 'n_' + metric;
      s1['n_sum'] = s1['n_sum'] + s1[value];
      s2['n_sum'] = s2['n_sum'] + s2[value];
      s3['n_sum'] = s3['n_sum'] + s3[value];
    }


    
    return [s1, s2, s3]


  }

  function getWordCount(statement, arrayOfWords){
    let count = 0;
    for(let word of arrayOfWords){
      if(statement.includes(word)){
        count = count + 1;
      }
    return count;
    }

    // var words = new pos.Lexer().lex(words);
    // var tagger = new pos.Tagger();
    // var taggedWords = tagger.tag(words);
    // for (let i in taggedWords) {
    //   var taggedWord = taggedWords[i];
    //   var word = taggedWord[0];
    //   var tag = taggedWord[1];
    //   console.log(word + " /" + tag);
    // } 
  }

  function getUniqueWordCount(words){
    let seenWords = {};
    let count = 0;
    for(let word of words){
      if(!seenWords[word]){
        seenWords[word] = true;
        count = count + 1;
      }
    }
    return count;

  }


  function incorrectWorkflow(){
    setCount(2);

  }

  function sendCorrectA(){
    console.log('TEST')
    console.log(orderStatementDeception[1].statement)
    setCount(0);

  }

  function sendCorrectB(){
    console.log('TEST')
    console.log(orderStatementDeception[2].statement)
    setCount(0);

  }

  function playAgain(){
    setCount(0);
  }

  return (
    <div>

    {count === 0 && <div className="App">
      <h3>Two Truths and One Lie</h3>
      <p>
        Please put one statement about yourself in each of the following fields. <br></br>
        Two should be factual statements about your life, and one should be false. <br></br>
        It doesn't matter in which slot you put the lie.

      </p>

      <h4> Statement One:</h4>
      <textarea id='s1'></textarea>
      <h4> Statement Two:</h4>
      <textarea id='s2'></textarea>
      <h4> Statement Three:</h4>
      <textarea id='s3'></textarea>
      <br></br>
      <button onClick={guessLie}>Guess the lie!</button>

      <br></br>
      <br></br>
      Who am I playing? (optional)<input id='name'></input>

    </div>
    }




    {count === 1 && <div className="App">
      <h3>I think the lie is....{guess}</h3>
      <h4>Was a correct?</h4>
      <button onClick={playAgain}>Yes...Play Again</button><button onClick={incorrectWorkflow}>No</button>
    </div>
    }

  {count === 2 && <div className="App">
      <h3>I'm dying to know, which is the lie?</h3>
      <h4>Statement A: {orderStatementDeception[1].statement}</h4>
      <h4>Statement B: {orderStatementDeception[2].statement}</h4>
      <button onClick={sendCorrectA}>Statement A</button>
      <button onClick={sendCorrectB}>Statement B</button>
    </div>
  }



    </div>
  );
}

export default App;
