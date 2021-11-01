import React, { useEffect, useState } from 'react';
import { View, BackHandler, StyleSheet, Image, Text, Platform, Dimensions, ImageBackground, TouchableOpacity, ScrollView, TextInput } from 'react-native';
//import FontAwesome5Brands from 'react-native-vector-icons/FontAwesome5Brands';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BASE_URL } from '../../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RnSmsRetriever from "rn-sms-retriever";
import GetLocation from 'react-native-get-location';
import { LoginButton, AccessToken, LoginManager,GraphRequest,
    GraphRequestManager, } from 'react-native-fbsdk';
  import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
  } from '@react-native-google-signin/google-signin';
import { NavigationContainer } from '@react-navigation/native';

export function Otp({ navigation }) {

    const [phonenumber, setPhonenumber] = useState('');
    const [otp, setOtp] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [fname, setFname]=useState('');
  const [lname, setLname]=useState('');
  const [email, setEmail]=useState('abc@gmail.com');
  const [image, setImage]=useState('');
  const [fbid, setFbid] = useState('');
  const [phone, setPhone] =useState('');
  const [fbloginclicked, setFbloginclicked] = useState(false);

    // useEffect(() => {
    //     // setTimeout(() => {
    //     //     //navigation.navigate('Signup')
    //     //      navigation.navigate('Live')
    //     // }, 2000);
        

    //     GetLocation.getCurrentPosition({
    //         enableHighAccuracy: true,
    //         timeout: 15000,
    //     })
    //     .then(location => {
    //         console.log(location);
    //         setLatitude(location.latitude)
    //         setLongitude(location.longitude)
    //     })
    //     .catch(error => {
    //         const { code, message } = error;
    //         console.warn(code, message);
    //     });

    //     innerAsync();
    // }, []);

    useEffect(() => {

        // setTimeout(() => {
        //     //navigation.navigate('Signup')
        //      navigation.navigate('Live')
        // }, 1000);
    
        GetLocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 15000,
      })
      .then(location => {
          console.log(location);
          setLatitude(location.latitude)
          setLongitude(location.longitude)
      })
      .catch(error => {
          const { code, message } = error;
          console.warn(code, message);
      });
    
        GoogleSignin.configure({
         // webClientId: '912516559460-jgnma7drgift5ecterq49se0ac3be038.apps.googleusercontent.com',
         // webClientId:'714007657988-a8b4n2gpnmci9bp94gr51vlo2ess4sua.apps.googleusercontent.com',
          webClientId:'714007657988-a8b4n2gpnmci9bp94gr51vlo2ess4sua.apps.googleusercontent.com',
          offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
          forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
          iosClientId: '', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
        });
      }, []);

      const onLoginFinished = () => {
        console.log('inside login---');
        (error, result) => {
          if (error) {
            console.log("login has error: " + result.error);
          } else if (result.isCancelled) {
            console.log("login is cancelled.");
          } else {
            AccessToken.getCurrentAccessToken().then(
              (data) => {
                console.log(data.accessToken.toString())
              }
            )
          }
        }
      }

      const signIn = async () => {
        try {
          await GoogleSignin.hasPlayServices();
          const userInfo = await GoogleSignin.signIn();
          console.log('userinfo-----', userInfo);
          //navigation.navigate('Live')
          //this.setState({ userInfo });
        } catch (error) {
          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            // user cancelled the login flow
            console.log('error code1 ----', error);
          } else if (error.code === statusCodes.IN_PROGRESS) {
            // operation (e.g. sign in) is in progress already
            console.log('error code2 ----', error);
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            // play services not available or outdated
            console.log('error code3 ----', error);
          } else {
            // some other error happened
            console.log('error code4 ----', error);
          }
        }
      };
    
      const onLogoutFinished = () => {
        console.log("logout.")
      }

      const renderfblogin = () => {
        setFbloginclicked(true);
        console.log('fblogin');
    
        LoginManager.logInWithPermissions(["public_profile"]).then(
          function (result) {
            if (result.isCancelled) {
              console.log("Login cancelled");
            } else {
              console.log(
                "Login success with permissions: " +
                result.grantedPermissions.toString()
              );
              // navigation.navigate('Live')
              AccessToken.getCurrentAccessToken().then((data) => {
                const { accessToken } = data
                initUser(accessToken)
              })
            }
          },
          function (error) {
            console.log("Login fail with error: " + error);
            alert(error);
          }
        );
      }

      const initUser=(token)=> {
        // fetch('https://graph.facebook.com/v2.5/me?fields=email,name,friends&access_token=' + token)
        // .then((response) => response.json())
        // .then((json) => {
        //   console.log('fb response ----',json)
          // Some user object has been set up somewhere, build that user here
          // user.name = json.name
          // user.id = json.id
          // user.user_friends = json.friends
          // user.email = json.email
          // user.username = json.name
          // user.loading = false
          // user.loggedIn = true
          // user.avatar = setAvatar(json.id)      
        // })
        // .catch(() => {
        //   reject('ERROR GETTING DATA FROM FACEBOOK')
        // })
    
        const PROFILE_REQUEST_PARAMS = {
          fields: {
            string: 'id,first_name,last_name,email,friends,picture',
          },
        };
        const profileRequest = new GraphRequest(
          '/me',
          {token, parameters: PROFILE_REQUEST_PARAMS},
          (error, user) => {
            if (error) {
              console.log('login info has error: ' + error);
            } else {
              //this.setState({userInfo: user});
              console.log('result:', user);
              setFname(user.first_name);
              setLname(user.last_name);
              setEmail(user.email);
              setFbid(user.id);
              setImage(user.picture.data.url);
    
              //signup();
              verifyuserid();
            }
          },
        );
        new GraphRequestManager().addRequest(profileRequest).start();
      }

      const verifyuserid =async () =>{
        console.log('inside verifyuserid')
        await AsyncStorage.getItem('userid').then((userid) => {
          if (userid) {
            console.log('inside if')
              //this.setState({ userid: JSON.parse(userid) });
             // verifyOtp();
             verifyOtpforfb();
    
          }
          else {
             // console.log('no userid')
              console.log('inside else')
              signup();
          }
      });
      }
    
      const signup =() =>{
        console.log('inside signup');
        var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    var raw = JSON.stringify({
      "first_name":fname,
      "last_name":lname,
      "email":"-1",     //'email@gmail.com',
      "phone":"-1",
      "pin_code":"",
      "password":"",
      "image":image,
      "balance":"0",
      "status":"0",
      "reset_key":"0",
      "ThirdPartyloginid":fbid,
      //"created":"",
      //"updated":"",
      //"Gender":"",
      //"LastLogin":null,
      "OnLineStats":null,
      "RegisterBy":"M"
    });
    
    console.log('input params ---signup',raw);
    
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    
    fetch(BASE_URL+"user/register", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result)
        if(result.status == 200){
          AsyncStorage.setItem('userid',JSON.stringify(result.data.id));
          verifyOtp();
          //navigation.navigate('Live')
        }
      })
      .catch(error => console.log('error', error));
      }

      async function onGoogleButtonPress() {
        // Get the users ID token
        const { idToken } = await GoogleSignin.signIn();
    
        // Create a Google credential with the token
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    
        // Sign-in the user with the credential
        return auth().signInWithCredential(googleCredential);
      }
    
      const verifyOtpforfb =() => {
       //console.log('otp',text);
        var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    var raw = JSON.stringify({
      "phone":"-1",
      "code":"1111",
      "loginBy":"F",
      "email":"-1",
      "loginDevice":"Max",
      "QueryType":"login",
      "temp":"//for mail- g facebook-f ,Mobile-M",
      "ThirdPartyloginid":fbid,
      "Latitude":latitude,
      "longditute":longitude,
      "country": "India", 
      "language": "Eng" 
    });
    
    console.log('input params-----',raw);
    
    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };
    
    fetch(BASE_URL+"user/loginUserByPhone", requestOptions)
    .then(response => response.json())
    .then(result => {
      console.log(result)
      setFbloginclicked(false);
      if(result.status == 200){
       // alert(result.msg)
          console.log('user id -- ',result.data.id)
          AsyncStorage.setItem('userid',JSON.stringify(result.data.id));
       
          navigation.navigate('Live');
          //navigation.navigate('Profile')
      }
      else {
       // console.log('phone', text)
       alert(result.msg)
    }
    })
    .catch(error => console.log('error', error));
    }

    const postPhonenumber = async (text) => {
        //console.log('text', text);
        setPhonenumber(text);
        //  console.log('phonenumber',phonenumber);

        if (text.length == 10) {
            //setPhonenumber(text);
           // await console.log('phonenumber -inside if', text);
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({ "phone": text });
            // var raw = JSON.stringify({
            //     "phone":"8802641294",
            //     "code":"1111",
            //     "loginBy":"G",
            //     "email":"0",
            //     "loginDevice":"Max",
            //     "QueryType":"login","temp":"//for mail- g facebook-f ,Mobile-M"
            // });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch(BASE_URL+"user/loginUserByPhone", requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log(result)
                   // console.log(result.data.code)
                   if(result.status == 200){
                    //setOtp(result.data.code)
                    //alert(result.msg)
                   }
                   else {
                       alert(result.msg)
                   }

                })
                .catch(error => console.log('error', error));
        }
        else {
            console.log('phone', text)
        }
    }

    const innerAsync = async() => {
        // get list of available phone numbers
        const selectedPhone = await RnSmsRetriever.requestPhoneNumber();
        console.log('Selected Phone is : ' + selectedPhone);
        let phone = selectedPhone.toString();
          let num = phone.slice(3);
          console.log('phonenumber', num)
          setPhonenumber(num);
          //this.setState({phonenumber:num})
        // get App Hash
        // const hash = await RnSmsRetriever.getAppHash();
        // console.log('Your App Hash is : ' + hash);
        // // set Up SMS Listener;
        // smsListener = DeviceEventEmitter.addListener(RnSmsRetriever.SMS_EVENT, (data: any) => {
        //   console.log(data, 'SMS value');
        // });
        // start Retriever;
        //await RnSmsRetriever.startSmsRetriever();
      }

    const verifyOtp =() => {

        console.log('otp',otp);
        if(otp.length == 4 && otp == 1111){
        var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
    "phone":phonenumber,
    "code":otp,
    "loginBy":"M",
    "email":"-1",
    "loginDevice":"Max",
    "QueryType":"login",
    "temp":"//for mail- g facebook-f ,Mobile-M",
    "ThirdPartyloginid":"-1",
    "Latitude":latitude,
    "longditute":longitude,
    "country": "India", 
    "language": "Eng" 
});

