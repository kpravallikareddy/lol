import React, { useEffect } from 'react';
import {View,BackHandler, Image,Text,Platform,Dimensions} from 'react-native';

export function Splash({navigation}) {

    useEffect(() =>{
        // setTimeout(() => {
        //     navigation.navigate('Login')
        // }, 2000);

    },[]);

    return (
        <View>
            <Image source={require('../../../assets/images/splash.png')} style={{height:Dimensions.get('window').height,width:Dimensions.get('window').width,}}/>
        </View>
    )
}

// export default Splash;