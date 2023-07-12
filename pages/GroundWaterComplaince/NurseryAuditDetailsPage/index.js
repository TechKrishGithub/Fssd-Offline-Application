import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Alert ,ActivityIndicator, ScrollView} from "react-native";
import { Badge, Button } from "@rneui/themed";
import * as SQLite from 'expo-sqlite';
import styles from "./style";


const db = SQLite.openDatabase('mydb.Nursery');

const sqlReadCommend1='SELECT * FROM NurseryAuditAnswers';
const sqlReadCommend2='SELECT * FROM NurseyAuditCriterionQuestions'
const dropTable='Drop table if exists NurseryAuditAnswers'

const NurseryAuditDetailsPage = ({ route, navigation }) => { 
  const { 
    nurseryAuditDetails, 
    id,
    nursery,
    location,
    District,
    species,
    dateOfAudit,
    representative,
    representativeName,
    phonenumber,
    latitude,
    longitude,
    altitude,
    auditcriterionid,
    que1,
    que2,
    que3,
    filterSyncedData
  } = route.params;


  const [scores, setScores] = useState([]); // initialize scores array
  const [comments, setComments] = useState([]); // initialize comments array
  const [loading,setLoading]=useState(true);

  const [scoreWithQuestion,setScoreWithQuestion]=useState([]);
  const [commentWithQuestion,setCommentWithQuestion]=useState([]);


  const [detForEdit,setDetForEdit]=useState([]);
  const [dataForUpdate,setDataForUpdate]=useState([]);

  const [data,setData]=useState([]);

  const [score,setScore]=useState('');
  const [comment,setComment]=useState('');

  const [subFactorQuestions, setSubFactorQuestions] = useState([]);
  const [TotalScore,setTotalScore]=useState(0);


  const [success,setSuccess]=useState('');
  const [fail,setFail]=useState('');
  const [failForScore,setFailForScore]=useState('');

  const getComplainceCategoriesQuestions = async () => {
    db.transaction(tx=>
      { 
          tx.executeSql(
            sqlReadCommend2,
              [],
              (_, { rows }) => {
                setSubFactorQuestions(rows._array);
      })
    })
  };

  useEffect(() => {
   console.log(nursery);
   getNursery();
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS NurseryAuditAnswers (id INTEGER PRIMARY KEY AUTOINCREMENT,nursery varchar, auditcriterionid varchar,question varchar,maxscore integer,comment varchar)',
      );
    });
    getComplainceCategoriesQuestions();
    setTimeout(()=>
    {
      getComplainceCategoriesQuestions();
      setLoading(false);
      getNursery();
      db.transaction(tx => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS NurseryAuditAnswers (id INTEGER PRIMARY KEY AUTOINCREMENT,nursery varchar, auditcriterionid varchar,question varchar,maxscore integer,comment varchar)',
        );
      });
    },2000)
  }, []);


  const getNursery=()=>
  {
    db.transaction((tx) => {
      tx.executeSql(
          'SELECT nursery FROM NurseryAuditAnswers WHERE auditcriterionid = ? AND nursery = ?',
          [auditcriterionid, nursery],
          (_, { rows }) => {
          const nurseryExists = rows.length > 0;
          // Process the result based on whether the nursery exists or not
          if (nurseryExists) {
            tx.executeSql(
              'SELECT * FROM NurseryAuditAnswers WHERE auditcriterionid = ? AND nursery = ?',
              [auditcriterionid, nursery],
              (_, { rows }) => 
              {
                setDetForEdit(rows._array);
                setDataForUpdate(rows._array);
              }
              )
          }

        }
      )
    })
   
  }

  

  if(loading)
  {
    return(
      <View style={styles.Indicator}>
        <ActivityIndicator size="large" color="#00f"/>
      </View>
    )
  }

  const filteredQuestions = subFactorQuestions?.filter(
    (question) => question.auditcriterionid === nurseryAuditDetails.auditcriterionid
  );

  

 
  const handleScoreChange = (index, score,maxscore) => {

    if(parseInt(score) > maxscore)
    {
      setFailForScore('Sorry Score must be less than Maxscore');
    }
    else
    {
      setFail('');
      setFailForScore('');
      setScore(score);
      const updatedScores = [...scores]; // make a copy of scores array
      updatedScores[index] = score; // update the score for the corresponding question
      setScores(updatedScores); // update the scores state with the updated array
    }
   
  };

  const handleCommentChange = (index, comment) => {
    setFail('');
    const updatedComments = [...comments]; // make a copy of comments array
    updatedComments[index] = comment; // update the comment for the corresponding question
    setComments(updatedComments); // update the comments state with the updated array
  };


  const dataInsert=()=>
  {
    const arrayString = JSON.stringify(species);
    db.transaction(tx=>
      {
        tx.executeSql('SELECT nursery from NurseryAuditEntryDetails',[],
        (_, { rows }) => {
          // Get all values from the column and check if drillPip is exists
          const nurseryValues = rows._array.map((row) => row.nursery);
          if (nurseryValues.includes(nursery)) {
            console.log('Value already exists in the column');
          }
          else
          {
            tx.executeSql('INSERT INTO NurseryAuditEntryDetails(nursery,location,District,species,date,typeOfRepresentative,nameOfRepresentative,phonenumber,Latitude,Longitude,Altitude,SeedfromNationallyRecommendedSources,HoldingCapacity,BothRequisitesHaveBeenMet) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
            [nursery,location,District,arrayString,dateOfAudit,representative,representativeName,phonenumber,latitude,longitude,altitude,que1,que2,que3],
            (tx,result)=>
            {
              console.log('Data inserted into table successful')
            },
            (error)=>console.log(error)
            )
          }

        })

      })
  
  }





  const handleScoreData=(i,score,question,maxscore)=>
  {
    if(parseInt(score) > maxscore)
    {
      setFailForScore('Sorry Score must be less than Maxscore');
    }
    else
    {
      setFailForScore('');
      setFail('');
      const myScoreWithQuestion=[...scoreWithQuestion];
      myScoreWithQuestion[i]={score,question};
      setScoreWithQuestion(myScoreWithQuestion)
    }
   
  }

  const handleCommentData=(i,comment,question)=>
  {
    setFail('');
    const mycommentWithQuestion=[...commentWithQuestion];
    mycommentWithQuestion[i]={comment,question};
    setCommentWithQuestion(mycommentWithQuestion)
  }

  const totalScores = scores.reduce((acc, cur) => acc + parseInt(cur), 0);
  

  const handleSubmit=()=>
  {
    const checkScoreLength=scoreWithQuestion.filter((item) => item !== undefined);

    if(checkScoreLength.length!==filteredQuestions.length)
    {
      setFail('Sorry Scores are mandatory For Every Question');
    }
    else
    {
      const myscores=scoreWithQuestion.map((v)=>v.score);
      if (myscores.every((data) => data !== "")) {
        const filteredDataOfComments= commentWithQuestion.filter((item) => item !== undefined);
        const mergedArray = scoreWithQuestion.map((item) => {
          const matchingQuestion = filteredDataOfComments.find((element) => element.question === item.question);
        
          return {
            comment: matchingQuestion ? (matchingQuestion.comment || "") : "",
            score: item.score,
            question: item.question
          };
        });
        const isTableEmpty = () => {
          return new Promise((resolve, reject) => {
            db.transaction((tx) => {
              tx.executeSql(
                'SELECT COUNT(*) as count FROM NurseryAuditAnswers',
                [],
                (_, result) => {
                  const count = result.rows.item(0).count;
                  resolve(count === 0);
                },
                (_, error) => {
                  reject(error);
                }
              );
            });
          });
        };
        
        isTableEmpty()
          .then((empty) => {
           if(empty)
           {
            dataInsert();
            const filteredDataForInsert = mergedArray.filter((item) => item !== undefined);
            db.transaction((tx) => {
              filteredDataForInsert.map((i,index)=>
              {
                    const parsedScore = parseInt(i.score); 
                    tx.executeSql('INSERT INTO NurseryAuditAnswers(nursery,auditcriterionid,question,maxscore,comment) VALUES(?,?,?,?,?)',
                    [nursery,filteredQuestions[0]?.auditcriterionid,i.question,parsedScore,i.comment],
                    (tx,resullt)=>
                    {
                      setFail('');
                      setSuccess('Data Saved Successfully......');
                      if (index === filteredDataForInsert.length - 1) {
                        // All data has been processed, navigate back to the screen
                        setTimeout(()=>
                                { 
                                  navigation.goBack();
                                },200)
                      }
                    },
                    (error)=>
                    {
                      console.log('NurseryAuditAnswers Error',error);
                      setFail('Sorry Data Not Saved Try Again');
                      setSuccess('');
                    }
                    )
              })
            })
           }
           else
           {
            db.transaction((tx) => {
              tx.executeSql(
                  'SELECT nursery FROM NurseryAuditAnswers WHERE auditcriterionid = ? AND nursery = ?',
                  [filteredQuestions[0]?.auditcriterionid, nursery],
                  (_, { rows }) => {
                  const nurseryExists = rows.length > 0;
                  // Process the result based on whether the nursery exists or not
                  if (nurseryExists) {
                   console.log(rows.length)
                    setSuccess('');
                    setFail('Sorry Data Already Saved On this Audit Criterion')
          
                  } else {
      
                    dataInsert();
                    const filteredDataForInsert = mergedArray.filter((item) => item !== undefined);
                    console.log(filteredDataForInsert)
                    filteredDataForInsert.map((i,index)=>
                      {
                        const parsedScore = parseInt(i.score); 
                            tx.executeSql('INSERT INTO NurseryAuditAnswers(nursery,auditcriterionid,question,maxscore,comment) VALUES(?,?,?,?,?)',
                            [nursery,filteredQuestions[0]?.auditcriterionid,i.question,parsedScore,i.comment],
                            (tx,resullt)=>
                            {
                              setFail('');
                              setSuccess('Data Saved Successfully......');
                              if (index === filteredDataForInsert.length - 1) {
                                // All data has been processed, navigate back to the screen
                                setTimeout(()=>
                                { 
                                  navigation.goBack();
                                },200)
                               
                              }
                            },
                            (error)=>
                            {
                              console.log(error);
                              setFail('Sorry Data Not Saved Try Again');
                              setSuccess('');
      
                            }
                            
                            )
                      })
                     
                    
                  }
                },
                (error) => {
                  console.log('Error executing SQL: ', error);
                }
              );
            });
           }
          })
          .catch((error) => {
            console.log('Error:', error);
          });
       
      }
      else
      {
        setFail('Sorry Scores are mandatory For Every Question');
      }
     
    }


  }

  

  const handleUpdate=()=>
  {
    const filteredObservations=detForEdit.map(obj=>
         {
              const { auditcriterionid,id, ...rest } = obj;
              return rest;
            });
            const hasInvalidMaxScore = filteredObservations.some(obj => obj.maxscore === '' || obj.maxscore === null || obj.maxscore === undefined);
            if (hasInvalidMaxScore) {
              setFail('Sorry Scores are mandatory For Every Question');
           }
           else
           {
           setFail('');
           setSuccess('');
    // Update or insert data into the SQLite database
    db.transaction(tx=>
      {
        filteredObservations.map((item,index) => {
          tx.executeSql(
            'SELECT * FROM NurseryAuditAnswers WHERE nursery = ? AND auditcriterionid = ? AND question = ?',
            [nursery, filteredQuestions[0]?.auditcriterionid, item.question],
            (tx, resultSet) => {
              if (resultSet.rows.length > 0) {
                // Update the existing record
                tx.executeSql(
                  'UPDATE NurseryAuditAnswers SET maxscore = ?, comment = ? WHERE nursery = ? AND auditcriterionid = ? AND question = ?',
                  [item.maxscore, item.comment, nursery, filteredQuestions[0]?.auditcriterionid, item.question],
                  (tx, result) => {
                    // Update success
                    setFail('');
                    setSuccess('Data Updated Successfully');
                    if (index === filteredObservations.length - 1) {
                      // All data has been processed, navigate back to the screen
                      setTimeout(()=>
                                { 
                                  navigation.goBack();
                                },200)
                    }
                  },
                  (tx, error) => {
                    setSuccess('');
                    // Update failed
                    console.log('Failed to update data', error);
                  }
                );
              } else {
                // Insert a new record
                tx.executeSql(
                  'INSERT INTO NurseryAuditAnswers (nursery, auditcriterionid, question, maxscore, comment) VALUES (?, ?, ?, ?, ?)',
                  [nursery, filteredQuestions[0]?.auditcriterionid, item.question, item.maxscore, item.comment],
                  (tx, result) => {
                    // Insert success
                    setSuccess('Data Updated Successfully');
                    if (index === filteredObservations.length - 1) {
                      // All data has been processed, navigate back to the screen
                      setTimeout(()=>
                                { 
                                  navigation.goBack();
                                },200)
                    }
                    console.log('Data inserted successfully');
                  },
                  (tx, error) => {
                    // Insert failed
                    console.log('Failed to insert data', error);
                  }
                );
              }
            },
            (tx, error) => {
              console.log('Failed to select data', error);
            }
          );
        });
        
      })
    }
    
  }



  

  const handleScoreChangeForUpdate = (index, score, maxscore) => {
    if (parseInt(score) > maxscore) {
      setFailForScore('Sorry, Score must be less than Maxscore');
    }
    else
    {
      setFail('');
      setFailForScore('');
      const question = filteredQuestions[index];
    const updatedDetForEdit = [...detForEdit];
    const detEditIndex = updatedDetForEdit.findIndex(
      (item) => item.question === question.question
    );
  
    if (detEditIndex !== -1) {
      updatedDetForEdit[detEditIndex] = {
        ...updatedDetForEdit[detEditIndex],
        maxscore: score,
      };
    } else {
      updatedDetForEdit.push({
        question: question.question,
        maxscore: score,
        comment: '',
      });
    }
  
    setDetForEdit(updatedDetForEdit);

    }
  };
  
  const handleCommentChangeForUpdate = (index, comment) => {
    const question = filteredQuestions[index];

  const updatedDetForEdit = [...detForEdit];
  const detEditIndex = updatedDetForEdit.findIndex(
    (item) => item.question === question.question
  );

  if (detEditIndex !== -1) {
    updatedDetForEdit[detEditIndex] = {
      ...updatedDetForEdit[detEditIndex],
      comment: comment,
    };
  } else {
    updatedDetForEdit.push({
      question: question.question,
      maxscore: question.maxscore,
      score: '',
      comment: comment,
    });
  }

  setDetForEdit(updatedDetForEdit);
  };


  const getTotalScore = () => {
    let totalScore = 0;
    detForEdit.forEach((item) => {
      totalScore += parseInt(item.maxscore);
    });
    return totalScore;
  };

  // const DyTotalScore = detForEdit.reduce((total, item) => total + parseInt(item.maxscore||0), 0);
  if(detForEdit.length>0)
  {
    return(
      <>
       <ScrollView>
      {/* <Button
      title='know'
      onPress={()=>{console.log(detForEdit)}}
      /> */}
       <View style={styles.Heading}>
            
            <Text style={styles.HeadText}>{nurseryAuditDetails.auditcriterion}</Text>
          </View>
        {failForScore?
           <Text style={{color:'red',marginLeft:20,padding:5}}>{failForScore}</Text>
           :null
       }
      
       <View style={styles.containerView}>
{filteredQuestions.map((fQuestion, i) => {
  const detEditIndex = detForEdit.findIndex(
    (item) => item.question === fQuestion.question
  );
  const hasDetForEdit = detEditIndex !== -1;
  const detForEditItem = hasDetForEdit ? detForEdit[detEditIndex] : {};
 

  return (
    <React.Fragment key={i}>
      <View style={{ flexDirection: 'row', width: '90%' }}>
        <Text style={styles.textLabel} numberOfLines={4} ellipsizeMode="tail">
          {i + 1}
        </Text>
        <Text style={styles.question}>{fQuestion.question}</Text>
      </View>
      <View style={styles.questionRowView}>
        <Badge
          value={' maxscore  ' + fQuestion?.maxscore}
          containerStyle={styles.badgeView}
          textStyle={{ fontSize: 11, color: 'white', fontWeight: '500' }}
          badgeStyle={{ backgroundColor: '#088F8F' }}
        />
        {hasDetForEdit ? (
          <>
            <TextInput
              style={styles.scoreInput}
              placeholder="score"
              onChangeText={(score) =>
                handleScoreChangeForUpdate(i, score.replace(/[^0-9]/g, ''), fQuestion.maxscore)
              }
              value={detForEditItem?.maxscore?.toString() || ''}
              keyboardType="number-pad"
              inputMode="numeric"
            />
            <TextInput
              style={[styles.userView, { width: 275 }]}
              placeholder="comment"
              onChangeText={(comment) => handleCommentChangeForUpdate(i, comment)}
              value={detForEditItem.comment || ''}
              inputMode="text"
            />
          </>
        ) : (
          <>
            <TextInput
              style={styles.scoreInput}
              placeholder="score"
              onChangeText={(score) =>
                handleScoreChangeForUpdate(i, score.replace(/[^0-9]/g, ''), fQuestion.maxscore)
              }
              value=""
              keyboardType="number-pad"
              inputMode="numeric"
            />
            <TextInput
              style={[styles.userView, { width: 275 }]}
              placeholder="comment"
              onChangeText={(comment) => handleCommentChangeForUpdate(i, comment)}
              value=""
              inputMode="text"
            />
          </>
        )}
      </View>
      <View style={styles.horizontalLine} />
    </React.Fragment>
  );
})}

   
         <View style={{ flex: 0.35 }}>
           <Button
             title={`Total Score is ${getTotalScore()}`}
             buttonStyle={{
               borderColor: "rgba(78, 116, 289, 1)",
             }}
             type="outline"
             raised
             disabled
             titleStyle={{ color: "rgba(78, 116, 289, 1)" }}
             containerStyle={{
               marginHorizontal: 30,
               marginVertical: 10,
             }}
           />
          {
             fail?
             <Text style={{color:'red',marginLeft:20,padding:5}}>{fail}</Text>
             :null
           }
           {
             success?
               <Text style={{color:'green',marginLeft:20,padding:5}}>{success}</Text>
             :null
           }
           {filterSyncedData==undefined&&
             <Button
             loading={false}
             loadingProps={{ size: "small", color: "white" }}
             title="Update"
             type="solid"
             containerStyle={{
               marginHorizontal: 30,
               marginVertical: 10,
             }}
             onPress={() => handleUpdate()}
           />
           }
         
      
         </View>
        
       </View>
       </ScrollView>
     
       </>
     );
  }
   
  

  return (
    <>
    <ScrollView>
         <View style={styles.Heading}>
         
        <Text style={styles.HeadText}>{nurseryAuditDetails.auditcriterion}</Text>
      </View>
     {failForScore?
        <Text style={{color:'red',marginLeft:20,padding:5}}>{failForScore}</Text>
        :null
    }
    
    <View style={styles.containerView}>
      {filteredQuestions?.map((fQuestion, i) => {
        return (
          <React.Fragment key={i}>
            <View style={{flexDirection:'row',width:'90%'}}>
            <Text
              style={styles.textLabel}
              numberOfLines={4}
              ellipsizeMode="tail"
            >
              {i + 1}
            </Text>
            <Text style={styles.question}>
              {fQuestion.question}
            </Text>
            </View>
            <View style={styles.questionRowView}>
              <Badge
                value={' maxscore  ' + fQuestion?.maxscore}
                containerStyle={styles.badgeView}
                textStyle={{ fontSize: 11 ,color:'white',fontWeight:'500'}}
                badgeStyle={{ backgroundColor: '#088F8F' }}
              />
              <TextInput
                style={styles.scoreInput}
                placeholder="score"
                onChangeText={(score) =>
                  {
                    setScore(score);
                  handleScoreChange(i, score.replace(/[^0-9]/g,""),fQuestion.maxscore)
                  handleScoreData(i,score,fQuestion.question,fQuestion.maxscore)
                  }
                }
                value={scores[i] || ""} // use the score for the corresponding question
                keyboardType={"number-pad"}
                inputMode={"numeric"}
              />
              <TextInput
                style={[styles.userView, { width: 275 }]}
                placeholder="comment"
                onChangeText={(comment) => 
                  {
                  setComment(comment)
                  handleCommentChange(i, comment)
                  handleCommentData(i,comment,fQuestion.question)
                  }}
                value={comments[i] || ""} // use the comment for the corresponding question
                inputMode={"text"}
                
              />
            </View>
            <Text></Text>
          </React.Fragment>
        );
      })}

      <View style={{ flex: 0.35 }}>
        <Button
          title={`Total Score is ${totalScores}`}
          buttonStyle={{
            borderColor: "rgba(78, 116, 289, 1)",
          }}
          type="outline"
          raised
          disabled
          titleStyle={{ color: "rgba(78, 116, 289, 1)" }}
          containerStyle={{
            marginHorizontal: 30,
            marginVertical: 10,
          }}
        />
       {
          fail?
          <Text style={{color:'red',marginLeft:20,padding:5}}>{fail}</Text>
          :null
        }
        {
          success?
            <Text style={{color:'green',marginLeft:20,padding:5}}>{success}</Text>
          :null
        }
        <Button
          loading={false}
          loadingProps={{ size: "small", color: "white" }}
          title="Submit"
          type="solid"
          containerStyle={{
            marginHorizontal: 30,
            marginVertical: 10,
          }}
          onPress={() => handleSubmit()}
        />
      </View>
     
    </View>
    </ScrollView>
  
    </>
  );
};

export default NurseryAuditDetailsPage;
