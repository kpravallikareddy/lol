import React, { useEffect,useState } from 'react';
import {View,BackHandler, Image,Text,Platform,Dimensions,Modal} from 'react-native';

export function Splash1({navigation}) {

    useEffect(() =>{

        setTimeout(() => {
            //     navigation.navigate('Splash')
            setShowlogo(true)
             }, 2000);
             
        setTimeout(() => {
            setShowlogo(false)
            navigation.navigate('Login')
        }, 5000);
        

    },[]);

    const [showlogo,setShowlogo] = useState(false)

    return (
        <View>
            <Image source={require('../../../assets/images/splash1.png')} style={{height:Dimensions.get('window').height,width:Dimensions.get('window').width,}}/>
            <Modal
            animationType="slide"
            transparent={true}
            //onRequestClose={() => }
            visible={showlogo}
            >
            <View style={{position:'absolute',top:Dimensions.get('window').height/3,alignSelf:'center'}}>
                <Image source={require('../../../assets/images/newlogo.png')}  style={{height:Dimensions.get('window').height/6,width:Dimensions.get('window').width/3-7}}/>
            </View>
           
            </Modal>
            <View style={{position:'absolute',top:Dimensions.get('window').height-50,alignSelf:'center',}}>
                <View style={{height:5,width:Dimensions.get('window').width/2+50,backgroundColor:'#ffffff',borderRadius:6}}>

                </View>
               
            </View>
        
        </View>
    )
}

// export default Splash;