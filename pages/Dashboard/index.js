import React,
{
  useState,
  useEffect,
  useCallback
} from 'react';
import { 
  View, 
  Text,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import styles from './style';
import * as SQLite from 'expo-sqlite';
import { useFocusEffect } from '@react-navigation/native';
import DashboardNurseryAuditList from '../../components/DashboardNurseryAuditList';
import { Button } from '@rneui/base';



const db=SQLite.openDatabase('mydb.Nursery');
const Dashboard = ({navigation}) => 
{

  const [nurAudCheck,setNurAudCheck]=useState(false);
  const [nurObser,setNurObser]=useState('');
  const [corrective,setCorrective]=useState('');

  const [nurObserData,setNurObserData]=useState([]);
  const [correctiveData,setCorrectiveData]=useState([]);


  const [nurAudAns,setNurAudAns]=useState([]);
  const [nurAudDet,setNurAudDet]=useState([]);
  const [nurAudEntry,setNurAudEntry]=useState([]);

  const [dots, setDots] = useState('');

  const[loading,setLoading]=useState([]);



  useEffect(()=>
  {
    Table('NurseryAuditAnswers');
    Table('CorrectiveAction');
    Table('NurseryObservation'); 
    Table('NurseryAuditEntryDetails');
    getDetails();
    setTimeout(()=>
    {
      getDetails();
      setLoading(false);
    },1000)
    const interval = setInterval(() => {
      setDots((prevDots) => {
        if (prevDots.length === 5) {
          return '';
        } else {
          return prevDots + '.';
        }
      });
    }, 500);
    return () => clearInterval(interval);

  },[])

  useFocusEffect(
    React.useCallback(() => {
      // setLoading(true);
      // Your code to refresh the screen goes here
      Table('NurseryAuditAnswers');
      Table('CorrectiveAction');
      Table('NurseryObservation');
      Table('NurseryAuditEntryDetails')
      getDetails();
      setTimeout(()=>
      {
        getDetails();
        // setLoading(false);
      },1000)
      return () => {
        console.log('Screen is unfocused');
      };
    }, [])
  );

  const Table=(tableName)=>
  {
    const isTableEmpty = () => {
      return new Promise((resolve, reject) => {
        db.transaction((tx) => {
          tx.executeSql(
            'SELECT COUNT(*) as count FROM '+tableName+'',
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
    if(!empty)
    {
      if(tableName=='NurseryAuditAnswers')
      {
        setNurAudCheck(true)
      }
      if(tableName=='CorrectiveAction')
      {
        setCorrective('Not-Empty')
      }
      if(tableName=='NurseryObservation')
      {
        setNurObser('Not-Empty')
      }
     
     
    }
  })
  .catch((error) => {
    console.log('Error:', error);
  });
  }

const getDetails=()=>
{
  db.transaction(tx=>
    { 
        tx.executeSql(
            'SELECT * FROM NurseryAuditDetails',
            [],
            (_, { rows }) => {
              setNurAudDet(rows._array);
    })
    tx.executeSql('SELECT * FROM NurseryAuditAnswers',
    [],
    (_,{ rows }) => {
      setNurAudAns(rows._array)
    }
    )
    tx.executeSql('SELECT * FROM NurseryAuditEntryDetails',
    [],
    (_,{ rows }) => {
      setNurAudEntry(rows._array)
    }
    )
    tx.executeSql('SELECT * FROM NurseryObservation',
    [],
    (_,{ rows }) => {
      setNurObserData(rows._array)
    }
    )
    tx.executeSql('SELECT * FROM CorrectiveAction',
    [],
    (_,{ rows }) => {
      setCorrectiveData(rows._array)
    }
    )
})     
}

  const onPress=()=>
 {
  // db.transaction(tx=>
  //   {
  //     tx.executeSql('SELECT * FROM NurseryAuditAnswers',
  //     [],
  //     (tx,result)=>
  //     {
  //       for(let i=0;i<result.rows.length;i++)
  //       {
  //         const {auditcriterionid,question,maxscore,comment}=result.rows.item(i);
  //         console.log(`auditcriterionid:${auditcriterionid},question:${question},maxscore:${maxscore},comment:${comment}`);
  //       }
  //     }
  //     )
  //   })

    db.transaction(tx=>
      { 
          tx.executeSql(
              'SELECT * FROM NurseryAuditDetails',
              [],
              (_, { rows }) => {
                console.log(rows._array);
      })
  })     
  
 }

 

   if(loading)
  {
    return(
      <View style={styles.Indicator}>
      <View style={styles.containerForLoad}>
      <Text style={styles.textForLoad}>Loading</Text>
      <View style={{width:'10%'}}>
      <Text style={styles.dots}>{dots}</Text>
      </View>
      </View>
    </View>
    )
  }

  return (
    <ScrollView style={{backgroundColor:'rgba(198, 227, 228,0.5)'}}>
  
    <View style={styles.container}>
  
      <View style={styles.content}>
        <View style={styles.infoBlock}>
          <Text style={styles.infoBlockHeading}>Nursery Audit List</Text>
          {nurAudAns.length >0 ?
          <DashboardNurseryAuditList nurAudEntry={nurAudEntry} nurAudDet={nurAudDet} nurAudAns={nurAudAns} navigation={navigation} nurObserData={nurObserData} correctiveData={correctiveData}/>
          :
          <Text style={{fontWeight:'bold',color:'#ebbf31'}}>Data Not Found</Text>
              }
        </View>





        {/* <View style={styles.infoBlock}>
          <Text style={styles.infoBlockHeading}>Nursery Observations</Text>
         
          {
            nurObser ?  <Text style={styles.successText}>Success</Text>: <Text style={styles.pendingText}>Pending</Text>
          }
        </View> */}
        {/* <View style={styles.infoBlock}>
          <Text style={styles.infoBlockHeading}>Corrective Action</Text>
         
          {
            corrective ?  <Text style={styles.successText}>Success</Text>: <Text style={styles.pendingText}>Pending</Text>
          }
         
        </View> */}
    
      </View>

         </View>
         </ScrollView>
  );
};





export default Dashboard;
