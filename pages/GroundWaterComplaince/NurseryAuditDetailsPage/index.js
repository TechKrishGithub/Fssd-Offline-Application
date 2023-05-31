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
    species,
    dateOfAudit,
    representative,
    representativeName,
    latitude,
    longitude,
    altitude,
    auditcriterionid
  } = route.params;


  const [scores, setScores] = useState([]); // initialize scores array
  const [comments, setComments] = useState([]); // initialize comments array
  const [loading,setLoading]=useState(true);


  const [detForEdit,setDetForEdit]=useState([]);
  const [dataForUpdate,setDataForUpdate]=useState([]);

  const [data,setData]=useState([]);

  const [score,setScore]=useState('');
  const [comment,setComment]=useState('');

  const [subFactorQuestions, setSubFactorQuestions] = useState([]);


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
      setFailForScore('');
      setScore(score);
      const updatedScores = [...scores]; // make a copy of scores array
      updatedScores[index] = score; // update the score for the corresponding question
      setScores(updatedScores); // update the scores state with the updated array
    }
   
  };

  const handleCommentChange = (index, comment) => {
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
            tx.executeSql('INSERT INTO NurseryAuditEntryDetails(nursery,location,species,date,typeOfRepresentative,nameOfRepresentative,Latitude,Longitude,Altitude) values(?,?,?,?,?,?,?,?,?)',
            [nursery,location,arrayString,dateOfAudit,representative,representativeName,latitude,longitude,altitude],
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



 

 const onPress=()=>
 {
  db.transaction(tx=>
    {
      tx.executeSql('select * from NurseryAuditAnswers where auditcriterionid=? and nursery=?',
      [dataForUpdate[0].auditcriterionid,nursery],
      (tx,result)=>
      {
        for(let i=0;i<result.rows.length;i++)
        {
          const {nursery,auditcriterionid,question,maxscore,comment}=result.rows.item(i);
          console.log(`nursery:${nursery},auditcriterionid:${auditcriterionid},question:${question},maxscore:${maxscore},comment:${comment}`);
        }
      }
      )
    })
 }

  const handleData=(i,score,comment,question)=>
  {
    const myData=[...data];
    myData[i]={score,comment,question};
    setData(myData)
  }

  const totalScores = scores.reduce((acc, cur) => acc + parseInt(cur), 0);
  

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      // Handle case when there is no previous screen
    }
  };


  const handleSubmit=()=>
  {
    if(data.length<=0)
{
  setFail('Sorry Please Fill Data');
}
else
{

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
      db.transaction((tx) => {
      data.map(i=>
        {
              tx.executeSql('INSERT INTO NurseryAuditAnswers(nursery,auditcriterionid,question,maxscore,comment) VALUES(?,?,?,?,?)',
              [nursery,filteredQuestions[0].auditcriterionid,i.question,i.score,i.comment],
              (tx,resullt)=>
              {
                setFail('');
                setSuccess('Data Saved Successfully......');
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
            [filteredQuestions[0].auditcriterionid, nursery],
            (_, { rows }) => {
            const nurseryExists = rows.length > 0;
            // Process the result based on whether the nursery exists or not
            if (nurseryExists) {
             console.log(rows.length)
              setSuccess('');
              setFail('Sorry Data Already Saved On this Audit Criterion')
    
            } else {

              dataInsert();
              data.map(i=>
                {
                      tx.executeSql('INSERT INTO NurseryAuditAnswers(nursery,auditcriterionid,question,maxscore,comment) VALUES(?,?,?,?,?)',
                      [nursery,filteredQuestions[0].auditcriterionid,i.question,i.score,i.comment],
                      (tx,resullt)=>
                      {
                        setFail('');
                        setSuccess('Data Saved Successfully......');
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


    setTimeout(()=>
    {
       if(fail!='')
       {
        console.log('okay')
       }
       else
       {
        goBack();
       }
    },1000)

  
}
      
  }


  const handleUpdate=()=>
  {
    dataForUpdate.map(v=>
      {
        db.transaction((tx) => {
          tx.executeSql(
            'UPDATE NurseryAuditAnswers SET maxscore=?, comment=? WHERE auditcriterionid = ? AND nursery=? AND question=?',
            [v.maxscore, v.comment,v.auditcriterionid,nursery,v.question],
            (_, result) => {
              setFail('');
              setSuccess('Data Updated Successfully');
            },
            (_, error) => {
              console.log(error);
            }
          );
        });
      })
    console.log(dataForUpdate)
    setTimeout(()=>
    {
       if(fail!='')
       {
        console.log('okay')
       }
       else
       {
        goBack();
       }
    },1000)
    
  }


  const handleFieldChange = (index, field, value, maxscore) => {
    if(parseInt(value) > maxscore)
    {
      setFailForScore('Sorry Score must be less than Maxscore');
    }
    else
    {
      setFailForScore('');
      const updatedData = [...dataForUpdate];
      updatedData[index][field] = value;
      setDataForUpdate(updatedData);
    }
   
  };


  if(detForEdit.length>0)
  {
    return(
      <>
      
      {/* <Button
      title='know'
      onPress={onPress}
      /> */}
     
            <View style={styles.Heading}>
            
           <Text style={styles.HeadText}>{nurseryAuditDetails.auditcriterion}</Text>
         </View>
        {failForScore?
           <Text style={{color:'red',marginLeft:20,padding:5}}>{failForScore}</Text>
           :null
       }
       <ScrollView>
       <View style={styles.containerView}>
         {detForEdit?.map((fQuestion, i) => {

          const maxscore=filteredQuestions.map(k=>k.maxscore)
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
                   value={' maxscore  ' + maxscore[i]}
                   containerStyle={styles.badgeView}
                   textStyle={{ fontSize: 15 ,color:'white',fontWeight:'500'}}
                   badgeStyle={{ backgroundColor: '#088F8F' }}
                 />
                 <TextInput
                   style={styles.scoreInput}
                   placeholder="score"
                  onChangeText={(score) => handleFieldChange(i, 'maxscore', score,maxscore[i])}

                   value={scores[i] ||`${fQuestion.maxscore}`} // use the score for the corresponding question
                   keyboardType={"number-pad"}
                   inputMode={"numeric"}
                 />
                 <TextInput
                   style={[styles.userView, { width: 275 }]}
                   placeholder="comment"
                   onChangeText={(comment) => handleFieldChange(i, 'comment', comment)}
                   value={comments[i] || fQuestion.comment} // use the comment for the corresponding question
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
             title="Update"
             type="solid"
             containerStyle={{
               marginHorizontal: 30,
               marginVertical: 10,
             }}
             onPress={() => handleUpdate()}
           />
       
   
           {/* <Button title='check' onPress={onPress}/> */}
         </View>
        
       </View>
       </ScrollView>
     
       </>
     );
  }
   
  

  return (
    <>
  {/* <Button
  title='know'
  onPress={()=>
  {
    console.log(data)
  }}
  />   */}
  
   
    {/* <Button
    onPress={()=>
    {
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
          console.log('Empty')
         }
         else
         {
          console.log('non-empty')
         }
        })
    }}
    title='check'
    /> */}
   {/* <Button
   title='delete'
 
   onPress={()=>
  {
    db.transaction(tx => {
      tx.executeSql(
        'DROP TABLE IF EXISTS NurseryAuditAnswers',
        [],
        (_, result) => {
          console.log('Table deleted');
        },
        (_, error) => {
          console.log('Error deleting table:', error);
        }
      );
    });
    
  }}
   /> */}
         <View style={styles.Heading}>
         
        <Text style={styles.HeadText}>{nurseryAuditDetails.auditcriterion}</Text>
      </View>
     {failForScore?
        <Text style={{color:'red',marginLeft:20,padding:5}}>{failForScore}</Text>
        :null
    }
    <ScrollView>
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
                textStyle={{ fontSize: 12 ,color:'white',fontWeight:'500'}}
                badgeStyle={{ backgroundColor: '#088F8F' }}
              />
              <TextInput
                style={styles.scoreInput}
                placeholder="score"
                onChangeText={(score) =>
                  {
                    setScore(score);
                  handleScoreChange(i, score.replace(/[^0-9]/g,""),fQuestion.maxscore)
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
                  handleData(i,score,comment,fQuestion.question)
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
    

        {/* <Button title='check' onPress={onPress}/> */}
      </View>
     
    </View>
    </ScrollView>
  
    </>
  );
};

export default NurseryAuditDetailsPage;
