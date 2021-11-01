import React, { useEffect } from 'react';
import { View, BackHandler, Image, Text, Platform, Dimensions, ScrollView, TouchableOpacity, StyleSheet, PermissionsAndroid, Modal } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import LinearGradient from 'react-native-linear-gradient';
import { Icon } from 'react-native-gradient-icon';
import { BASE_URL } from '../../api';
import { Shadow } from 'react-native-neomorph-shadows';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Share from 'react-native-share';
import Entypo from 'react-native-vector-icons/Entypo';
import { TextInput } from 'react-native-gesture-handler';
var ImagePicker = require('react-native-image-picker');
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';

var radio_props = [
    { label: 'Female', value: 'F' },
    { label: 'Male', value: 'M' }
];

export default class Editprofile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showfull: true,
            livetabselected: false,
            exploretabselected: false,
            hometabselected: false,
            chattabselected: false,
            profiletabselected: true,
            unseenmessages: 0,
            userid: '',
            userid1: '',
            userdata: [],
            cameraclicked: false,
            profileUri: '',
            profileimage: '',
            profilename: '',
            name: '',
            birthday: '',
            gender: '',
            phonenumber: '',
            email: '',
            value: '',
            value3Index: '',
            showmodal: false,
        }
    }

    async componentDidMount() {
        // setTimeout(() => {
        //    // this.props.navigation.navigate('Contact')
        //    this.props.navigation.navigate('Searchchatroom')
        // }, 1000);

        await AsyncStorage.getItem('userid').then((userid) => {
            if (userid) {
                this.setState({ userid: JSON.parse(userid) });
            }
            else {
                console.log('no userid')
            }
        });

        await this.getnotifications();
        await this.getprofile();
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

    getprofile1 = () => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch(BASE_URL + "profile/personal/" + this.state.userid, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('userdetails-----', result)
                //this.state.userdata.length = 0;
                this.setState({ userdata: [] })
                if (result.status == 200) {
                    for (let i = 0; i < result.data.length; i++) {
                        this.state.userdata.push(result.data[i])
                    }
                    this.setState({
                        name: result.data[0].first_name,
                        email: result.data[0].email,
                        phonenumber: result.data[0].phone,
                    })
                    console.log('userdata', this.state.userdata[0].first_name)
                }
                else {
                    alert(result.msg)
                }
            })
            .catch(error => console.log('error', error));
    }

    getprofile = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "querytype": "getProfile",
            "test": this.state.userid,
            "searchBy": 1
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(BASE_URL + "user/details/getProfile", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('userdetails-----', result)
                //this.state.userdata.length = 0;
                this.setState({ userdata: [] })
                if (result.status == 200) {
                    for (let i = 0; i < result.data.length; i++) {
                        this.state.userdata.push(result.data[i])
                    }
                    this.setState({ showloader: true })
                    this.setState({
                        name: result.data[0].first_name,
                        email: result.data[0].email,
                        birthday: result.data[0].dob,
                        gender: result.data[0].Gender,
                        profileUri: result.data[0].img,
                        phonenumber: result.data[0].phone,
                    })
                    //console.log('userdata', this.state.userdata[0].first_name)
                }
                else {
                    alert(result.msg)
                }
            })
            .catch(error => console.log('error', error));
    }

    shareOptions = {
        title: 'Title',
        message: 'Message to share', // Note that according to the documentation at least one of "message" or "url" fields is required
        //url: '',
        subject: 'Subject'
    };

    editprofile = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            // "id":this.state.userid,
            // "country":"India",
            // "language":"Eng",
            // "first_name":this.state.name,
            // "last_name":"",
            // "email":this.state.email,
            // "phone":this.state.phonenumber,
            // "pin_code":"",
            // "QueryType":"UpdateregisterUser",
            // "gender":this.state.gender,
            // "dob":this.state.birthday

            "id": this.state.userid,
            "country": "India",
            "language": "Eng",
            "first_name": this.state.name,
            "last_name": "",
            "email": this.state.email,
            "phone": this.state.phonenumber,
            "pin_code": "7657",
            "querytype": "UpdateregisterUser",
            "gender": this.state.gender,
            "dob": this.state.birthday

        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(BASE_URL + "user/details/UpdateregisterUser", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('edit profile----', result)
                if (result.status == 200) {
                    alert('profile updated')
                    this.props.navigation.goBack()
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
                        cameraclicked: true,

                    });

                    this.uploadimage();
                    //console.log('photo uri',this.state.profileUri)
                }
            });
        }
    }

    launchImageLibrary = async () => {
        this.setState({ showmodal: false, })
        let options = {
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        // const granted = await PermissionsAndroid.request(
        //   PermissionsAndroid.PERMISSIONS.CAMERA,
        //   {
        //     title: 'App Camera Permission',
        //     message: 'App needs access to your camera ',
        //     // buttonNeutral: "Ask Me Later",
        //     // buttonNegative: "Cancel",
        //     // buttonPositive: "OK"
        //   },
        // );
        // if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        ImagePicker.launchImageLibrary(options, (response) => {
            // console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
                alert(response.customButton);
            } else {
                //const source = { uri: response.uri };
                // console.log('profileimage response', JSON.stringify(response.assets[0]));
                this.setState({
                    profileimage: response,
                    profileUri: response.assets[0].uri,
                    profilename: response.assets[0].fileName,
                    cameraclicked: true,
 
                });

                this.uploadimage();

            }
        });
        //}
    };


    uploadimage = () => {
        var formdata = new FormData();
        formdata.append("image", {
            uri: this.state.profileUri,
            type: 'image/jpeg',
            name: 'image.jpg',
        });

        var requestOptions = {
            method: 'PATCH',
            body: formdata,
            redirect: 'follow'
        };

        fetch(BASE_URL + "profile/profile_image/" + this.state.userid, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('image response----', result)
                alert(result.msg)
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
                                        onPress={() => this.setState({ hometabselected: true, livetabselected: false, exploretabselected: false, chattabselected: false, profiletabselected: false }, () => this.props.navigation.navigate('Createroom'))}
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
                                    onPress={() => this.setState({ hometabselected: true, livetabselected: false, exploretabselected: false, chattabselected: false, profiletabselected: false }, () => this.props.navigation.navigate('Createroom'))}
                                    //onPress={() =>this.setState({hometabselected:true})}
                                    style={{ height: 60, width: 60, alignItems: 'center', justifyContent: 'center', borderRadius: 30, borderColor: '#ffffff', borderWidth: 2, marginTop: -20, backgroundColor: '#000000' }}
                                >
                                    {/* <MaterialIcons name="home" size={30} color={'#ffffff'}/> */}
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
                                            colors={['#FD01FC', '#01007E',]}
                                            style={{ height: 3, width: 15, alignSelf: 'center', marginBottom: 5, marginLeft: 3 }}
                                        >
                                        </LinearGradient>
                                        <Shadow
                                            style={{
                                                shadowOffset: { width: 10, height: 0 },
                                                shadowOpacity: 0.4,
                                                shadowColor: "#FD01FC",
                                                shadowRadius: 5,
                                                borderRadius: 5,
                                                backgroundColor: 'transparent',
                                                //marginRight: 20,
                                                width: 25,
                                                height: 25,
                                            }}>
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
                                        </Shadow>
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
                                        //onPress={() =>this.props.navigation.navigate('Profile')}
                                        onPress={() => this.props.navigation.navigate('Menu')}
                                        style={{ height: 42, width: 42, alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        <LinearGradient
                                            start={{ x: 0, y: 0.5 }}
                                            end={{ x: 1, y: 0.5 }}
                                            colors={['#FD01FC', '#01007E',]}
                                            style={{ height: 3, width: 15, alignSelf: 'center', marginBottom: 2, marginLeft: 5 }}
                                        >
                                        </LinearGradient>
                                        <Shadow
                                            style={{
                                                shadowOffset: { width: -7, height: 0 },
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
                                                angle={180}
                                                start={{ x: 0, y: 0 }}
                                                end={{ x: 0, y: 1 }}
                                                colors={[
                                                    { color: "#01007E", offset: "1", opacity: "1" },
                                                    { color: "#FD01FC", offset: "0", opacity: "1" },
                                                ]} />
                                        </Shadow>
                                        {/* <MaterialIcons name="person" size={30} /> */}
                                        {/* <Image source={require('../../../assets/images/mdi_party-popper.png')} style={{ height: 30, width: 30 }} /> */}
                                    </TouchableOpacity>
                                </View>
                                :
                                <TouchableOpacity
                                    //onPress={() =>this.props.navigation.navigate('Profile')}
                                    onPress={() => this.props.navigation.navigate('Menu')}
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

    render() {
        return (
            <View style={{ flex: 1 }}>
                {/* <Image source={require('../../../assets/images/splash.png')} style={{height:Dimensions.get('window').height,width:Dimensions.get('window').width,}}/> */}

                <View style={{ flex: 0.9 }}>
                    <ScrollView>
                        <View style={{ height: Dimensions.get('window').height / 3 + 20, width: Dimensions.get('window').width, borderBottomColor: '#DDD', borderBottomWidth: 5 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 20, marginRight: 20, marginTop: 20 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <TouchableOpacity
                                        style={{ alignItems: 'center', justifyContent: 'center', marginRight: 20, }}
                                        // onPress={() => this.setState({ friendsselected: !this.state.friendsselected, followingselected: false,followerselected:false,channelselected:false })}
                                        onPress={() => this.props.navigation.goBack()}
                                    >
                                        <Ionicons name="arrow-back" size={25} />
                                    </TouchableOpacity>
                                    <View>
                                        <Text style={{ fontFamily: 'Raleway', fontSize: 20, color: '#202020' }}>
                                            Edit Profile
                                        </Text>
                                    </View>
                                </View>
                                <View>
                                    <TouchableOpacity
                                        style={{ height: 35, width: 60, backgroundColor: '#FEA20C', borderRadius: 20, alignItems: 'center', justifyContent: 'center' }}
                                        onPress={() => this.editprofile()}
                                    >
                                        <Text style={{ fontFamily: 'Raleway', fontSize: 18, color: '#fff' }}>
                                            OK
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View>
                                <TouchableOpacity
                                    style={{ height: 130, width: 130, backgroundColor: '#EEE', alignItems: 'center', justifyContent: 'center', marginTop: 30 }}
                                    // onPress={()=>this.launchCamera()}
                                    onPress={() => this.setState({ showmodal: true })}
                                >
                                    {this.state.cameraclicked ?
                                        <Image
                                            source={{ uri: this.state.profileUri }}
                                            style={{ height: 98, width: 98 }}
                                        />
                                        :
                                        <Entypo name="plus" size={30} color={"#DDD"} />
                                    }
                                </TouchableOpacity>
                            </View>
                            <View>
                                <Modal
                                    animationType="slide"
                                    transparent={true}
                                    visible={this.state.showmodal}>
                                    <View style={styles.btnParentSection}>
                                        <View
                                            style={{
                                                borderRadius: 5,
                                                borderWidth: 0.5,
                                                backgroundColor: '#FFFFFF',
                                                width: 300,
                                            }}>
                                            <TouchableOpacity
                                                onPress={() => this.launchCamera()}
                                                style={styles.btnSection}>
                                                <Text style={styles.btnText}>Take a photo</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                //onPress={() =>this.uploadprofile()}
                                                onPress={() => this.launchImageLibrary()}
                                                style={(styles.btnSection, { margin: 20 })}>
                                                <Text style={styles.btnText}>
                                                    Choose from the device folders
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </Modal>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 20, marginLeft: 15, alignItems: 'center' }}>
                                <View>
                                    <MaterialIcons name="check-circle" size={15} color={"#FEA20C"} />
                                </View>
                                <View>
                                    <Text style={{ fontSize: 14, color: '#4D4D4D', marginLeft: 5 }}>
                                        Automatically synchronize profile photo to post
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={{ marginTop: 0, marginLeft: 15 }}>
                            <View style={{ justifyContent: 'center', height: 50 }}>
                                <Text >
                                    Bio
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', height: 50, justifyContent: 'space-between', marginRight: 15, borderBottomColor: '#DDD', borderTopColor: '#DDD', borderTopWidth: 1, borderBottomWidth: 1, alignItems: 'center' }}>
                                <Text>
                                    Avatar
                                </Text>
                                {this.state.profileUri ?
                                    <Image
                                        source={{ uri: this.state.profileUri }}
                                        style={{ height: 40, width: 40 }}
                                    />
                                    :
                                    <Image
                                        source={require('../../../assets/images/newlogo.png')}
                                        //source={{ uri: this.state.profileUri }}
                                        style={{ height: 40, width: 40 }}
                                    />
                                }
                            </View>
                            <View style={{ flexDirection: 'row', height: 50, justifyContent: 'space-between', marginRight: 15, borderBottomColor: '#DDD', borderBottomWidth: 1, alignItems: 'center' }}>
                                <Text>
                                    Name
                                </Text>
                                <TextInput
                                    placeholder="Name"
                                    onChangeText={(text) => this.setState({ name: text })}
                                    value={this.state.name}

                                />
                            </View>
                            <View style={{ flexDirection: 'row', height: 50, justifyContent: 'space-between', marginRight: 15, borderBottomColor: '#DDD', borderBottomWidth: 1, alignItems: 'center' }}>
                                <Text>
                                    Birthday
                                </Text>
                                <TextInput
                                    placeholder="yyyy/mm/dd"
                                    onChangeText={(text) => this.setState({ birthday: text })}
                                    value={this.state.birthday}

                                />
                            </View>
                            <View style={{ flexDirection: 'row', height: 50, justifyContent: 'space-between', marginRight: 15, borderBottomColor: '#DDD', borderBottomWidth: 1, alignItems: 'center' }}>
                                <Text>
                                    Gender
                                </Text>
                                {/* <TextInput
                        placeholder="F"
                        onChangeText={(text) =>this.setState({gender:text})}
                        value={this.state.gender}
                        
                        /> */}
                                <View>
                                    <RadioForm
                                        formHorizontal={true}
                                        animation={true}
                                    // initial={0}
                                    >

                                        {
                                            radio_props.map((obj, i) => {
                                                var onPress = async (value, index) => {
                                                    await this.setState({
                                                        value: value,
                                                        value3Index: index,
                                                        // showModal: !this.state.showModal,
                                                        Gender: value,
                                                    })  //() => this.orderpost() ,()=>this.paymethodselection() 
                                                }
                                                return (
                                                    <RadioButton labelHorizontal={true}
                                                        key={i}

                                                        style={{ borderBottomColor: '#DDDDDD', borderBottomWidth: 0 }}
                                                    >
                                                        {/*  You can set RadioButtonLabel before RadioButtonInput */}
                                                        <RadioButtonInput
                                                            obj={obj}
                                                            index={i}
                                                            isSelected={this.state.value3Index === i}
                                                            onPress={onPress}
                                                            borderWidth={2}
                                                            buttonColor={'#000000'}
                                                            // buttonInnerColor={'#e74c3c'}
                                                            // buttonOuterColor={'#000000'}
                                                            buttonSize={5}
                                                            buttonOuterSize={15}
                                                            buttonStyle={{}}
                                                            buttonWrapStyle={{ margin: 10, }}
                                                        />
                                                        <RadioButtonLabel
                                                            obj={obj}
                                                            index={i}
                                                            labelHorizontal={true}
                                                            onPress={onPress}
                                                            labelStyle={{ fontSize: 14, color: '#000000' }}
                                                            labelWrapStyle={{}}
                                                        />
                                                    </RadioButton>
                                                )

                                            })
                                        }
                                    </RadioForm>
                                </View>

                            </View>
                            <View style={{ flexDirection: 'row', height: 50, justifyContent: 'space-between', marginRight: 15, borderBottomColor: '#DDD', borderBottomWidth: 1, alignItems: 'center' }}>
                                <Text>
                                    Phonenumber
                                </Text>
                                <TextInput
                                    placeholder="Phonenumber"
                                    onChangeText={(text) => this.setState({ phonenumber: text })}
                                    value={this.state.phonenumber}

                                />
                            </View>
                            <View style={{ flexDirection: 'row', height: 50, justifyContent: 'space-between', marginRight: 15, borderBottomColor: '#DDD', borderBottomWidth: 1, alignItems: 'center' }}>
                                <Text>
                                    Email
                                </Text>
                                <TextInput
                                    placeholder="Email"
                                    onChangeText={(text) => this.setState({ email: text })}
                                    value={this.state.email}

                                />
                            </View>


                        </View>








                    </ScrollView>
                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    profile: {
        height: 50,
        width: 50,
        borderRadius: 25,
    },
    followerstext: {
        fontFamily: 'Raleway',
        fontWeight: '700',
        fontSize: 12,
        color: '#888888',
        alignSelf: 'center'
    },
    followernum: {
        fontFamily: 'Raleway',
        fontWeight: 'bold',
        fontSize: 18,
        color: '#4D4D4D',
        alignSelf: 'center'
    },
    id: {
        fontFamily: 'Raleway',
        fontWeight: '600',
        fontSize: 16,
        color: '#202020'
    },
    menutitle: {
        fontFamily: 'Raleway',
        fontWeight: '800',
        fontSize: 18,
        color: '#4D4D4D'
    },
    btnParentSection: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnSection: {
        // width:Dimensions.get('window').width,
        // height: 40,
        backgroundColor: '#FFFFFF',
        alignItems: 'flex-start',
        justifyContent: 'center',
        borderRadius: 3,
        //  marginBottom:20,
        marginTop: 20,
        marginLeft: 20,
    },
    btnText: {
        textAlign: 'left',
        color: '#111111',
        fontSize: 18,
    },



})