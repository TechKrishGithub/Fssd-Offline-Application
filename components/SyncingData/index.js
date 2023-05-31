import React from 'react'
import { Text,View,TouchableOpacity } from 'react-native';
import styles from './style';

const SyncingData=(props)=> {
    const {
        nursery,
        nurAudEntry,
        nurAudDet,
        nurAudAns,
        nurObserData,
        correctiveData
    }=props;

    const syncData=()=>
    {
        console.log(nursery);
        const filteredNurseryAuditEntry = nurAudEntry.filter(obj => obj.nursery === nursery);
        const filteredNurseryAuditAnswers=nurAudAns.filter(obj=>obj.nursery===nursery);

        const newAnswersAfterRemovingNursery = filteredNurseryAuditAnswers.map(obj => {
            if (obj.nursery === nursery) {
              const { nursery,id, ...rest } = obj;
              return rest;
            }
            return obj;
          });

        const filteredObservations=nurObserData.filter(obj=>obj.Nusery===nursery);
        const newObservationsAfterRemovingNursery = filteredObservations.map(obj => {
            if (obj.Nusery === nursery) {
              const { Nusery,id, ...rest } = obj;
              return rest;
            }
            return obj;
          });
        const filteredCorrectiveActions=correctiveData.filter(obj=>obj.Nursery===nursery);

        const newCorrectiveActionsAfterRemovingNursery = filteredCorrectiveActions.map(obj => {
            if (obj.Nursery === nursery) {
              const { Nursery,id, ...rest } = obj;
              return rest;
            }
            return obj;
          });



        //   fetch(api, {
        //   method: 'POST ',
        //   headers: {
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify({
        //     NurseryEntryDetails:filteredNurseryAuditEntry,
        //     NurseryAnswersDetails:newAnswersAfterRemovingNursery,
        //     NurseryObservation:newObservationsAfterRemovingNursery,
        //     CorrectiveAction:newCorrectiveActionsAfterRemovingNursery                    
        //   })
        // })
        //   .then(response => response.json()).
        //   then(responseData=>JSON.parse(responseData))                   
        //   .then(data=>console.log(data))



        console.log('nurseryAuditEntryDetails:',filteredNurseryAuditEntry)
        console.log('nurseryAuditAnswers:',newAnswersAfterRemovingNursery);
        console.log('nurseryObservationData:',newObservationsAfterRemovingNursery);
        console.log('correctiveActionData:',newCorrectiveActionsAfterRemovingNursery);

    }

    return (
     
       <TouchableOpacity  onPress={syncData}
       style={{justifyContent:'center',alignItems:'center'}}
       >
         <View style={[styles.buttonContainerDetails]}>
            <Text style={styles.buttonTextDetails}>sync</Text>
         </View>
     </TouchableOpacity>
      
    )
}

export default SyncingData;


