import React, { Component } from 'react';
import { View, BackHandler, Image, Text, Platform, Dimensions, StyleSheet, TouchableOpacity, ScrollView, Modal, ImageBackground, PermissionsAndroid } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { Icon } from 'react-native-gradient-icon';
import LottieView from 'lottie-react-native';
var ImagePicker = require('react-native-image-picker');
import { LinearTextGradient } from "react-native-text-gradient";
import { Shadow } from 'react-native-neomorph-shadows';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { BASE_URL } from '../../api';

export default class Explore extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            followingselected: false,
            squareselected: true,
            exploreselected: false,
            livetabselected: false,
            exploretabselected: true,
            hometabselected: false,
            chattabselected: false,
            profiletabselected: false,
            unseenmessages: 0,
            profileUri: '',
            profileimage: '',
            profilename: '',
            userid: '',
            userid1: '',
            likebuttonclicked: false,
            followingid: 0,
            followersid: 0,
            subgroupmasterid: 0,
            squaredata: [],
            userdata:[],
            showsquareloader:false,
        }
    }

    async componentDidMount() {
        //  this.setState({liveselected:!this.state.liveselected})
        // setTimeout(() => {
        //     this.props.navigation.navigate('Channelsearch')
        // }, 2000);

        await AsyncStorage.getItem('userid').then((userid) => {
            if (userid) {
                this.setState({ userid: JSON.parse(userid) });
            }
            else {
                console.log('no userid')
            }
        });

        this.getalluserdata();
        this.getsquaredata();
    }


    getalluserdata = () => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch(BASE_URL + "user/getAllsubgroupmaster", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result)
                // console.log(result.data[0].ID)
                if (result.status == 200) {

                    this.setState({
                        // friendsid: result.data[0].ID,
                        followingid: result.data[1].ID,
                        followersid: result.data[2].ID,
                        // channel1id: result.data[3].ID,
                        // megastarid: result.data[4].ID,
                        // liverecommendid: result.data[5].ID,
                        // upcomingliveid: result.data[6].ID,
                        // performerrankingid: result.data[7].ID,
                        // fanclubrankingid: result.data[8].ID,
                        // videotalentid: result.data[9].ID,
                        // partyrecommendid: result.data[10].ID,
                        // gamesid: result.data[11].ID,
                        // datingid: result.data[12].ID,
                        // chatid: result.data[13].ID,
                        // multivideoid: result.data[14].ID,
                        // familyid: result.data[15].ID,

                    })
                }
            })
            .catch(error => console.log('error', error));
    }

    setallusercommunication = () => {
        console.log('inside setallcomm to follow a friend')
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
        //     "SubGroupMasterId": this.state.subgroupmasterid,
        //     "UserId":this.state.userid,
        //     "CommuncationUserId": this.state.userid1,
        //     // "SendMessage": "1",
        //     // "ReceiveMessage": "1",
        //     "Comment": null,
        //     "QueryType":"add",
        "SubGroupMasterId": 4,
        "UserId": this.state.userid,
        "CommuncationUserId": this.state.userid1,
        "SendMessage": "",
        "ReceiveMessage": "",
        "userSubGroupMasterUniqueID":0,
        "Comment": null
         });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(BASE_URL + "user/setAllusercommuncation/Follow", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result)
                if (result.status == 200) {
                    alert(result.msg)
                }
            })
            .catch(error => console.log('error', error));
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


    getsquaredata = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "querytype": "search",
            "id":this.state.userid,              //65,      //this.state.userid
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(BASE_URL+"user/details/square", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('square data',result)
               this.setState({squaredata:[]})
                if (result.status == 200 && result.data == '') {
                    alert('No data found')
                }else if(result.status == 200 && result.data.length>0) {
                    for (let i = 0; i < result.data.length; i++) {
                        this.state.squaredata.push(result.data[i])
                    }
                    this.setState({showsquareloader:true})
                }
                else {
                    alert(result.msg)
                }

                console.log('sqaure data1 ------',this.state.squaredata)
            })
            .catch(error => console.log('error', error));
    }

    getuserdata = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "UserId": this.state.userid,
            "subgroupmasterID": this.state.subgroupmasterid,
            "CommuncationUserId": 0
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(BASE_URL + "user/getAllusercommuncation/" + this.state.subgroupname, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('following data-----',result)
                //this.state.userdata.length = 0;
                this.setState({userdata:[]});
                if (result.status == 200 && result.data == '') {
                    alert('No data found')
                } else if(result.status == 200 && result.data.length >0){
                    for (let i = 0; i < result.data.length; i++) {

                        this.state.userdata.push(result.data[i])
                    }
                    console.log('data ---', this.state.userdata)
                }
                else {
                    alert(result.msg)
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

    // followfriend = () => {
    //     makefriend = () => {
    //         var myHeaders = new Headers();
    //         myHeaders.append("Content-Type", "application/json");

    //         var raw = JSON.stringify({
    //             "UserId": this.state.userid,
    //             "subgroupmasterID": this.state.subgroupmasterid,
    //             "CommuncationUserId": this.state.userid1
    //         });

    //         var requestOptions = {
    //             method: 'POST',
    //             headers: myHeaders,
    //             body: raw,
    //             redirect: 'follow'
    //         };

    //         fetch(BASE_URL + "user/getAllusercommuncation" + this.state.subgroupname, requestOptions)
    //             .then(response => response.json())
    //             .then(result => {
    //                 console.log(result)
    //             })
    //             .catch(error => console.log('error', error));
    //     }

    // }

    renderfollowing = () => {
        return this.state.userdata.map((item) => {
            return (
                <View>
                    <View style={styles.frinedview}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginRight: 0, marginLeft: 15, alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', }}>
                                <View style={{ marginRight: 10 }}>
                                    {/* <Image source={require('../../../assets/images/lolgrp.png')} style={styles.modalimage} /> */}
                                    <Image key={item.id} source={{ uri: item.uc2image }} style={styles.profile} />
                                </View>
                                <View style={{ justifyContent: 'center' }}>
                                    <Text style={styles.username}>
                                        {/* Username */}
                                        {item.uc2first_name} {item.uc2last_name}
                                    </Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        {item.Gender == 'M' ?
                                            <Ionicons name="male" size={15} color={'#4D4D4D'} />
                                            :
                                            <Ionicons name="female" size={15} color={'#4D4D4D'} />
                                        }
                                        <Text style={styles.intext}>
                                            24 ,{' '}
                                        </Text>
                                        <MaterialIcons name="location-on" size={15} color={'#4D4D4D'} />
                                        <Text style={styles.intext}>
                                            In
                                        </Text>
                                    </View>
                                </View>

                            </View>
                            <View
                                style={{ height: 38, width: 120, alignItems: 'center', justifyContent: 'center', borderRadius: 16, borderWidth: 1, borderColor: '#202020' }}
                            >
                                <TouchableOpacity
                                    onPress={() => this.setState({ showmodal: !this.state.showmodal, subgroupmasterid: this.state.followingid,userid1:item.id })}
                                >
                                    <Text style={styles.textfollowing}>
                                        Following
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View>
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={this.state.showmodal}
                        >
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginTop: 5,

                                }}
                            >
                                <View style={{ width: Dimensions.get('window').width - 50, height: Dimensions.get('window').height / 3, backgroundColor: 'rgba(32, 32, 32, 0.7)', alignItems: 'center', justifyContent: 'center', borderRadius: 40 }}>
                                    <View>
                                        <Image source={require('../../../assets/images/newlogo.png')} style={styles.profile} />
                                    </View>
                                    <View style={{ marginTop: 10, alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={styles.areyousure}>
                                            Are you sure you want to
                                        </Text>
                                        <Text style={styles.areyousure}>
                                            unfollow this user?
                                        </Text>
                                    </View>
                                    <View>
                                        <View style={{ flexDirection: 'row', marginTop: 15 }}>
                                            <TouchableOpacity
                                                style={styles.cancelbutton}
                                            >
                                                <Text style={styles.areyousure}>
                                                    Cancel
                                                </Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={styles.unfollowbutton}
                                                onPress={() => this.setuser()}
                                            >
                                                <Text style={styles.areyousure}>
                                                    Unfollow
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>

                        </Modal>
                    </View>
                </View>
            )
        })
    }

    renderuser = () => {
        console.log('squaredata inside renderuser')
        return this.state.squaredata.map((item) => {
            return (
                <View>
                    <View style={styles.userview}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 15, marginRight: 16, alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View key={item.id} style={styles.profileview}>
                                    <ImageBackground
                                        style={{ height: 70, width: 70, alignItems: 'center', justifyContent: 'center' }}
                                        source={require('../../../assets/images/profileiconbg.png')}>
                                        <Image
                                            // source={require('../../../assets/images/lolgrp.png')}
                                            source={{ uri: item.img }}
                                            style={styles.profileimage}
                                        />
                                    </ImageBackground>

                                    <View style={{ marginTop: -30, marginLeft: 47 }}>
                                        <View style={{ backgroundColor: '#ffffff', height: 16, width: 16, borderRadius: 8, marginRight: 5 }}>
                                            <LottieView
                                                source={require('../../../assets/json/24425-sound-yellow.json')}
                                                autoPlay={true}
                                                loop={true}
                                                speed={1}
                                                ref={(animation) => {
                                                    this.anim = animation;
                                                }}
                                                style={{ height: 14, width: 14 }}
                                            />
                                        </View>
                                    </View>
                                </View>
                                <View>
                                    <Text style={styles.username}>
                                        {/* Username */}
                                        {item.first_name}
                                    </Text>
                                </View>
                            </View>

                            <LinearGradient
                                start={{ x: 0.0, y: 1.0 }}
                                end={{ x: 1.0, y: 1.0 }}
                                useAngle={true}
                                angle={360}
                                colors={['#01007E', '#FD01FC',]}
                                style={{ height: 38, width: 98, alignItems: 'center', justifyContent: 'center', borderRadius: 12 }}
                            >
                                <TouchableOpacity
                                    style={{ height: 36, width: 96, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', borderRadius: 12 }}
                                    onPress={() => this.setState({ subgroupmasterid: this.state.followingid, userid1:item.id,subgroupname:'Follow' }, () => this.setallusercommunication())}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                        <Icon name="user-follow" size={15} type="simple-line-icon"
                                            style={{ marginTop: 3 }}
                                            start={{ x: 0.0, y: 0.0 }}
                                            end={{ x: 0.0, y: 1.0 }}
                                            colors={[
                                                { color: "#01007E", offset: "1", opacity: "1" },
                                                { color: "#FD01FC", offset: "0", opacity: "1" },
                                            ]} />

                                        <LinearTextGradient
                                            style={{ fontWeight: "bold", fontSize: 16, fontFamily: 'Raleway', marginLeft: 5 }}
                                            locations={[0, 1]}
                                            colors={["#FD01FC", "#01007E"]}
                                            start={{ x: 0.0, y: 0.0 }}
                                            end={{ x: 0.0, y: 1.0 }}
                                        >
                                            <Text>
                                                Follow
                                            </Text>
                                        </LinearTextGradient>
                                    </View>
                                </TouchableOpacity>
                            </LinearGradient>
                        </View>

                        <View elevation={10} style={styles.userimageview}>
                            {this.state.profileUri ?
                                <Image
                                    source={{ uri: this.state.profileUri }}
                                    //source={require('../../../assets/images/lolgrp.png')}
                                    style={styles.userimage} />
                                :
                                <Image
                                    // source={require('../../../assets/images/lolgrp.png')}
                                    source={{ uri: item.img }}
                                    style={styles.userimage} />
                            }
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 15, marginTop: 15 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                {this.state.likebuttonclicked ?
                                    <Shadow
                                        style={{
                                            shadowOffset: { width: 0, height: 10 },
                                            shadowOpacity: 0.3,
                                            shadowColor: "#FF002E",
                                            shadowRadius: 10,
                                            borderRadius: 20,
                                            backgroundColor: 'white',
                                            marginRight: 20,
                                            width: 70,
                                            height: 34,
                                        }}
                                    >
                                        <TouchableOpacity
                                            onPress={() => this.setState({ likebuttonclicked: true })}
                                        >
                                            <LinearGradient
                                                start={{ x: 0.0, y: 1.0 }}
                                                end={{ x: 1.0, y: 1.0 }}
                                                //useAngle={true}
                                                //angle={360}
                                                colors={['#FF002E', '#CF0968',]}
                                                style={{ height: 34, width: 70, alignItems: 'center', justifyContent: 'center', borderRadius: 20, marginRight: 20 }}
                                            >
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Ionicons name="heart-outline" size={15} style={{ marginRight: 5 }} color={'#ffffff'} />
                                                    <Text style={{ fontFamily: 'Raleway', fontSize: 16, fontWeight: '500', color: '#ffffff' }}>
                                                        {/* 120 */}
                                                        {item.like}
                                                    </Text>
                                                </View>
                                            </LinearGradient>
                                        </TouchableOpacity>
                                    </Shadow>
                                    :
                                    <Shadow
                                        style={{
                                            shadowOffset: { width: 0, height: 10 },
                                            shadowOpacity: 0.5,
                                            shadowColor: "#DDDDDD",
                                            shadowRadius: 10,
                                            borderRadius: 20,
                                            backgroundColor: 'white',
                                            marginRight: 20,
                                            width: 70,
                                            height: 34,
                                        }}
                                    >
                                        <TouchableOpacity
                                            onPress={() => this.setState({ likebuttonclicked: true })}
                                        >
                                            <LinearGradient
                                                start={{ x: 0.0, y: 1.0 }}
                                                end={{ x: 1.0, y: 1.0 }}
                                                //useAngle={true}
                                                //angle={360}
                                                colors={['#DDDDDD', '#EEEEEE',]}
                                                style={{ height: 34, width: 70, alignItems: 'center', justifyContent: 'center', borderRadius: 20, marginRight: 20 }}
                                            >
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Ionicons name="heart-outline" size={15} style={{ marginRight: 5 }} color={'#ffffff'} />
                                                    <Text style={{ fontFamily: 'Raleway', fontSize: 16, fontWeight: '500', color: '#ffffff' }}>
                                                        {/* 120 */}
                                                        {item.like}
                                                    </Text>
                                                </View>
                                            </LinearGradient>
                                        </TouchableOpacity>
                                    </Shadow>
                                }
                                <TouchableOpacity style={{ marginRight: 20 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Ionicons name="chatbubble-ellipses-outline" size={22} style={{ marginRight: 5 }} />
                                        <Text style={{ fontFamily: 'Raleway', fontSize: 16, fontWeight: '500', color: '#202020' }}>
                                            {/* 24 */}
                                            {item.comments}
                                        </Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity>
                                    <FontAwesome5 name="share" size={22} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        {/*<View style={{ marginTop: Dimensions.get('window').height-100, marginLeft: Dimensions.get('window').width - 30, alignItems: 'flex-start', justifyContent: 'center', position: 'absolute', zIndex: 1}}>
                        <LinearGradient
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                            useAngle={true}
                            angle={90}
                            colors={['rgba(253, 1, 252, 0.6)', 'rgba(1, 0, 126, 0.6)',]}
                            style={{ height: 60, width: 60, borderRadius: 30, marginTop: -50, marginLeft: Dimensions.get('window').width - 50, alignItems: 'flex-start', justifyContent: 'center', position: 'absolute', zIndex: 1 }}
                        >
                        <ImageBackground  source={require('../../../assets/images/cam1.png')}
                        style={{height:40,width:40}}
                        >
                            <TouchableOpacity
                            >
                                <Entypo name="camera" size={20} color={'#ffffff'} style={{marginLeft:5}}/>
                            </TouchableOpacity>
                        </ImageBackground>
                        </LinearGradient>
                                        </View>*/}
                    </View>
                </View>
            )
        })
    }

    // renderfooter = () => {
    //     return (
    //         <View>
    //             <View style={{ height: 80, width: Dimensions.get('window').width, backgroundColor: 'rgba(255, 255, 255, 0.9)', justifyContent: 'center', }}>
    //                 <View style={{ flexDirection: 'row', marginLeft: 10, marginRight: 10, justifyContent: 'space-between', }}>
    //                     <View>
    //                         {this.state.livetabselected ?
    //                             <View>
    //                                 <TouchableOpacity
    //                                  onPress={() =>this.props.navigation.navigate('Live')}
    //                                     style={{ height: 42, width: 42, alignItems: 'center', justifyContent: 'center' }}
    //                                 >
    //                                     <LinearGradient
    //                                         start={{ x: 0, y: 0.5 }}
    //                                         end={{ x: 1, y: 0.5 }}
    //                                         colors={['#01007E', '#FD01FC',]}
    //                                         style={{ height: 3, width: 15, alignSelf: 'center', marginBottom: 5 }}
    //                                     >
    //                                     </LinearGradient>
    //                                     <Image source={require('../../../assets/images/mdi_party-popper.png')} style={{ height: 30, width: 30 }} />
    //                                 </TouchableOpacity>
    //                             </View>
    //                             :
    //                             <TouchableOpacity
    //                             onPress={() =>this.props.navigation.navigate('Live')}
    //                                 style={{ height: 42, width: 42, alignItems: 'center', justifyContent: 'center' }}
    //                             >
    //                                 <Image source={require('../../../assets/images/mdi_party-popper1.png')} style={{ height: 30, width: 30 }} />
    //                             </TouchableOpacity>
    //                         }
    //                     </View>

    //                     <View>
    //                         {this.state.exploretabselected ?
    //                             <View>
    //                                 <TouchableOpacity
    //                                  onPress={() =>this.props.navigation.navigate('Explore')}
    //                                     style={{ height: 42, width: 42, alignItems: 'center', justifyContent: 'center' }}
    //                                 >
    //                                     <LinearGradient
    //                                         start={{ x: 0, y: 0.5 }}
    //                                         end={{ x: 1, y: 0.5 }}
    //                                         colors={['#01007E', '#FD01FC',]}
    //                                         style={{ height: 3, width: 15, alignSelf: 'center', marginBottom: 5 }}
    //                                     >
    //                                     </LinearGradient>
    //                                     <Image source={require('../../../assets/images/bx_bxs-planet1.png')} style={{ height: 30, width: 30 }} />
    //                                 </TouchableOpacity>
    //                             </View>
    //                             :
    //                             <TouchableOpacity
    //                             onPress={() =>this.props.navigation.navigate('Explore')}
    //                                 style={{ height: 42, width: 42, alignItems: 'center', justifyContent: 'center' }}
    //                             >
    //                                 <Image source={require('../../../assets/images/bx_bxs-planet.png')} style={{ height: 30, width: 30 }} />
    //                             </TouchableOpacity>
    //                         }
    //                     </View>

    //                     <View>
    //                         {/* {this.state.hometabselected? */}
    //                         <View>
    //                             <TouchableOpacity
    //                                 style={{ height: 42, width: 42, alignItems: 'center', justifyContent: 'center' }}
    //                             >
    //                                 <LinearGradient
    //                                     start={{ x: 0, y: 0.5 }}
    //                                     end={{ x: 1, y: 0.5 }}
    //                                     colors={['#01007E', '#FD01FC',]}
    //                                     style={{ height: 3, width: 15, alignSelf: 'center', marginBottom: 5 }}
    //                                 >
    //                                 </LinearGradient>
    //                                 {/* <MaterialIcons name="home" size={30} /> */}
    //                                 <Icon name="home" size={40} type="material" 

    //                                 colors={[
    //                                     { color: "#01007E", offset: "1", opacity: "1" },
    //                                     { color: "#FD01FC", offset: "0", opacity: "1" },
    //                                 ]} />
    //                                 {/* <Image source={require('../../../assets/images/mdi_party-popper.png')} style={{ height: 30, width: 30 }} /> */}
    //                             </TouchableOpacity>
    //                         </View>
    //                         {/* :
    //                     <TouchableOpacity
    //                     style={{ height: 42, width: 42, alignItems: 'center', justifyContent: 'center' }}
    //                     >
    //                         <MaterialIcons name="home" size={30} />

    //                     </TouchableOpacity>
    //                     } */}
    //                     </View>

    //                     <View>
    //                         {this.state.chattabselected ?
    //                             <View>
    //                                 <TouchableOpacity
    //                                  onPress={() =>this.props.navigation.navigate('Chat')}
    //                                     style={{ height: 42, width: 42, alignItems: 'center', justifyContent: 'center' }}
    //                                 >
    //                                     <LinearGradient
    //                                         start={{ x: 0, y: 0.5 }}
    //                                         end={{ x: 1, y: 0.5 }}
    //                                         colors={['#01007E', '#FD01FC',]}
    //                                         style={{ height: 3, width: 15, alignSelf: 'center', marginBottom: 5 }}
    //                                     >
    //                                     </LinearGradient>
    //                                     <Icon name="chatbubble-ellipses" size={30} type="ionicon" 
    //                                  useAngle={true}
    //                                  angle={180}
    //                                 colors={[
    //                                     { color: "#01007E", offset: "1", opacity: "1" },
    //                                     { color: "#FD01FC", offset: "0", opacity: "1" },
    //                                 ]} />
    //                                     {/* <Ionicons name="chatbubble-ellipses" size={30} /> */}
    //                                     {/* <Image source={require('../../../assets/images/mdi_party-popper.png')} style={{ height: 30, width: 30 }} /> */}
    //                                 </TouchableOpacity>
    //                             </View>
    //                             :
    //                             <TouchableOpacity
    //                             onPress={() =>this.props.navigation.navigate('Chat')}
    //                                 style={{ height: 42, width: 42, alignItems: 'center', justifyContent: 'center' }}
    //                             >
    //                                 <Ionicons name="chatbubble-ellipses" size={30} />
    //                                 {/* <Image source={require('../../../assets/images/mdi_party-popper1.png')} style={{ height: 30, width: 30 }} />   */}
    //                             </TouchableOpacity>
    //                         }
    //                     </View>

    //                     <View>
    //                         {this.state.profiletabselected ?
    //                             <View style={{alignItems:'center',justifyContent:'center'}}>
    //                                 <TouchableOpacity
    //                                  onPress={() =>this.props.navigation.navigate('Profile')}
    //                                     style={{ height: 42, width: 42, alignItems: 'center', justifyContent: 'center' }}
    //                                 >
    //                                     <LinearGradient
    //                                         start={{ x: 0, y: 0.5 }}
    //                                         end={{ x: 1, y: 0.5 }}
    //                                         colors={['#01007E', '#FD01FC',]}
    //                                         style={{ height: 3, width: 15, alignSelf: 'center', marginBottom: 5 }}
    //                                     >
    //                                     </LinearGradient>
    //                                     <Icon name="person" size={30} type="material" 
    //                                  useAngle={true}
    //                                  angle={180}
    //                                 colors={[
    //                                     { color: "#01007E", offset: "1", opacity: "1" },
    //                                     { color: "#FD01FC", offset: "0", opacity: "1" },
    //                                 ]} />
    //                                     {/* <MaterialIcons name="person" size={30} /> */}
    //                                     {/* <Image source={require('../../../assets/images/mdi_party-popper.png')} style={{ height: 30, width: 30 }} /> */}
    //                                 </TouchableOpacity>
    //                             </View>
    //                             :
    //                             <TouchableOpacity
    //                             onPress={() =>this.props.navigation.navigate('Profile')}
    //                                 style={{ height: 42, width: 42, alignItems: 'center', justifyContent: 'center' }}
    //                             >
    //                                 <MaterialIcons name="person" size={30} />
    //                                 {/* <Image source={require('../../../assets/images/mdi_party-popper1.png')} style={{ height: 30, width: 30 }} />   */}
    //                             </TouchableOpacity>
    //                         }
    //                     </View>
    //                 </View>
    //             </View>
    //         </View>
    //     )
    // }

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
                                            style={{ height: 3, width: 15, alignSelf: 'center', marginBottom: 5, marginLeft: 7 }}
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
                                            colors={['#FD01FC', '#01007E',]}
                                            style={{ height: 3, width: 15, alignSelf: 'center', marginBottom: 5, marginLeft: 3 }}
                                        >
                                        </LinearGradient>
                                        <Shadow
                                            style={{
                                                shadowOffset: { width: 5, height: 7 },
                                                shadowOpacity: 0.3,
                                                shadowColor: "#01007E",
                                                shadowRadius: 5,
                                                borderRadius: 5,
                                                backgroundColor: 'transparent',
                                                //marginRight: 20,
                                                width: 25,
                                                height: 25,
                                            }}>
                                            <Image source={require('../../../assets/images/bx_bxs-planet1.png')} style={{ height: 30, width: 30 }} />
                                        </Shadow>
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
                                     onPress={()=>this.setState({hometabselected:true,livetabselected:false,exploretabselected:false,chattabselected:false,profiletabselected:false},()=>this.props.navigation.navigate('Createroom'))}
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
                                onPress={()=>this.setState({hometabselected:true,livetabselected:false,exploretabselected:false,chattabselected:false,profiletabselected:false},()=>this.props.navigation.navigate('Createroom'))}
                                    //onPress={() => this.setState({ hometabselected: true })}
                                    style={{ height: 50, width: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 25, borderColor: '#ffffff', borderWidth: 2, marginTop: -20, backgroundColor: '#000000' }}
                                >
                                    {/* <MaterialIcons name="home" size={25} color={'#ffffff'} /> */}
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

                                        {/* <Ionicons name="chatbubble-ellipses" size={30} /> */}
                                        {/* <Image source={require('../../../assets/images/mdi_party-popper.png')} style={{ height: 30, width: 30 }} /> */}
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
                                        onPress={() => this.props.navigation.navigate('Menu')}
                                        style={{ height: 42, width: 42, alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        <LinearGradient
                                            start={{ x: 0, y: 0.5 }}
                                            end={{ x: 1, y: 0.5 }}
                                            colors={['#01007E', '#FD01FC',]}
                                            style={{ height: 3, width: 15, alignSelf: 'center', marginBottom: 5 }}
                                        >
                                        </LinearGradient>
                                        <Icon name="person" size={35} type="material"
                                            useAngle={true}
                                            angle={180}
                                            colors={[
                                                { color: "#01007E", offset: "1", opacity: "1" },
                                                { color: "#FD01FC", offset: "0", opacity: "1" },
                                            ]} />
                                        {/* <MaterialIcons name="person" size={30} /> */}
                                        {/* <Image source={require('../../../assets/images/mdi_party-popper.png')} style={{ height: 30, width: 30 }} /> */}
                                    </TouchableOpacity>
                                </View>
                                :
                                <TouchableOpacity
                                    // onPress={() => this.props.navigation.navigate('Profile')}
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
                <View style={{ flex: 0.9 }}>
                    <View style={{
                        height: 80,
                        width: Dimensions.get('window').width,
                        borderBottomLeftRadius: 30,
                        borderBottomRightRadius: 30,
                        backgroundColor: '#ffffff',
                        justifyContent: 'center',

                    }}>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 30, marginRight: 30, alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {this.state.followingselected?
                                <TouchableOpacity
                                style={{ marginRight: 30 }}
                                onPress={()=>this.setState({squareselected:false,followingselected:true,subgroupname:'Following', subgroupmasterid: this.state.followingid,},()=>this.getuserdata())}
                                >
                                    <Text style={styles.squaretext}>
                                        Following
                                    </Text>
                                    <LinearGradient
                                        start={{ x: 0, y: 0.5 }}
                                        end={{ x: 1, y: 0.5 }}
                                        colors={['#01007E', '#FD01FC',]}
                                        style={{ height: 3, width: 15, alignSelf: 'center' }}
                                    >
                                    </LinearGradient>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity 
                                style={{ marginRight: 30 }}
                                onPress={() => this.setState({followingselected:true,squareselected:false, subgroupmasterid: this.state.followingid, subgroupname: 'Following' }, () => this.getuserdata())}
                                >
                                    <Text style={styles.followingtext}>
                                        Following
                                    </Text>
                                </TouchableOpacity>
                                }
                                {this.state.squareselected ?
                                    <TouchableOpacity
                                    onPress={()=>this.setState({squareselected:true,followingselected:false,},()=>this.getsquaredata())}
                                    >
                                        <Text style={styles.squaretext}>
                                            Square
                                        </Text>
                                        <LinearGradient
                                            start={{ x: 0, y: 0.5 }}
                                            end={{ x: 1, y: 0.5 }}
                                            colors={['#01007E', '#FD01FC',]}
                                            style={{ height: 3, width: 15, alignSelf: 'center' }}
                                        >
                                        </LinearGradient>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity
                                    onPress={()=>this.setState({squareselected:true,followingselected:false,},()=>this.getsquaredata())}
                                    >
                                        <Text style={styles.followingtext}>
                                            Square
                                        </Text>
                                    </TouchableOpacity>
                                }
                            </View>

                            {/* <TouchableOpacity>
                            <Text style={styles.followingtext}>
                                Explore
                            </Text>
                        </TouchableOpacity> */}
                            <TouchableOpacity
                            onPress={() =>alert('No notifications yet')}
                            >
                                <Image
                                    source={require('../../../assets/images/bell.png')}
                                    style={{ height: 25, width: 25 }}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <ScrollView>
                        {this.state.squareselected?
                        <View style={{ marginLeft: 15, marginRight: 15, marginTop: 20, marginBottom: 30 }}>
                            {this.renderuser()}
                            {/* {this.renderuser()} */}
                        </View>
                        :
                        this.state.followingselected?
                        <View style={{ marginLeft: 15, marginRight: 15, marginTop: 20, marginBottom: 30 }}>
                            {this.renderfollowing()}
                        </View>
                        :null}
                    </ScrollView>
                    {/* <ScrollView> */}
                        <View style={{ top: -(Dimensions.get('window').height / 7), left: Dimensions.get('window').width - 50, elevation: 10, backgroundColor: 'transparent', position: 'absolute', alignItems: 'center', justifyContent: 'center' }}>
                            <TouchableOpacity
                                onPress={() => this.launchCamera()}
                            >
                                <ImageBackground source={require('../../../assets/images/cam.png')}
                                    style={{ height: Dimensions.get('window').height, width: 50, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent' }}
                                >
                                    <Entypo name="camera" size={20} color={'#fff'} style={{ top: Dimensions.get('window').height - 230, position: 'absolute' }} />
                                    {/* style={{marginTop:Dimensions.get('window').height/3+75, position:'absolute'}}  */}
                                    {/* style={{top:Dimensions.get('window').height-230,position:'absolute'}} */}
                                    {/* style={{ top:-(Dimensions.get('window').height/5), left: Dimensions.get('window').width - 70, position:'absolute'}} */}
                                </ImageBackground>
                            </TouchableOpacity>
                        </View>
                    {/* </ScrollView> */}

                </View>
                <View style={{ flex: 0.1, position: 'absolute', bottom: 0, left: 0, }}>
                    {this.renderfooter()}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    followingtext: {
        fontFamily: 'Raleway',
        fontSize: 20,
        fontWeight: '600',
        color: '#4D4D4D',
    },
    squaretext: {
        fontFamily: 'Raleway',
        fontSize: 30,
        fontWeight: 'bold',
        color: '#202020',
    },
    userview: {
        height: Dimensions.get('window').height / 2 + 20,
        width: Dimensions.get('window').width - 30,
        borderRadius: 30,
        backgroundColor: '#ffffff',
        shadowColor: '#000000',
        shadowOpacity: 0.8,
        elevation: 10,
        marginBottom: 20,

    },
    profileview: {
        height: 82,
        width: 82,
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileimage: {
        height: 36,
        width: 36,
        borderRadius: 18,
    },
    username: {
        fontFamily: 'Raleway',
        fontSize: 16,
        fontWeight: '700',
        color: '#202020',
    },
    userimageview: {
        height: Dimensions.get('window').height / 2 - 130,
        width: Dimensions.get('window').width - 80,
        borderRadius: 30,
        backgroundColor: '#C4C4C4',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 25,
        marginRight: 25
    },
    userimage: {
        height: Dimensions.get('window').height / 2 - 130,
        width: Dimensions.get('window').width - 80,
        borderRadius: 30,
    }

})

