import React, { Component } from 'react';
import { View, BackHandler, Image, Text, Platform, Dimensions, StyleSheet, TouchableOpacity, ScrollView, ImageBackground, FlatList, TextInput, Modal } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import LottieView from 'lottie-react-native';
import { BlurView } from '@react-native-community/blur';
import { WebView } from 'react-native-webview';
import { Shadow } from 'react-native-neomorph-shadows';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../api';

export default class Createroom extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showsettingmodal: false,
            result: '',
            showoverflowmenu: false,
            showchatroomoptions: false,
            mute: true,
            showwebview: false,
            publicroom: true,
            roomname: '',
            partyselected: true,
            multivideoselected: false,
            userid: '',
            partyroomid:0,
        }
    }

    async componentDidMount() {
        //  this.setState({liveselected:!this.state.liveselected})
        // setTimeout(() => {
        //     this.props.navigation.navigate('Explore')
        // }, 2000);

        await AsyncStorage.getItem('userid').then((userid) => {
            if (userid) {
                this.setState({ userid: JSON.parse(userid) });
            }
            else {
                console.log('no userid')
            }
        });

        this.getsubgroupid();
    }

    getsubgroupid = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({ "querytype": "getEndUserMaster" });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(BASE_URL+"user/details/getEndUserMaster", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result)
                if (result.status == 200) {
                    this.setState({ partyroomid: result.data[1].id })
                }
            })
            .catch(error => console.log('error', error));
    }

    createpartyroom = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "querytype": "SETEndUserChanel",
            "CreatedBY": this.state.userid,
            "SubGroupMasterId": this.state.partyroomid,
            "SGName":this.state.roomname, //"test",
            "Comment": "gggg",
            "NoOfSeat":9,
            //"image":"uu.jpg"
            "jsonpath":""
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(BASE_URL+"user/details/SETEndUserPartyRoomAPI", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result)
                if(result.status==200){
                    AsyncStorage.setItem('chatroom',this.state.roomname);
                    AsyncStorage.setItem('chatroomid',result.data[0].UniqueID);
                    //AsyncStorage.setItem('chatroom',this.state.roomname);
                    alert(result.msg)
                    //this.props.navigation.navigate('Live')
                    this.props.navigation.navigate('Searchchatroom',{chatroom:this.state.roomname,chatroomid:result.data[0].UniqueID })
                }
            })
            .catch(error => console.log('error', error));
    }

    render() {
        return (
            <View style={{ flex: 1 }}>

                <ImageBackground
                    source={require('../../../assets/images/splash1.png')}
                    style={{ height: Dimensions.get('window').height, width: Dimensions.get('window').width }}
                //blurRadius={this.state.showsettingmodal ? 4 : 0}
                >

                    <View style={{ flex: 0.9 }}>
                        <ScrollView>
                            <TouchableOpacity
                                style={{ alignItems: 'flex-start', justifyContent: 'center', marginRight: 20, marginTop: 30, marginLeft: 20 }}
                                // onPress={() => this.setState({ friendsselected: !this.state.friendsselected, followingselected: false,followerselected:false,channelselected:false })}
                                onPress={() => this.props.navigation.goBack()}
                            >
                                <Ionicons name="arrow-back" size={25} color={'#fff'} />
                            </TouchableOpacity>


                            <View style={{ marginTop: Dimensions.get('window').height / 2-100, marginLeft: 20 }}>
                                <TouchableOpacity
                                    style={{ height: 30, width: 80, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderColor: '#fff', borderWidth: 1 }}
                                    //onPress={() => this.setState({ publicroom: !this.state.publicroom })}
                                >
                                    {/* {this.state.publicroom ? */}
                                        <View style={{ flexDirection: 'row' }}>
                                            <MaterialCommunityIcons name="lock-open" size={15} color={'#fff'} />
                                            <Text style={{ fontSize: 12, color: '#fff', marginLeft: 5 }}>
                                                Public
                                            </Text>
                                        </View>
                                    {/* //     :
                                    //     <View style={{ flexDirection: 'row' }}>
                                    //         <MaterialCommunityIcons name="lock" size={15} color={'#fff'} />
                                    //         <Text style={{ fontSize: 12, color: '#fff', marginLeft: 5 }}>
                                    //             Private
                                    //         </Text>
                                    //     </View>
                                    // } */}
                                </TouchableOpacity>
                            </View>

                            <View style={{ marginTop: 20, alignItems: 'center', justifyContent: 'center' }}>
                                <TextInput
                                    placeholder="please enter a room name"
                                    placeholderTextColor="#fff"
                                    value={this.state.roomname}
                                    onChangeText={async(text) => await this.setState({ roomname: text })}
                                    style={{ height: 40, width: Dimensions.get('window').width - 30, borderBottomColor: '#fff', borderBottomWidth: 1,color:'#fff',fontSize:16 }}
                                />
                            </View>

                            <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 30 }}>
                                <TouchableOpacity
                                    style={{ height: 50, width: 50, borderRadius: 25, borderWidth: 1, borderColor: '#fff', alignItems: 'center', justifyContent: 'center' }}
                                onPress={()=>this.createpartyroom()}
                                >
                                    <Text style={{ fontSize: 18, color: '#fff', fontWeight: 'bold' }}>
                                        GO
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{ alignItems: 'center', marginTop: 50 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                    <TouchableOpacity
                                        style={{ alignItems: 'center', justifyContent: 'center', marginRight: 30 }}
                                        onPress={() => this.setState({ partyselected: true, multivideoselected: false, })}
                                    >
                                        {this.state.partyselected ?
                                            <View>
                                                <Text style={styles.livetextselected}>
                                                    Party
                                                </Text>
                                                {/* <LinearGradient
                                                start={{ x: 0, y: 0.5 }}
                                                end={{ x: 1, y: 0.5 }}
                                                colors={['#01007E', '#FD01FC',]}
                                                style={{ height: 3, width: 15, alignSelf: 'center' }}
                                            >
                                            </LinearGradient> */}
                                                <View style={{ height: 3, width: 10, alignSelf: 'center', backgroundColor: '#fff' }}>
                                                </View>
                                            </View>
                                            :
                                            <Text style={styles.livetext}>
                                                Party
                                            </Text>
                                        }

                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{ alignItems: 'center', justifyContent: 'center', }}
                                        //  onPress={() =>setLiveselected(false),setPartyselected(true)} partyrecommendselected: true
                                        onPress={() => this.setState({ partyselected: false, multivideoselected: true, })}
                                    >
                                        {this.state.multivideoselected ?
                                            <View>
                                                <Text style={styles.livetextselected}>
                                                    Multi video
                                                </Text>
                                                {/* <LinearGradient
                                                start={{ x: 0, y: 0.5 }}
                                                end={{ x: 1, y: 0.5 }}
                                                colors={['#01007E', '#FD01FC',]}
                                                style={{ height: 3, width: 15, alignSelf: 'center', }}
                                            >
                                            </LinearGradient> */}
                                                <View style={{ height: 3, width: 10, alignSelf: 'center', backgroundColor: '#fff' }}>
                                                </View>
                                            </View>
                                            :
                                            <Text style={styles.livetext}>
                                                Multi video
                                            </Text>
                                        }
                                    </TouchableOpacity>
                                </View>
                            </View>

                        </ScrollView>
                    </View>

                </ImageBackground>



            </View >
        )
    }
}

