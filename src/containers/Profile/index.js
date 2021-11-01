import React, { Component } from 'react';
import { View, BackHandler, Image, Text, Platform, Dimensions, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import { Icon } from 'react-native-gradient-icon';
import { BASE_URL } from '../../api';
var ImagePicker = require('react-native-image-picker');
import { Shadow } from 'react-native-neomorph-shadows';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default class Profile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            postsselected: true,
            draftsselected: false,
            livetabselected: false,
            exploretabselected: false,
            hometabselected: false,
            chattabselected: false,
            profiletabselected: true,
            unseenmessages: 0,
            userid: '',
            userid1: '',
            userdata: [],
            profileUri: '',
            profileimage: '',
            profilename: '',
            username:'',
            gender:'',
        }
    }

    async componentDidMount() {

        await AsyncStorage.getItem('userid').then((userid) => {
            if (userid) {
                this.setState({ userid: JSON.parse(userid) });
            }
            else {
                console.log('no userid')
            }
        });

        await this.getprofile();
        // setTimeout(() => {
        //     this.props.navigation.navigate('Chat')
        // }, 2000);

    }


    getnotifications = () => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch(BASE_URL + "notification/" + this.state.userid, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result)
                if (result.status == 200) {
                    this.setState({ unseenmessages: result.data.unseen })
                }
            })
            .catch(error => console.log('error', error));
    }

    launchCamera = async () => {

        let options = {
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
                title: 'App Camera Permission',
                message: 'App needs access to your camera ',
                // buttonNeutral: "Ask Me Later",
                // buttonNegative: "Cancel",
                // buttonPositive: "OK"
            },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            ImagePicker.launchCamera(options, (response) => {
                // console.log('Response = ', response);

                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.error) {
                    console.log('ImagePicker Error: ', response.error);
                } else if (response.customButton) {
                    console.log('User tapped custom button: ', response.customButton);
                    alert(response.customButton);
                } else {
                    // const source = { uri: response.uri };
                    // console.log('photo', JSON.stringify(response));
                    console.log('profileimage respose', response)
                    console.log('uri----', response.assets[0].uri)
                    this.setState({
                        // cameraClicked: true,

                        profileimage: response,
                        profileUri: response.assets[0].uri,
                        profilename: response.assets[0].fileName,

                    });

                    //console.log('photo uri',this.state.profileUri)
                }
            });
        }
    }

    getprofile =() =>{
        var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
    "querytype":"getProfile",
    "test":this.state.userid,
    "searchBy":1});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch(BASE_URL+"user/details/getProfile", requestOptions)
  .then(response => response.json())
  .then(result =>{
    console.log('userdetails-----', result)
                //this.state.userdata.length = 0;
                this.setState({ userdata: [] })
                if (result.status == 200) {
                    for (let i = 0; i < result.data.length; i++) {
                        this.state.userdata.push(result.data[i])
                    }
                    this.setState({ 
                        showloader: true,
                        username:result.data[0].first_name,
                         profileUri:result.data[0].img,
                         gender:result.data[0].Gender
                    })
                    console.log('userdata', this.state.userdata[0].first_name)
                }
                else {
                    alert(result.msg)
                }
  })
  .catch(error => console.log('error', error));
    }

    getprofile1 = () => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch(BASE_URL + "profile/personal/" + this.state.userid, requestOptions)
            .then(response => response.json())
            .then(result => {
                 console.log('user details -----',result)
                //this.state.userdata.length = 0;
                this.setState({userdata:[]})
                if (result.status == 200) {
                    for (let i = 0; i < result.data.length; i++) {
                        this.state.userdata.push(result.data[i])
                    }
                    this.setState({
                        username:result.data[0].first_name}
                        )
                    console.log('userdata', this.state.userdata[0].first_name)
                }
                else {
                    alert(result.msg)
                }
            })
            .catch(error => console.log('error', error));
    }

 

    renderfooter = () => {
        return (
            <View>
                <View style={{ height: 60, width: Dimensions.get('window').width, backgroundColor: 'rgba(255, 255, 255, 0.9)', justifyContent: 'center', }}>
                    <View style={{ flexDirection: 'row', marginLeft: 10, marginRight: 10, justifyContent: 'space-between', }}>
                        <View>
                            {this.state.livetabselected ?
                                <View>
                                    <TouchableOpacity
                                        onPress={() => this.props.navigation.navigate('Live')}
                                        style={{ height: 42, width: 42, alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        <LinearGradient
                                            start={{ x: 0, y: 0.5 }}
                                            end={{ x: 1, y: 0.5 }}
                                            colors={['#01007E', '#FD01FC',]}
                                            style={{ height: 3, width: 15, alignSelf: 'center', marginBottom: 5 }}
                                        >
                                        </LinearGradient>
                                        <Image source={require('../../../assets/images/mdi_party-popper.png')} style={{ height: 30, width: 30 }} />
                                    </TouchableOpacity>
                                </View>
                                :
                                <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate('Live')}
                                    style={{ height: 42, width: 42, alignItems: 'center', justifyContent: 'center' }}
                                >
                                    <Image source={require('../../../assets/images/mdi_party-popper1.png')} style={{ height: 30, width: 30 }} />
                                </TouchableOpacity>
                            }
                        </View>

                        <View>
                            {this.state.exploretabselected ?
                                <View>
                                    <TouchableOpacity
                                        onPress={() => this.props.navigation.navigate('Explore')}
                                        style={{ height: 42, width: 42, alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        <LinearGradient
                                            start={{ x: 0, y: 0.5 }}
                                            end={{ x: 1, y: 0.5 }}
                                            colors={['#01007E', '#FD01FC',]}
                                            style={{ height: 3, width: 15, alignSelf: 'center', marginBottom: 5 }}
                                        >
                                        </LinearGradient>
                                        <Image source={require('../../../assets/images/bx_bxs-planet1.png')} style={{ height: 30, width: 30 }} />
                                    </TouchableOpacity>
                                </View>
                                :
                                <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate('Explore')}
                                    style={{ height: 42, width: 42, alignItems: 'center', justifyContent: 'center' }}
                                >
                                    <Image source={require('../../../assets/images/bx_bxs-planet.png')} style={{ height: 30, width: 30 }} />
                                </TouchableOpacity>
                            }
                        </View>

                        <View>
                            {this.state.hometabselected ?
                                <View>
                                  <TouchableOpacity
                                    // style={{ height: 42, width: 42,borderRadius:21, alignItems: 'center', justifyContent: 'center',borderWidth:2,borderColor:'#FFF8F8' }}
                                    style={{ alignItems: 'center', justifyContent: 'center', marginTop: -20 }}
                                >
                                    <Shadow
                                        style={{
                                            shadowOffset: { width: 0, height: 10 },
                                            shadowOpacity: 0.3,
                                            shadowColor: "#FD01FC",
                                            shadowRadius: 5,
                                            borderRadius: 15,
                                            backgroundColor: 'transparent',
                                            //marginRight: 20,
                                            width: 45,
                                            height: 45,
                                        }}>
                                        <LinearGradient
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 0, y: 1 }}
                                            colors={['#FD01FC', '#01007E',]}
                                            // style={{ height: 3, width: 15, alignSelf: 'center', marginBottom: 5 }}
                                            style={{ height: 50, width: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#FFFFFF' }}
                                        >
                                            {/* <MaterialIcons name="home" size={25} color={'#ffffff'} /> */}
                                            <MaterialCommunityIcons name="plus" size={30} color={'#ffffff'} />
                                        </LinearGradient>
                                    </Shadow>
                                </TouchableOpacity>
                                </View>
                                :
                                <TouchableOpacity
                                    onPress={() => this.setState({ hometabselected: true })}
                                    style={{ height: 60, width: 60, alignItems: 'center', justifyContent: 'center', borderRadius: 30, borderColor: '#ffffff', borderWidth: 2, marginTop: -20, backgroundColor: '#000000' }}
                                >
                                    {/* <MaterialIcons name="home" size={30} color={'#ffffff'} /> */}
                                    <MaterialCommunityIcons name="plus" size={30} color={'#ffffff'} />
                                </TouchableOpacity>
                            }
                        </View>

                        <View>
                            {this.state.chattabselected ?
                                <View>
                                    <TouchableOpacity
                                        onPress={() => this.props.navigation.navigate('Chat')}
                                        style={{ height: 42, width: 42, alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        <LinearGradient
                                            start={{ x: 0, y: 0.5 }}
                                            end={{ x: 1, y: 0.5 }}
                                            colors={['#01007E', '#FD01FC',]}
                                            style={{ height: 3, width: 15, alignSelf: 'center', marginBottom: 5 }}
                                        >
                                        </LinearGradient>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Icon name="chatbubble-ellipses" size={30} type="ionicon"
                                                useAngle={true}
                                                angle={180}
                                                colors={[
                                                    { color: "#01007E", offset: "1", opacity: "1" },
                                                    { color: "#FD01FC", offset: "0", opacity: "1" },
                                                ]} />
                                            <View style={{ height: 16, width: 16, borderRadius: 8, backgroundColor: '#D8382B', borderColor: '#ffffff', borderWidth: 1, marginLeft: -10, marginTop: -3, alignItems: 'center', justifyContent: 'center' }}>
                                                <Text style={{ fontFamily: 'Raleway', fontWeight: '600', fontSize: 10, color: '#ffffff' }}>
                                                    {this.state.unseenmessages}
                                                </Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                :
                                <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate('Chat')}
                                    style={{ height: 42, width: 42, alignItems: 'center', justifyContent: 'center' }}
                                >
                                    <View style={{ flexDirection: 'row' }}>
                                        <Ionicons name="chatbubble-ellipses" size={30} />
                                        <View style={{ height: 16, width: 16, borderRadius: 8, backgroundColor: '#D8382B', borderColor: '#ffffff', borderWidth: 1, marginLeft: -10, marginTop: -3, alignItems: 'center', justifyContent: 'center' }}>
                                            <Text style={{ fontFamily: 'Raleway', fontWeight: '600', fontSize: 10, color: '#ffffff' }}>
                                                {this.state.unseenmessages}
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            }
                        </View>

                        <View>
                            {this.state.profiletabselected ?
                                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                    <TouchableOpacity
                                       // onPress={() => this.props.navigation.navigate('Profile')}
                                       onPress={() =>this.props.navigation.navigate('Menu')}
                                        style={{ height: 42, width: 42, alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        <LinearGradient
                                            start={{ x: 0, y: 0.5 }}
                                            end={{ x: 1, y: 0.5 }}
                                            colors={[ '#FD01FC','#01007E',]}
                                            style={{ height: 3, width: 15, alignSelf: 'center', marginBottom: 2 }}
                                        >
                                        </LinearGradient>
                                        <Shadow
                                            style={{
                                                shadowOffset: { width: -5, height: 5 },
                                                shadowOpacity: 0.2,
                                                shadowColor: "#01007E",
                                                shadowRadius: 10,
                                                borderRadius: 5,
                                                backgroundColor: 'transparent',
                                                //marginRight: 20,
                                                width: 30,
                                                height: 30,
                                            }}>
                                            <Icon name="person" size={35} type="material"
                                                useAngle={true}
                                                angle={270}
                                                start={{ x: 0, y: 0 }}
                                                end={{ x: 0, y: 1 }}
                                                colors={[
                                                    { color: "#01007E", offset: "1", opacity: "1" },
                                                    { color: "#FD01FC", offset: "0", opacity: "1" },
                                                ]} />
                                        </Shadow>
                                    </TouchableOpacity>
                                </View>
                                :
                                <TouchableOpacity
                                    //onPress={() => this.props.navigation.navigate('Profile')}
                                    onPress={() =>this.props.navigation.navigate('Menu')}
                                    style={{ height: 42, width: 42, alignItems: 'center', justifyContent: 'center' }}
                                >
                                    <MaterialIcons name="person" size={35} />
                                    {/* <Image source={require('../../../assets/images/mdi_party-popper1.png')} style={{ height: 30, width: 30 }} />   */}
                                </TouchableOpacity>
                            }
                        </View>
                    </View>
                </View>
            </View>
        )
    }


    renderuserdata =() =>{
        return(
            <View>
                    <View style={{ marginTop: -50, marginLeft: 20, zIndex: 1 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginRight: 20 }}>
                            <View style={styles.profileimage}>
                                {this.state.profileUri?
                                <Image
                                    //source={require('../../../assets/images/lolgrp.png')}
                                    source={{ uri: this.state.profileUri }}
                                    style={{ height: 90, width: 90, borderRadius: 45 }}
                                />
                                :
                                <Image
                                    source={require('../../../assets/images/newlogo.png')}
                                    //source={{ uri: this.state.profileUri }}
                                    style={{ height: 90, width: 90, borderRadius: 45 }}
                                />
                                }
                            </View>
                            <TouchableOpacity
                                style={{ height: 40, width: Dimensions.get('window').width / 4, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', borderRadius: 14, marginTop: 60 }}
                                onPress={()=>this.props.navigation.navigate('Addfriends')}
                            >
                                <Text style={styles.editprofile}>
                                    + Friends
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{ height: 40, width: Dimensions.get('window').width / 3 - 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', borderRadius: 14, marginTop: 60 }}
                            onPress={() =>this.props.navigation.navigate('Editprofile')}
                            >
                                <Text style={styles.editprofile}>
                                    Edit Profile
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ marginLeft: 20 }}>
                        <Text style={styles.friends}>
                            {this.state.username}
                            {/* Username */}
                             {/* {this.state.userdata[0].first_name} {this.state.userdata[0].last_name}  */}
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row', marginLeft: 15, marginTop: 20 }}>
                        <Shadow
                            style={{
                                shadowOffset: { width: 0, height: 5 },
                                shadowOpacity: 0.6,
                                shadowColor: "#D8382B",
                                shadowRadius: 5,
                                borderRadius: 15,
                                backgroundColor: 'transparent',
                                marginRight: 10,
                                width: 50,
                                height: 30,
                            }}>
                        <TouchableOpacity
                        style={{height: 30,width: 50,borderRadius: 15,backgroundColor: '#D8382B',alignItems: 'center',justifyContent: 'center',marginRight: 10}}
                        >
                        <Text style={styles.place}>
                        Lv 1
                        </Text>
                        </TouchableOpacity>
                        </Shadow>
                        <Shadow
                            style={{
                                shadowOffset: { width: 0, height: 5 },
                                shadowOpacity: 0.6,
                                shadowColor: "#01007E",
                                shadowRadius: 5,
                                borderRadius: 15,
                                backgroundColor: 'transparent',
                                marginRight: 10,
                                width: 50,
                                height: 30,
                            }}>
                        <TouchableOpacity
                        style={{height: 30,width: 50,borderRadius: 15,backgroundColor: '#01007E',alignItems: 'center',justifyContent: 'center',marginRight: 10}}
                        >
                        <View style={{flexDirection: 'row'}}>
                        <Ionicons name="male" size={15}  color={'#ffffff'} />
                        <Text style={styles.place}>
                        24
                        </Text>
                        </View>
                        </TouchableOpacity>
                        </Shadow>
                        <Shadow
                            style={{
                                shadowOffset: { width: 0, height: 5 },
                                shadowOpacity: 0.6,
                                shadowColor: "#34A853",
                                shadowRadius: 5,
                                borderRadius: 15,
                                backgroundColor: 'transparent',
                                marginRight: 10,
                                width: 96,
                                height: 30,
                            }}>
                        <TouchableOpacity
                        style={{height: 30,width: 96,borderRadius: 15,backgroundColor: '#34A853',alignItems: 'center',justifyContent: 'center'}}
                        >
                        <View style={{flexDirection: 'row'}}>
                        <MaterialIcons name="location-on" size={15}  color={'#ffffff'} />
                        <Text style={styles.place}>
                        New Delhi
                        </Text>
                        </View>
                        </TouchableOpacity>
                        </Shadow>
                    </View>
                    </View>
        )
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 0.9 }}>
                    <View style={styles.liveview}>
                        <Image
                            blurRadius={Platform.OS == 'ios' ? 10 : 5}
                            source={require('../../../assets/images/newlogo.png')}
                            style={styles.liveview}
                        />
                        <View style={{ position: 'absolute', top: 30, flexDirection: 'row', justifyContent: 'space-between', left: 20, right: 20 }}>
                            <TouchableOpacity
                            onPress={()=>this.props.navigation.goBack()}
                            >
                                <FontAwesome5 name="arrow-left" size={20} color={'#ffffff'} />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Entypo name="share" size={20} color={'#ffffff'} />
                            </TouchableOpacity>
                        </View>

                        <View style={{ position: 'absolute', top: 60, }}>
                            <TouchableOpacity
                                onPress={() => this.launchCamera()}
                            >
                                <FontAwesome5 name="camera" size={20} color={'#ffffff'} />
                            </TouchableOpacity>

                        </View>
                        <View style={{ position: 'absolute', top: 80, }}>
                            <Text style={styles.addcover}>
                                Add Cover
                            </Text>
                            <Text style={styles.addfancytext}>
                                Add fancy photo to attract more people
                            </Text>
                        </View>

                    </View>
                    <View>
                    {this.renderuserdata()}
                    </View>
                    <ScrollView>
                        <TouchableOpacity style={{ height: 54, width: Dimensions.get('window').width - 30, alignItems: 'center', justifyContent: 'center', borderRadius: 50, backgroundColor: '#ffffff', marginLeft: 15, marginRight: 15, marginTop: 15 }}>
                            <Text style={styles.pleasefilltext}>
                                Please fill in the information
                            </Text>
                        </TouchableOpacity>

                        <View style={{ flexDirection: 'row', marginLeft: 15, marginTop: 15 }}>
                            <TouchableOpacity
                                style={{ alignItems: 'center', justifyContent: 'center', marginRight: 20 }}
                                onPress={() => this.setState({ postsselected: !this.state.postsselected, draftsselected: false })}
                            >
                                {this.state.postsselected ?
                                    <View>
                                        <Text style={styles.postsselectedtext}>
                                            Posts
                                        </Text>
                                        <LinearGradient
                                            start={{ x: 0, y: 0.5 }}
                                            end={{ x: 1, y: 0.5 }}
                                            colors={['#01007E', '#FD01FC',]}
                                            style={{ height: 3, width: 15, }}
                                        >
                                        </LinearGradient>
                                    </View>
                                    :
                                    <Text style={styles.draftstext}>
                                        Posts
                                    </Text>
                                }

                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ alignItems: 'center', justifyContent: 'center', }}
                                //  onPress={() =>setLiveselected(false),setPartyselected(true)}
                                onPress={() => this.setState({ postsselected: !this.state.postsselected, draftsselected: true })}
                            >
                                {this.state.draftsselected ?
                                    <View>
                                        <Text style={styles.postsselectedtext}>
                                            Drafts
                                        </Text>
                                        <LinearGradient
                                            start={{ x: 0, y: 0.5 }}
                                            end={{ x: 1, y: 0.5 }}
                                            colors={['#01007E', '#FD01FC',]}
                                            style={{ height: 3, width: 15, }}
                                        >
                                        </LinearGradient>
                                    </View>
                                    :
                                    <Text style={styles.draftstext}>
                                        Drafts
                                    </Text>
                                }
                            </TouchableOpacity>
                        </View>
                        {this.state.postsselected ?

                            <View style={{ flexDirection: 'row', marginLeft: 10, marginRight: 10, justifyContent: 'space-between', marginTop: 15 }}>
                                <View style={styles.liveimageview}>
                                    <Image source={require('../../../assets/images/newlogo.png')} style={styles.image} />
                                    <Text style={styles.title}>Title Username</Text>
                                </View>

                                <View style={styles.liveimageview}>
                                    <Image source={require('../../../assets/images/newlogo.png')} style={styles.image} />
                                    <Text style={styles.title}>Title Username</Text>
                                </View>
                            </View>
                            :
                            null
                            // <View style={{marginTop:15}}>

                            //     <View style={{marginTop:0}}>
                            //         {this.renderpartyroom()}
                            //     </View>
                            // </View>
                        }
                    </ScrollView>
                </View>

                <View style={{ flex: 0.1, position: 'absolute', bottom: 0, left: 0, }}>
                    {this.renderfooter()}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    liveview: {
        height: 200,
        width: Dimensions.get('window').width,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    addcover: {
        fontFamily: 'Raleway',
        fontWeight: 'bold',
        fontSize: 18,
        color: '#ffffff',
        textAlign: 'center'
    },
    addfancytext: {
        fontFamily: 'Raleway',
        fontWeight: '500',
        fontSize: 16,
        color: '#ffffff',
        textAlign: 'center'
    },
    profileimage: {
        height: 100,
        width: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: '#ffffff',
    },
    friends: {
        fontFamily: 'Raleway',
        fontWeight: 'bold',
        fontSize: 16,
        color: '#202020',
        paddingLeft:15,
        //alignSelf:'center'
    },
    editprofile: {
        fontFamily: 'Raleway',
        fontWeight: 'bold',
        fontSize: 16,
        color: '#202020',
        //paddingLeft:15,
        //alignSelf:'center'
    },
    place: {
        fontFamily: 'Raleway',
        fontWeight: '600',
        fontSize: 12,
        color: '#ffffff'
    },
    pleasefilltext: {
        fontFamily: 'Raleway',
        fontWeight: '600',
        fontSize: 18,
        color: '#202020'
    },
    postsselectedtext: {
        fontFamily: 'Raleway',
        fontWeight: 'bold',
        fontSize: 18,
        color: '#202020'
    },
    draftstext: {
        fontFamily: 'Raleway',
        fontWeight: '600',
        fontSize: 16,
        color: '#999999'
    },
    liveimageview: {
        width: Dimensions.get('window').width / 2 - 20,
        height: 180,
        borderRadius: 24,
        backgroundColor: '#ffffff'
    },
    image: {
        height: 128,
        width: Dimensions.get('window').width / 2 - 30,
        borderRadius: 24,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5,
    },
    title: {
        fontFamily: 'Raleway',
        fontWeight: '700',
        fontSize: 16,
        color: '#202020',
        textAlign: 'center',
        marginTop: 10
    },
    partyrecommend: {
        fontFamily: 'Raleway',
        fontWeight: '700',
        fontSize: 16,
        color: '#ffffff'
    },
    games: {
        fontFamily: 'Raleway',
        fontWeight: '700',
        fontSize: 16,
        color: '#4D4D4D'
    },
    partyroomtext: {
        fontFamily: 'Raleway',
        fontWeight: '800',
        fontSize: 16,
        color: '#ffffff'
    },
    trendingtext: {
        fontFamily: 'Raleway',
        fontWeight: '500',
        fontSize: 12,
        color: '#ffffff'
    },
    numtext: {
        fontFamily: 'Raleway',
        fontWeight: '600',
        fontSize: 12,
        color: '#ffffff'
    },
    pickme: {
        fontFamily: 'Raleway',
        fontWeight: '700',
        fontSize: 12,
        color: '#ffffff'
    },
    numtextpartyroom: {
        fontFamily: 'Raleway',
        fontWeight: '500',
        fontSize: 16,
        color: '#ffffff'
    },
    partytext: {
        fontFamily: 'Raleway',
        fontWeight: '800',
        fontSize: 18,
        color: '#ffffff'
    },
    seats: {
        fontFamily: 'Raleway',
        fontWeight: '700',
        fontSize: 16,
        // color: '#ffffff'
    },
})