console.log('input',raw);

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch(BASE_URL+"user/loginUserByPhone", requestOptions)
  .then(response => response.json())
  .then(result => {
      console.log('login result----',result)
      if(result.status == 200){
          
          alert(result.msg)
          console.log('user id -- ',result.data.id)
          AsyncStorage.setItem('userid',JSON.stringify(result.data.id));
          navigation.navigate('Live')
          //navigation.navigate('Profile')
      }
      else {
        console.log('phone', phonenumber)
        alert(result.msg)
    }
})
  .catch(error => console.log('error', error));
}
else{
  alert('Please enter valid otp')
}
    }


    return (
        <View style={{ flex: 1 }}>


            {/*<ImageBackground source={require('../../../assets/images/128171.png')} style={{height:Dimensions.get('window').height,width:Dimensions.get('window').width,}}/>
            <View style={{position:'absolute',top:Dimensions.get('window').height/7,left:90,right:90}}>
                <Image source={require('../../../assets/images/lolgrp.png')}  style={{height:Dimensions.get('window').height/5,width:Dimensions.get('window').width/2}}/>
            </View>
            <View style={{height:100,width:Dimensions.get('window').width,alignItems:'center',position:'absolute',top:Dimensions.get('window').height/2-50,justifyContent:'center',}}>
                <Text style={{fontFamily:'Raleway',fontSize:40,color:'#ffffff',fontWeight:'900',textAlign:'center', }}>
                    Interact around
                </Text>
                <Text style={{fontFamily:'Raleway',fontSize:40,color:'#ffffff',fontWeight:'900',textAlign:'center',lineHeight:36 }}>
                    the world
                </Text> 
            </View>
            <View style={{height:90,width:Dimensions.get('window').width-100,alignItems:'center',position:'absolute',top:Dimensions.get('window').height/2+100,left:50,right:50}}>
                <View style={{flexDirection:'row'}}>
                <TouchableOpacity>
                    <Text style={styles.signuptext}>
                        Sign Up/
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style={styles.signuptext}>
                        Login
                    </Text>
                </TouchableOpacity>
                </View>
            </View>
            <View style={{height:60,width:Dimensions.get('window').width-140,position:'absolute',top:Dimensions.get('window').height/2+140,left:70,right:70,backgroundColor:'#ffffff',borderRadius:26,justifyContent:'center'}}>
                <View style={{flexDirection:'row',justifyContent:'space-around'}}>
                    <TouchableOpacity>
                    <Image source={require('../../../assets/images/google.png')}  style={{height:30,width:30}}/>
                    </TouchableOpacity>
                    <TouchableOpacity>
                    <Image source={require('../../../assets/images/fb.png')}  style={{height:30,width:30}}/>
                    
                    </TouchableOpacity>
                    <TouchableOpacity>
                    <Image source={require('../../../assets/images/phone.png')}  style={{height:30,width:30}}/>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{height:60,width:Dimensions.get('window').width,position:'absolute',bottom:20,justifyContent:'center',alignItems:'center',}}>
                <View style={{flexDirection:'row', flexWrap:'wrap'}}>
                <Text style={styles.signingup}>
                    By signing up you agree to our{' '}
                </Text>
                <TouchableOpacity>
                    <Text style={styles.terms}>Terms of Service{' '}</Text>

                </TouchableOpacity>
                <Text style={styles.terms}>
                    &
                </Text>
                <TouchableOpacity>
                    <Text style={styles.terms}> Privacy Policy</Text>
                </TouchableOpacity>
                </View>
    </View>*/}
            <View style={{ flex: 0.9 }}>
                <ScrollView>
                    <View style={{ flexDirection: 'row', marginTop: 20, marginLeft: 10, alignItems: 'center' }}>
                        <View>
                            <TouchableOpacity>
                                <FontAwesome5 name="arrow-left" size={20} color={'#202020'} style={{ marginRight: 10 }} />
                            </TouchableOpacity>
                        </View>
                        <View>
                            <Text style={{ fontFamily: 'Raleway', fontSize: 18, fontWeight: '600', color: '#202020' }}>
                                Login via verification code
                            </Text>
                        </View>
                    </View>

                    <View style={{ height: 50, width: Dimensions.get('window').width, marginTop: 30, justifyContent: 'center', }}>
                        <View style={{ flexDirection: 'row', marginLeft: 20, alignItems: 'center', borderBottomColor: '#DDDDDD', borderBottomWidth: 1, marginRight: 20 }}>
                            <View>
                                <Entypo name="mobile" size={25} color={'#DDDDDD'} style={{ marginRight: 5 }} />
                            </View>
                            <View>

                            </View>
                            <View>
                                <Text style={{ fontSize: 22, fontWeight: 'bold' }}>
                                    +91
                                </Text>
                            </View>
                            <View>
                                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center' }}>
                                    <Entypo name="triangle-down" size={15} />
                                </TouchableOpacity>
                            </View>
                            <View>
                                <TextInput
                                    placeholder="Phone Number"
                                    placeholderTextColor="#DDDDDD"
                                    value={phonenumber}
                                    maxLength={10}
                                    numeric
                                    keyboardType="numeric"
                                    returnKeyType="done"
                                    onChangeText={(text) => {setPhonenumber(text), postPhonenumber(text) }}
                                />
                            </View>
                        </View>
                    </View>

                    <View style={{ height: 50, width: Dimensions.get('window').width, marginTop: 30, justifyContent: 'center', }}>
                        <View style={{ flexDirection: 'row', marginLeft: 20, alignItems: 'center', borderBottomColor: '#DDDDDD', borderBottomWidth: 1, marginRight: 20, justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ marginRight: 10 }}>
                                    <Ionicons name="chatbubble-ellipses-outline" size={20} color={'#DDDDDD'} />
                                </View>
                                <View>
                                    <TextInput
                                        placeholder="Verification Code"
                                        placeholderTextColor="#DDDDDD"
                                        value={otp}
                                        style={{ fontWeight: 'bold', fontSize: 14, width: Dimensions.get('window').width / 2 }}
                                        onChangeText={(text) => {setOtp(text)}}  //verifyOtp(text)
                                    />
                                </View>
                            </View>
                            <View>
                                <TouchableOpacity
                                    style={{ height: 30, width: 100, borderWidth: 1, borderColor: '#DDDDDD', borderRadius: 20, alignItems: 'center', justifyContent: 'center' }}
                                >
                                    <Text style={{ fontFamily: 'Raleway', fontSize: 16, fontWeight: 'bold', color: '#DDDDDD' }}>
                                        Get Code
                                    </Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>

                    <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
                        <TouchableOpacity
                            style={{ height: 40, width: Dimensions.get('window').width - 40, borderRadius: 20, backgroundColor: '#f5deb3', alignItems: 'center', justifyContent: 'center' }}
                            onPress={()=>verifyOtp()}  //() =>navigation.navigate('Live')
                        >
                            <Text style={{ fontFamily: 'Raleway', fontSize: 18, fontWeight: 'bold', color: '#ffffff' }}>
                                LOGIN
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                        <View>
                            <Text style={{ fontFamily: 'Raleway', fontSize: 14, fontWeight: 'bold', color: '#DDDDDD' }}>
                                Any problems when login?
                            </Text>
                        </View>
                        <TouchableOpacity>
                            <Text style={{ fontFamily: 'Raleway', fontWeight: 'bold', fontSize: 14, color: '#ffd700', textDecorationLine: 'underline' }}>
                                Try another option
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>

            <View style={{ flex: 0.1, position: 'absolute', top: Dimensions.get('window').height - 100 }}>
                <View style={{ height: 70, width: Dimensions.get('window').width, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <View>
                            <Text>
                                ----------{' '}
                            </Text>
                        </View>
                        <View>
                            <Text>
                                Other login options{' '}
                            </Text>
                        </View>
                        <View>
                            <Text>
                                ----------
                            </Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                        <TouchableOpacity 
                        style={{ marginRight: 20 }}
                        onPress={() =>renderfblogin()}
                        >
                            <Entypo name="facebook-with-circle" size={35} color={'#4267B2'} />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Image source={require('../../../assets/images/google.png')} style={{ height: 30, width: 30 }} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    signuptext: {
        fontFamily: 'Raleway',
        fontWeight: '800',
        fontSize: 22,
        textAlign: 'center',
        color: '#ffffff'
    },
    signingup: {
        fontFamily: 'Raleway',
        fontWeight: '600',
        fontSize: 12,
        textAlign: 'center',
        color: '#ffffff'
    },
    terms: {
        fontFamily: 'Raleway',
        fontWeight: '800',
        fontSize: 12,
        textAlign: 'center',
        color: '#ffffff'
    }
})