const styles = StyleSheet.create({
    searchtext: {
        fontFamily: 'Raleway',
        fontWeight: '600',
        fontSize: 16,
        color: '#ffffff'
    },
    livetextselected: {
        fontFamily: 'Raleway',
        fontWeight: 'bold',
        fontSize: 20,
        color: '#fff'
    },
    livetext: {
        fontFamily: 'Raleway',
        fontWeight: '600',
        fontSize: 20,
        color: '#4D4D4D'
    },
    chattext: {
        fontFamily: 'Raleway',
        fontWeight: '700',
        fontSize: 16,
        color: '#ffffff',
        //marginLeft:22,
        //textAlign:'center'
    },
    diamond: {
        fontFamily: 'Raleway',
        fontWeight: '500',
        fontSize: 12,
        color: '#ffffff'
    },
    username: {
        fontFamily: 'Raleway',
        fontWeight: '500',
        fontSize: 14,
        color: '#ffffff',
    },
    profile: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignSelf: 'center',
        zIndex: 1,
        //backgroundColor: '#ffffff'
    },
    chatprofile: {
        width: 50,
        height: 50,
        borderRadius: 25,
        // alignSelf: 'center',
        zIndex: 1,
        borderWidth: 1,
        borderColor: '#ffffff',
        //backgroundColor: '#ffffff',
    },
    onlinetext: {
        fontFamily: 'Raleway',
        fontWeight: '600',
        fontSize: 12,
        color: '#ffffff',
        // textAlign:'center',
    },
    chatusers: {
        height: 83,
        width: Dimensions.get('window').width / 4 - 10,
        borderTopLeftRadius: 20,
        borderBottomRightRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        marginTop: -35,
        alignItems: 'center',
        //justifyContent:'center'
    },
    chatview: {
        height: 100,
        width: Dimensions.get('window').width - 60,
        borderTopRightRadius: 45,
        borderBottomLeftRadius: 45,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginTop: -35,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ffffff',
        marginLeft: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    footerview: {
        position: 'absolute',
        height: 85,
        left: 0,
        width: Dimensions.get('window').width,
        backgroundColor: 'rgba(39, 39, 39, 0.5)',
        bottom: 0,
        //flexDirection: 'row', 
        justifyContent: 'center',
        //alignItems: 'center', 
    },
    sendmessageview: {
        height: 42,
        width: Dimensions.get('window').width / 2,
        backgroundColor: 'rgba(9, 9, 9, 0.6)',
        borderRadius: 20,
        fontSize: 16,
        color: '#ffffff',
        paddingLeft: 15,
    },
    profileimage: {
        width: 50,
        height: 50,
        borderRadius: 18,
    },
    username1: {
        fontWeight: '600',
        fontFamily: 'Raleway',
        fontSize: 16,
        color: '#000000'
    },
    id: {
        fontWeight: '500',
        fontFamily: 'Raleway',
        fontSize: 12,
        color: '#888888'
    },
    billboard: {
        fontWeight: '600',
        fontFamily: 'Raleway',
        fontSize: 16,
        color: '#202020'
    },
    billboardview: {
        height: 60,
        width: Dimensions.get('window').width - 30,
        borderRadius: 20,
        backgroundColor: '#ffffff',
        shadowColor: '#000000',
        shadowOpacity: 0.1,
        elevation: 10,
        justifyContent: 'center',
        marginTop: 10,
    },
    blurView: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    },
    recommendview: {
        height: 170,
        width: Dimensions.get('window').width / 2 - 35,
        backgroundColor: '#C4C4C4',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    recommendprofile: {
        height: 60,
        width: 60,
        borderRadius: 20,
        borderColor: '#ffffff',
        borderWidth: 1,
    },
    recommendusers: {
        width: 55,
        height: 22,
        borderRadius: 20,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    roomname: {
        fontFamily: 'Raleway',
        fontSize: 14,
        color: '#ffffff',
        fontWeight: '400',
    },
    usercount: {
        fontFamily: 'Raleway',
        fontSize: 14,
        color: '#D8382B',
        fontWeight: '400',
    }



})

