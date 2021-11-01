import React, { useEffect, useState } from 'react';
import { View, BackHandler, StyleSheet, Image, Text, Platform, Dimensions, ImageBackground, TouchableOpacity, ScrollView, TextInput } from 'react-native';
//import FontAwesome5Brands from 'react-native-vector-icons/FontAwesome5Brands';
import { BASE_URL } from '../../api';

export function Signup({ navigation }) {

    useEffect(() => {
        setTimeout(() => {
            navigation.navigate('Signin')
            // navigation.navigate('Live')
        }, 2000);
    }, []);


    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");


    const signup = () => {

        console.log('fname', fname)
        console.log('lname', lname)
        console.log('email', email)
        console.log('phone', phone)
        console.log('password', password)

        var formdata = new FormData();
        formdata.append("firstName", fname);
        formdata.append("lastName", lname);
        formdata.append("email", email);
        formdata.append("phone", phone);
        formdata.append("password", password);

        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };
        // http://192.249.119.102:3000/
        fetch("http://192.249.119.102:3000/user/register", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result)
                if (result.status == 200) {
                    alert(result.msg)
                    navigation.navigate('Signin')
                }
                else {
                    alert(result.msg)
                }
            })
            .catch(error => console.log('error', error));
    }

    return (
        <View>
            <ScrollView>
                <ImageBackground source={require('../../../assets/images/128171.png')} style={{ height: Dimensions.get('window').height, width: Dimensions.get('window').width, }} />
                <View style={{ position: 'absolute', top: 30, left: 90, right: 90 }}>
                    <Image source={require('../../../assets/images/newlogo.png')} style={{ height: Dimensions.get('window').height / 5, width: Dimensions.get('window').width / 2 }} />
                </View>

                <View style={{
                    position: 'absolute',
                    top: Dimensions.get('window').height / 4, alignItems: 'center', justifyContent: 'center', marginLeft: 15, marginRight: 15
                }}>
                    <TextInput
                        placeholder="First name"
                        style={styles.textinputview}
                        onChangeText={(text) => setFname(text)}
                    />
                    <TextInput
                        placeholder="Last name"
                        style={styles.textinputview}
                        onChangeText={(text) => setLname(text)}
                    />
                    <TextInput
                        placeholder="Email"
                        style={styles.textinputview}
                        onChangeText={(text) => setEmail(text)}
                    />
                    <TextInput
                        placeholder="Phone"
                        maxLength={10}
                        style={styles.textinputview}
                        onChangeText={(text) => setPhone(text)}
                    />
                    <TextInput
                        placeholder="Password"
                        style={styles.textinputview}
                        onChangeText={(text) => setPassword(text)}
                    />
                </View>

                <View style={{ height: 40, width: Dimensions.get('window').width - 140, position: 'absolute', top: Dimensions.get('window').height / 2 + 130, left: 70, right: 70, backgroundColor: '#ffffff', borderRadius: 15, justifyContent: 'center', alignItems: 'center', }}>
                    <TouchableOpacity
                        onPress={() => signup()}
                    >
                        <Text style={{ fontFamily: 'Raleway', fontSize: 20, fontWeight: '600', color: '#202020' }}>
                            Signup
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* <View style={{height:90,width:Dimensions.get('window').width-100,alignItems:'center',position:'absolute',top:Dimensions.get('window').height/2+100,left:50,right:50}}>
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
            </View> */}


                {/* <View style={{height:60,width:Dimensions.get('window').width-140,position:'absolute',top:Dimensions.get('window').height/2+200,left:70,right:70,backgroundColor:'#ffffff',borderRadius:26,justifyContent:'center'}}>
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
            </View> */}

                <View style={{ height: 50, width: Dimensions.get('window').width - 100, alignItems: 'center', position: 'absolute', top: Dimensions.get('window').height - 50, left: 50, right: 50, bottom: 20 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.signuptext}>
                            Already have an account?{' '}
                        </Text>
                        <TouchableOpacity>
                            <Text style={styles.signuptext}>
                                Login
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* <View style={{height:60,width:Dimensions.get('window').width,position:'absolute',bottom:20,justifyContent:'center',alignItems:'center',}}>
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
            </View> */}
            </ScrollView>
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
    },
    textinputview: {
        height: 40,
        width: Dimensions.get('window').width - 30,
        backgroundColor: '#ffffff',
        fontSize: 16,
        fontFamily: 'Raleway',
        fontWeight: '600',
        color: '#202020',
        borderRadius: 15,
        paddingLeft: 10,
        marginTop: 15,
    },
})