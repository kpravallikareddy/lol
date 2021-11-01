import React, { Component } from 'react';
import { View, BackHandler, Image, Text, Platform, Dimensions, StyleSheet, TouchableOpacity, ScrollView, ImageBackground, FlatList, TextInput, Modal, Button } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import LottieView from 'lottie-react-native';
import { BlurView } from '@react-native-community/blur';
import { WebView } from 'react-native-webview';
import { Shadow } from 'react-native-neomorph-shadows';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EmojiSelector, { Categories } from "react-native-emoji-selector";
import EmojiBoard from 'react-native-emoji-board'
import { BASE_URL } from '../../api';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import { Icon } from 'react-native-gradient-icon';
//import Share from 'react-native-share';
//import AudioRecorderPlayer from 'react-native-audio-recorder-player';
//import RNFetchBlob from 'rn-fetch-blob';

//const audioRecorderPlayer = new AudioRecorderPlayer();

export default class Searchchatroom extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showsettingmodal: false,
            result: '',
            showoverflowmenu: false,
            showchatroomoptions: false,
            mute: true,
            showwebview: false,
            showcardview: false,
            showluckywheelmodal: false,
            winnerValue: '',
            winnerIndex: '',
            userid: '',
            subgroupmasterid: '',
            message: '',
            userid1: '',
            emojiselected: false,
            recordSecs: 0,
            recordTime: '00:00:00',
            currentPositionSec: 0,
            currentDurationSec: 0,
            playTime: '00:00:00',
            duration: '00:00:00',
            chatroom: this.props.route.params.chatroom,
            chatroomid: this.props.route.params.chatroomid,
            broadcastmess: [],
            emoji: '',
            showloader: false,
            showgiftcardmodal: false,
            giftcard: [],
            showdiamonddropdown: false,
            buydiamondmodal: false,
            mydiamondvalue: 0,
            diamondvalues: [],
        }

        // this.audioRecorderPlayer = new AudioRecorderPlayer();
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

        // await AsyncStorage.getItem('chatroom').then((chatroom) => {
        //     if (chatroom) {
        //         this.setState({ chatroom: chatroom });
        //     }
        //     else {
        //         console.log('no chatroomname')
        //     }
        // });
        // await AsyncStorage.getItem('chatroomid').then((chatroomid) => {
        //     if (chatroomid) {
        //         this.setState({ chatroomid: chatroomid });
        //     }
        //     else {
        //         console.log('no chatroomid')
        //     }
        // });

        console.log('userid----', this.state.userid)
        console.log('chatroom----', this.state.chatroom)
        console.log('chatroomid----', this.state.chatroomid)

        await this.receivebroadcast();
        await this.getdiamondvalues();
        await this.getgiftcards();
    }

    //recordaudio=()=>{
    //         onStartRecord = async () => {
    //             const result = await this.audioRecorderPlayer.startRecorder();
    //             this.audioRecorderPlayer.addRecordBackListener((e) => {
    //               this.setState({
    //                 recordSecs: e.currentPosition,
    //                 recordTime: this.audioRecorderPlayer.mmssss(
    //                   Math.floor(e.currentPosition),
    //                 ),
    //               });
    //               return;
    //             });
    //             console.log('audio record file ------',result);
    //           };
    //    // }

    //    onStopRecord = async () => {
    //     const result = await this.audioRecorderPlayer.stopRecorder();
    //     this.audioRecorderPlayer.removeRecordBackListener();
    //     this.setState({
    //       recordSecs: 0,
    //     });
    //     console.log('onstop record -----',result);
    //   };

    //   onStartPlay = async () => {
    //     console.log('onStartPlay');
    //     const msg = await this.audioRecorderPlayer.startPlayer();
    //     console.log(msg);
    //     this.audioRecorderPlayer.addPlayBackListener((e) => {
    //       this.setState({
    //         currentPositionSec: e.currentPosition,
    //         currentDurationSec: e.duration,
    //         playTime: this.audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)),
    //         duration: this.audioRecorderPlayer.mmssss(Math.floor(e.duration)),
    //       });
    //       return;
    //     });
    //   };

    //   onPausePlay = async () => {
    //     await this.audioRecorderPlayer.pausePlayer();
    //   };

    //   onStopPlay = async () => {
    //     console.log('onStopPlay');
    //     this.audioRecorderPlayer.stopPlayer();
    //     this.audioRecorderPlayer.removePlayBackListener();
    //   };

    sendmessage = () => {
        console.log('inside sendmessage')
        console.log('message----', this.state.message)
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "SubGroupMasterId": 21,
            "UserId": this.state.userid,
            "CommuncationUserId": 66,
            "Comment": null,
            "SendMessage": this.state.message        //"Helloooooooooooooooooooooo"
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(BASE_URL + "user/setAllusercommuncation/Message", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result)
                if (result.status == 200) {
                    alert(result.msg)
                    this.setState({ message: '' })
                }
            })
            .catch(error => console.log('error', error));
    }

    handleKeyPress = ({ nativeEvent: { key: keyValue } }) => {
        console.log(keyValue);
        if (keyValue === 'Enter') //|| keyValue ==' '
        {
            // console.log("enter");
            this.postbroadcast();
        }
    }

    getdiamondvalues = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "querytype": "filemgmt",
            "type": "diamond"
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(BASE_URL + "user/details/getdiamond", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('diamond values----', result)
                this.setState({ diamondvalues: [] })
                if (result.status == 200 && result.data.length == '') {
                    alert('No data found')
                }
                else if (result.status == 200 && result.data.length > 0) {
                    for (let i = 0; i < result.data.length; i++) {
                        this.state.diamondvalues.push(result.data[i])
                    }
                }
                else {
                    alert(result.msg)
                }
            })
            .catch(error => console.log('error', error));
    }


    getgiftcards = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "querytype": "filemgmt",
            "type": "gift"
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(BASE_URL + "user/details/getgift", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('gift cards-----', result)
                this.setState({ giftcard: [] })
                if (result.status == 200 && result.data.length == '') {
                    alert('No data found')
                }
                else if (result.status == 200 && result.data.length > 0) {
                    for (let i = 0; i < result.data.length; i++) {
                        this.state.giftcard.push(result.data[i])
                    }
                }
                else {
                    alert(result.msg)
                }
            })
            .catch(error => console.log('error', error));
    }

    postbroadcast = () => {
        console.log('inside postbroadcast')
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "querytype": "sendMessage",
            "senderID": this.state.userid,
            "SubGroupMasterId": 1,
            "userSubGroupMasterId": this.state.chatroomid,            //"ed6820cc-26e7-11ec-82ac-8c8caa8b5606",
            "Message": this.state.message,    //+ this.state.emoji,
            "ParentMessageIDForForward": 0,
            "documentID": 0
        });

        console.log('raw ----', raw)

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(BASE_URL + "user/details/sendMessage", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('broadcast-----', result)
                if (result.status == 200) {
                    //alert(result.msg)
                    this.setState({ message: '' })
                    this.receivebroadcast();
                }
            })
            .catch(error => console.log('error', error));
    }


    receivebroadcast = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "UserId": this.state.userid,
            "groupID": 0,
            "userSubGroupMasterId": this.state.chatroomid,
            "querytype": "receiveMessage"
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(BASE_URL + "user/details/receiveMessage", requestOptions)
            .then(response => response.json())
            .then(result => {
                this.setState({ broadcastmess: [] });
                console.log('receive broadcast-----', result)
                if (result.status == 200 && result.data == '') {
                    alert('No messages found')
                    this.setState({ showloader: true })
                }
                else if (result.status == 200 && result.data.length > 0) {
                    for (let i = 0; i < result.data.length; i++) {
                        this.state.broadcastmess.push(result.data[i])
                    }
                    this.setState({ showloader: true })
                }
                else {
                    alert(result.msg)
                    this.setState({ showloader: true })
                }
            })
            .catch(error => console.log('error', error));
    }

    renderusers = () => {
        return (
            <View>
                <View style={{}}>
                    <Image
                        source={require('../../../assets/images/chartroombg.jpg')}
                        style={styles.profile}
                    />
                </View>
                <View style={styles.chatusers}>
                    <View style={{ marginTop: 35, alignItems: 'center' }}>
                        <Text style={styles.username}>
                            {/* Username */}
                            {this.state.chatroom}
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <View>
                                <Image
                                    source={require('../../../assets/images/diamond1.png')}
                                    style={{ height: 10, width: 10, marginRight: 5 }}
                                />
                            </View>
                            <Text style={styles.diamond}>
                                0
                            </Text>
                        </View>
                    </View>
                </View>

            </View>
        )
    }

    renderchats = () => {
        return this.state.broadcastmess.map((item) => {
            return (
                <View style={{ alignItems: 'center' }}>
                    <View style={{}}>
                        <View style={{}}>
                            <Image
                                source={require('../../../assets/images/chartroombg.jpg')}
                                style={styles.chatprofile}
                            />
                        </View>
                        <View style={styles.chatview}>
                            <View style={{ marginLeft: 30, marginRight: 10, marginTop: 5 }}>
                                <Text style={styles.username}>
                                    {/* {this.state.message} */}
                                    {item.Message}
                                    {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sollicitudin mauris, condimentum hac ut feugiat tellus, vestibulum enim consequat. */}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            )
        })
    }

    renderfooterview = () => {
        return (

            <View style={styles.footerview}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                    <TextInput
                        placeholder='Send a message'
                        placeholderTextColor='#ffffff'
                        style={styles.sendmessageview}
                        value={this.state.message}
                        //onKeyPress={this.onKeyPress}
                        //onSubmitEditing={this.sendmessage()}
                        //onEndEditing={this.sendmessage()}
                        //blurOnSubmit={false}
                        multiline
                        //returnKeyType="done"
                        onKeyPress={this.handleKeyPress}    //this.postbroadcast()
                        onChangeText={(text) => this.setState({ message: text })}   //,()=>this.sendmessage()
                    />
                    <View style={{ position: 'absolute', marginLeft: Dimensions.get('window').width / 2 - 30, marginTop: 10 }}>
                        <TouchableOpacity
                            onPress={() => this.setState({ emojiselected: !this.state.emojiselected })}
                        >
                            <Feather name="smile" size={20} color={'#ffffff'} />
                        </TouchableOpacity>
                    </View>

                    <View>
                        {this.state.mute ?
                            <TouchableOpacity
                                onPress={() => this.setState({ mute: !this.state.mute }, () => this.onStartRecord())}
                            >
                                <Ionicons name="mic-off-sharp" size={25} color={'#ffffff'} />
                            </TouchableOpacity>
                            :
                            <TouchableOpacity
                                onPress={() => this.setState({ mute: !this.state.mute }, () => this.onStopRecord())}
                            >
                                <Ionicons name="mic-sharp" size={25} color={'#ffffff'} />
                            </TouchableOpacity>
                        }
                    </View>

                    <View >
                        <TouchableOpacity
                            style={{ flexDirection: 'row' }}
                            onPress={() => this.setState({ showchatroomoptions: true })}
                        >
                            <Image
                                source={require('../../../assets/images/diamond.png')}
                                style={{ height: 20, width: 20, }}
                            />
                            <View style={{ height: 10, width: 10, borderRadius: 5, backgroundColor: '#FF002E', marginLeft: -10, marginTop: -5 }}>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View>
                        <TouchableOpacity
                            onPress={() => this.setState({ showchatroomoptions: false })}
                        >
                            <Image
                                source={require('../../../assets/images/stone.png')}
                                style={{ height: 20, width: 20, }}
                            />
                        </TouchableOpacity>
                    </View>
                    <View>
                        <TouchableOpacity
                            onPress={() => this.setState({ showchatroomoptions: false, showgiftcardmodal: true, })}
                        >
                            <Image
                                source={require('../../../assets/images/gift.png')}
                                style={{ height: 20, width: 20, }}
                            />
                        </TouchableOpacity>
                        <View>
                            <Modal
                                animationType="slide"
                                transparent={true}
                                onRequestClose={() => this.setState({ showgiftcardmodal: false })}
                                visible={this.state.showgiftcardmodal}
                            >
                                <View
                                    style={{
                                        flex: 1,
                                        justifyContent: 'flex-end',
                                        //alignItems: 'flex-end'
                                    }}
                                >
                                    <View style={{
                                        height: Dimensions.get('window').height / 3,
                                        width: Dimensions.get('window').width,
                                        //borderTopLeftRadius: 30,
                                        //borderTopRightRadius: 30,
                                        //backgroundColor: '#ffffff',
                                        backgroundColor:'rgba(39, 39, 39, 1)'
                                    }}>
                                        <ScrollView>
                                            <TouchableOpacity
                                                style={{ alignItems: 'flex-end', marginRight: 10, marginTop: 5 }}
                                                onPress={() => this.setState({ showgiftcardmodal: false })}
                                            >
                                                <AntDesign name="close" size={15} color={"#fff"} />
                                            </TouchableOpacity>
                                            <FlatList
                                                columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 0, marginTop: 0,flex:1 }}
                                                numColumns={4}
                                                //showPagination
                                                keyExtractor={(item, index) => index}
                                                data={this.state.giftcard}
                                                renderItem={({ item, index }) => {
                                                    return (
                                                        <View style={{ flex: 1, width: Dimensions.get('window').width, marginTop: 0 }}>
                                                            {/* justifyContent: 'space-evenly', flexDirection: 'row',  */}
                                                            <TouchableOpacity>
                                                            <View style={{ height: 100, alignItems: 'center', justifyContent: 'center', borderRightColor: '#000', borderRightWidth: 1, borderBottomColor: '#000', borderBottomWidth: 1, width: Dimensions.get('window').width / 4, flex:1/4}}>
                                                                
                                                                <Image
                                                                    source={{ uri: item.image }}
                                                                    style={{height:40,width:40}}
                                                                />
                                                                <Text style={{fontSize:12,color:'#fff'}}>
                                                                    {item.FileName}
                                                                </Text>
                                                                <View style={{flexDirection:'row',}}>
                                                                    <View style={{ alignItems: 'center', justifyContent: 'center', marginRight: 5 }}>
                                                                        <MaterialCommunityIcons name="diamond" size={12} color={"#fff"} />
                                                                    </View>
                                                                    <Text style={{fontSize:14,color:'#fff'}}>
                                                                        {item.cost}
                                                                    </Text>
                                                                </View>
                                                            </View>
                                                            </TouchableOpacity>
                                                        </View>
                                                    )
                                                }}
                                            />
                                        </ScrollView>
                                        <View style={{ height: 40, width: Dimensions.get('window').width }}>
                                            <View style={{ flexDirection: 'row', marginLeft: 15, marginRight: 15, marginTop: 10, justifyContent: 'space-between' }}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <TouchableOpacity
                                                        style={{ marginRight: 5 }}
                                                        onPress={() => this.setState({ buydiamondmodal: true, showdiamonddropdown: false, })}
                                                    >
                                                        <MaterialCommunityIcons name="diamond" size={20} color={"#daa520"} />
                                                    </TouchableOpacity>
                                                    <View>
                                                        <Modal
                                                            animationType="slide"
                                                            transparent={true}
                                                            onRequestClose={() => this.setState({ buydiamondmodal: false })}
                                                            visible={this.state.buydiamondmodal}
                                                        >
                                                            <View
                                                                style={{
                                                                    flex: 1,
                                                                    justifyContent: 'center',
                                                                    alignItems: 'center',
                                                                    zIndex: 1
                                                                }}
                                                            >

                                                                <View style={{
                                                                    height: Dimensions.get('window').height / 2,
                                                                    width: Dimensions.get('window').width - 30,
                                                                    //borderTopLeftRadius: 30,
                                                                    //borderTopRightRadius: 30,
                                                                    //backgroundColor: '#ffffff',
                                                                    borderRadius: 5,
                                                                    backgroundColor:'rgba(39, 39, 39, 1)'
                                                                }}>

                                                                    <View style={{ flexDirection: 'row', marginRight: 10, marginTop: 10 }}>
                                                                        <View style={{ alignItems: 'center', justifyContent: 'center', width: Dimensions.get('window').width - 50 }}>
                                                                            <Text style={{ fontSize: 18, textAlign: 'center',color:'#fff' }}>
                                                                                Buy Diamond
                                                                            </Text>
                                                                        </View>
                                                                        <TouchableOpacity
                                                                            style={{ alignItems: 'flex-end' }}
                                                                            onPress={() => this.setState({ buydiamondmodal: false })}
                                                                        >
                                                                            <AntDesign name="close" size={10} color={"#fff"} />
                                                                        </TouchableOpacity>
                                                                    </View>
                                                                    <View style={{ height: 35, width: Dimensions.get('window').width - 30, backgroundColor: '#000', marginTop: 10, justifyContent: 'center' }}>
                                                                        <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                                                                            <Text style={{ fontSize: 14, color: '#fff', marginRight: 5 }}>
                                                                                My Diamond:
                                                                            </Text>
                                                                            <View style={{ alignItems: 'center', justifyContent: 'center', marginRight: 5 }}>
                                                                                <MaterialCommunityIcons name="diamond" size={15} color={"#daa520"} />
                                                                            </View>
                                                                            <Text style={{ fontSize: 14, color: '#fff' }}>
                                                                                {this.state.mydiamondvalue}
                                                                            </Text>

                                                                        </View>
                                                                    </View>
                                                                    {this.state.diamondvalues.map((item) => {
                                                                        return (
                                                                            <View style={{ height: 50, width: Dimensions.get('window').width - 30, justifyContent: 'center', }}>
                                                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginRight: 10, marginLeft: 20, alignItems: 'center' }}>
                                                                                    <View style={{ alignItems: 'center', justifyContent: 'center', }}>
                                                                                        <MaterialCommunityIcons name="diamond" size={25} color={"#daa520"} />
                                                                                    </View>

                                                                                    <View>
                                                                                        <Text style={{ fontSize: 22, color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>
                                                                                            {/* 40 */}
                                                                                            {item.diamond}
                                                                                        </Text>
                                                                                    </View>
                                                                                    <View>
                                                                                        <Text style={{ fontSize: 16, color: '#fff', fontWeight: 'bold' }}>
                                                                                            +
                                                                                        </Text>
                                                                                    </View>
                                                                                    <View>
                                                                                        <Icon name="burst" size={40} type="foundation"
                                                                                            useAngle={true}
                                                                                            angle={180}
                                                                                            colors={[
                                                                                                { color: "#FEA20C", offset: "1", opacity: "1" },
                                                                                                { color: "#FF5C00", offset: "0", opacity: "1" },
                                                                                            ]} />
                                                                                        <View style={{ position: 'absolute', top: 12, left: 12 }}>
                                                                                            <Text style={{ fontSize: 12, color: '#fff' }}>
                                                                                                {/* 10 */}
                                                                                                {item.freediamond}
                                                                                            </Text>
                                                                                        </View>
                                                                                    </View>
                                                                                    <TouchableOpacity style={{ height: 30, width: 100, borderRadius: 20, borderColor: '#FEA20C', alignItems: 'center', justifyContent: 'center', borderWidth: 1 }}>
                                                                                        <Text style={{ color: '#FEA20C', fontSize: 16 }}>
                                                                                            {/* INR79 */}
                                                                                            INR{item.cost}
                                                                                        </Text>
                                                                                    </TouchableOpacity>
                                                                                </View>
                                                                            </View>
                                                                        )
                                                                    })}
                                                                </View>

                                                            </View>
                                                        </Modal>
                                                    </View>
                                                    <Text style={{ marginRight: 5, fontSize: 16, color:'#fff' }}>
                                                        {this.state.mydiamondvalue}
                                                    </Text>
                                                    <TouchableOpacity style={{ marginRight: 5 }}>
                                                        <AntDesign name="right" size={20} color={"#fff"} />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={{ height: 25, width: 70, borderRadius: 20, backgroundColor: '#daa520', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Text style={{ color: '#fff' }}>
                                                            Join
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <TouchableOpacity
                                                        style={{ height: 25, width: 50, backgroundColor: '#DDD', justifyContent: 'center', borderRadius: 5, marginRight: 10 }}
                                                        onPress={() => this.setState({ showdiamonddropdown: true })}
                                                    >
                                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 5, marginRight: 5 }}>
                                                            <Text>
                                                                1
                                                            </Text>
                                                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                                                {this.state.showdiamonddropdown ?
                                                                    <AntDesign name="up" size={15} color={"#000"} />
                                                                    :
                                                                    <AntDesign name="down" size={15} color={"#000"} />
                                                                }
                                                            </View>
                                                        </View>
                                                    </TouchableOpacity>

                                                    <LinearGradient
                                                        start={{ x: 0, y: 0.5 }}
                                                        end={{ x: 1, y: 0.5 }}
                                                        //useAngle={true}
                                                        //angle={180}
                                                        colors={['#FF5C00', '#FEA20C']}
                                                        style={{
                                                            height: 25,
                                                            width: 50,
                                                            borderRadius: 5,
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                        }}
                                                    >
                                                        <TouchableOpacity>
                                                            <Text style={{ color: '#fff' }}>
                                                                SEND
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </LinearGradient>
                                                </View>
                                            </View>
                                        </View>
                                    </View>

                                </View>

                            </Modal>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    onFinished = (winner) => {
        console.log(winner)
    }

    chatroomdropdown = () => {
        return (
            <View style={{ height: Dimensions.get('window').height / 3, width: Dimensions.get('window').width / 2, backgroundColor: '#ffffff', borderBottomLeftRadius: 0, borderBottomRightRadius: 0, marginTop: 10, marginLeft: Dimensions.get('window').width / 2, marginBottom: 55 }}>
                <ScrollView>
                    <TouchableOpacity
                        style={{ height: 40, width: Dimensions.get('window').width / 2, justifyContent: 'center', alignItems: 'center', borderBottomColor: '#EEEEEE', borderBottomWidth: 1 }}
                    >
                        <Text style={{ fontSize: 16, fontFamily: 'Raleway', color: '#202020', marginRight: 15 }}>
                            Theme
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{ height: 40, width: Dimensions.get('window').width / 2, justifyContent: 'center', alignItems: 'center', borderBottomColor: '#EEEEEE', borderBottomWidth: 1 }}
                    >
                        <Text style={{ fontSize: 16, fontFamily: 'Raleway', color: '#202020', marginRight: 15 }}>
                            Music Player
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{ height: 40, width: Dimensions.get('window').width / 2, justifyContent: 'center', alignItems: 'center', borderBottomColor: '#EEEEEE', borderBottomWidth: 1 }}
                    >
                        <Text style={{ fontSize: 16, fontFamily: 'Raleway', color: '#202020', marginRight: 15 }}>
                            Calculator
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{ height: 40, width: Dimensions.get('window').width / 2, justifyContent: 'center', alignItems: 'center', borderBottomColor: '#EEEEEE', borderBottomWidth: 1 }}
                    >
                        <Text style={{ fontSize: 16, fontFamily: 'Raleway', color: '#202020', marginRight: 15 }}>
                            Suitcase
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{ height: 40, width: Dimensions.get('window').width / 2, justifyContent: 'center', alignItems: 'center', borderBottomColor: '#EEEEEE', borderBottomWidth: 1 }}
                    >
                        <Text style={{ fontSize: 16, fontFamily: 'Raleway', color: '#202020', marginRight: 15 }}>
                            Diamond Hunts
                        </Text>
                    </TouchableOpacity>

                    {/* <TouchableOpacity
                        style={{ height: 40, width: Dimensions.get('window').width / 2, justifyContent: 'center', alignItems: 'center', borderBottomColor: '#EEEEEE', borderBottomWidth: 1 }}
                        onPress={() => this.setState({ showcardview: true })}
                    >
                        <Text style={{ fontSize: 16, fontFamily: 'Raleway', color: '#202020', marginRight: 15 }}>
                            Card game
                        </Text>
                    </TouchableOpacity> */}

                    <TouchableOpacity
                        style={{ height: 40, width: Dimensions.get('window').width / 2, justifyContent: 'center', alignItems: 'center', borderBottomColor: '#EEEEEE', borderBottomWidth: 1 }}
                    //onPress={() => this.setState({ showluckywheelmodal: true })}
                    // onPress={() =>this.props.navigation.navigate('Luckywheel')}
                    >
                        <Text style={{ fontSize: 16, fontFamily: 'Raleway', color: '#202020', marginRight: 15 }}>
                            Lucky wheel
                        </Text>
                    </TouchableOpacity>
                    {/* {this.state.showluckywheelmodal ?
                        this.renderluckywheel()
                        : null} */}

                    <TouchableOpacity
                        style={{ height: 40, width: Dimensions.get('window').width / 2, justifyContent: 'center', alignItems: 'center', borderBottomColor: '#EEEEEE', borderBottomWidth: 1 }}
                        onPress={() => this.setState({ showwebview: true })}
                    >
                        <Text style={{ fontSize: 16, fontFamily: 'Raleway', color: '#202020', marginRight: 15 }}>
                            Card game
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{ height: 40, width: Dimensions.get('window').width / 2, justifyContent: 'center', alignItems: 'center', borderBottomColor: '#EEEEEE', borderBottomWidth: 1 }}
                    >
                        <Text style={{ fontSize: 16, fontFamily: 'Raleway', color: '#202020', marginRight: 15 }}>
                            Party Mode
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{ height: 40, width: Dimensions.get('window').width / 2, justifyContent: 'center', alignItems: 'center', borderBottomColor: '#EEEEEE', borderBottomWidth: 1 }}
                    >
                        <Text style={{ fontSize: 16, fontFamily: 'Raleway', color: '#202020', marginRight: 15 }}>
                            Coming soon
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        )
    }

    renderluckywheel = () => {
        return (
            <View>
                <Modal
                    animationType="fade"
                    transparent={true}
                    onRequestClose={() => this.setState({ showluckywheelmodal: false })}
                    visible={this.state.showluckywheelmodal}
                >
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <Text>
                            This is lucky wheel
                        </Text>
                    </View>
                </Modal>
            </View>
        )
    }


    shareMultipleImages = async () => {
        const shareOptions = {
            title: 'Invite to join the channel',
            failOnCancel: false,
            urls: ['https://play.google.com/store/apps/details?id=com.romegamart'], //[this.state.url],
        };

        // If you want, you can use a try catch, to parse
        // the share response. If the user cancels, etc.
        try {
            const ShareResponse = await Share.open(shareOptions);
            this.setState(JSON.stringify({ result: ShareResponse }));
        } catch (error) {
            console.log('Error =>', error);
            this.setState({ result: 'error: '.concat(getErrorString(error)) });
        }
    };


    receivemessages = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "querytype": "receivemessage",
            "UserId": this.state.userid
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("http://lolapi.lolapp.co.in:3000/user/details/receivemess", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result)
            })
            .catch(error => console.log('error', error));
    }

    onClick = emoji => {
        console.log(emoji);
    };

    render() {
        const participants = [
            '%10',
            '%20',
            '%30',
            '%40',
            '%50',
            '%60',
            '%70',
            '%90',
            'FREE',
        ];
        const wheelOptions = {
            rewards: participants,
            knobSize: 50,
            borderWidth: 5,
            borderColor: '#000',
            innerRadius: 50,
            duration: 4000,
            backgroundColor: 'transparent',
            textAngle: 'horizontal',
            knobSource: require('../../../assets/images/knob.png'),
            getWinner: (value, index) => {
                this.setState({ winnerValue: value, winnerIndex: index });
            },
            onRef: ref => (this.child = ref),
        };

        return (
            <View style={{ flex: 1 }}>
                {this.state.showwebview ?
                    <View style={{ flex: 1 }}>
                        <ScrollView horizontal={true}>
                            <WebView
                                style={{ height: Dimensions.get('window').height, width: Dimensions.get('window').width }}
                                // source={{uri:"http://192.168.20.8:3000/play"}}
                                // source={{uri:"https://www.king.com/game/candycrush"}}
                                // source={require("./resources/index.html")}
                                //source={require("../../../assets/resources/index.html")}
                                //source={{uri:"https://aykutsarac.github.io/react-quiz/"}}
                                source={{ uri: "http://gametown.herokuapp.com/home" }}
                            />
                        </ScrollView>
                    </View>
                    :

                    <ImageBackground
                        source={require('../../../assets/images/chartroombg.jpg')}
                        style={{ height: Dimensions.get('window').height, width: Dimensions.get('window').width }}
                        blurRadius={this.state.showsettingmodal ? 4 : 0}
                    >

                        <View style={{ flex: 0.9 }}>
                            <ScrollView>
                                {this.state.emojiselected ?
                                    <EmojiSelector
                                        category={Categories.symbols}
                                        onEmojiSelected={(emoji) => this.setState({ message: emoji, emojiselected: false })}     //console.log(emoji) , () => this.postbroadcast()
                                    />
                                    // <EmojiBoard 
                                    // showBoard={this.state.emojiselected} 
                                    // onClick={this.onClick}
                                    // />
                                    :
                                    null
                                }
                                <View style={{
                                    height: 390,
                                    width: Dimensions.get('window').width,
                                    borderBottomLeftRadius: 30,
                                    borderBottomRightRadius: 30,
                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',

                                }}>
                                    <View style={{ flexDirection: 'row', marginTop: 30, marginLeft: 10, marginRight: 10, justifyContent: 'space-between' }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <TouchableOpacity
                                                style={{ alignItems: 'center', justifyContent: 'center', marginRight: 20, }}
                                                onPress={() => this.props.navigation.goBack()}

                                            >
                                                <Ionicons name="arrow-back" size={25} color={'#ffffff'} />
                                            </TouchableOpacity>
                                            <View>
                                                <Text style={styles.searchtext}>
                                                    {/* Chat Room Name */}
                                                    {this.state.chatroom}
                                                </Text>
                                                <Text style={styles.onlinetext}>
                                                    Online: 1
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <TouchableOpacity
                                                style={{ alignItems: 'center', justifyContent: 'center', marginRight: 10 }}
                                                onPress={() => this.shareMultipleImages()}
                                            >
                                                <FontAwesome5 name="share" size={25} color={'#ffffff'} />

                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={{ alignItems: 'center', justifyContent: 'center', marginRight: 10 }}
                                                onPress={() => this.setState({ showsettingmodal: true })}
                                            >
                                                <Ionicons name="settings-sharp" size={25} color={'#ffffff'} />
                                                {/* color={'#ffffff'} */}
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={{ alignItems: 'center', justifyContent: 'center', marginRight: 10 }}
                                                onPress={() => this.setState({ showoverflowmenu: true })}
                                            >
                                                <Ionicons name="menu-outline" size={25} color={'#ffffff'} />
                                                {/* color={'#ffffff'} */}
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    <View>
                                        <Modal
                                            animationType="fade"
                                            transparent={true}
                                            onRequestClose={() => this.setState({ showsettingmodal: false })}
                                            visible={this.state.showsettingmodal}
                                        >
                                            <View
                                                style={{
                                                    flex: 1,
                                                    justifyContent: 'flex-start',

                                                }}
                                            >
                                                <View style={{
                                                    height: 390,
                                                    width: Dimensions.get('window').width,
                                                    borderBottomLeftRadius: 30,
                                                    borderBottomRightRadius: 30,
                                                    backgroundColor: '#ffffff',
                                                }}>
                                                    <View style={{ flexDirection: 'row', marginTop: 30, marginLeft: 10, marginRight: 10, justifyContent: 'space-between' }}>

                                                        <TouchableOpacity
                                                            style={{ alignItems: 'center', justifyContent: 'center', marginRight: 20, }}
                                                            onPress={() => this.setState({ showsettingmodal: false })}
                                                        >
                                                            <Ionicons name="arrow-back" size={25} />
                                                        </TouchableOpacity>

                                                        <TouchableOpacity
                                                            style={{ alignItems: 'center', justifyContent: 'center', marginRight: 10 }}
                                                        // onPress={() => this.setState({ friendsselected: !this.state.friendsselected, followingselected: false,followerselected:false,channelselected:false })}
                                                        >
                                                            <FontAwesome5 name="share" size={25} />
                                                        </TouchableOpacity>
                                                    </View>

                                                    <View style={{ height: 56, width: Dimensions.get('window').width, marginTop: 10, justifyContent: 'center' }}>
                                                        <View style={{ flexDirection: 'row', marginLeft: 15 }}>
                                                            <View style={{ marginRight: 10 }}>
                                                                <Image source={require('../../../assets/images/newlogo.png')} style={styles.profileimage} />
                                                            </View>
                                                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                                                <Text style={styles.username1}>
                                                                    Username
                                                                </Text>
                                                                <Text style={styles.id}>
                                                                    ID:abcd1234
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    </View>

                                                    <View style={{ marginLeft: 15, marginRight: 15, marginTop: 10 }}>
                                                        <View style={styles.billboardview}>
                                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 20, marginRight: 20 }}>
                                                                <View>
                                                                    <Text style={styles.billboard}>
                                                                        Billboard
                                                                    </Text>
                                                                </View>
                                                                <TouchableOpacity>
                                                                    <MaterialIcons name="keyboard-arrow-right" size={25} />
                                                                </TouchableOpacity>
                                                            </View>
                                                        </View>
                                                        <View style={styles.billboardview}>
                                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 20, marginRight: 20 }}>
                                                                <View>
                                                                    <Text style={styles.billboard}>
                                                                        Adminstrator
                                                                    </Text>
                                                                </View>
                                                                <TouchableOpacity>
                                                                    <MaterialIcons name="keyboard-arrow-right" size={25} />
                                                                </TouchableOpacity>
                                                            </View>
                                                        </View>
                                                        <View style={styles.billboardview}>
                                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 20, marginRight: 20 }}>
                                                                <View>
                                                                    <Text style={styles.billboard}>
                                                                        Report Room
                                                                    </Text>
                                                                </View>
                                                                <TouchableOpacity>
                                                                    <MaterialIcons name="keyboard-arrow-right" size={25} />
                                                                </TouchableOpacity>
                                                            </View>
                                                        </View>
                                                    </View>

                                                </View>
                                            </View>
                                        </Modal>
                                    </View>

                                    <View>
                                        <Modal
                                            animationType="fade"
                                            transparent={true}
                                            onRequestClose={() => this.setState({ showoverflowmenu: false })}
                                            visible={this.state.showoverflowmenu}
                                        >
                                            <ScrollView>
                                                <View
                                                    style={{
                                                        flex: 1,
                                                        justifyContent: 'flex-start',
                                                        alignItems: 'flex-end',
                                                    }}
                                                >
                                                    <View style={{ height: Dimensions.get('window').height, width: Dimensions.get('window').width - 20, backgroundColor: '#ffffff' }}>
                                                        <View style={{ marginLeft: 10, marginTop: 30 }}>
                                                            <Text style={styles.billboard}>
                                                                Recommended
                                                            </Text>
                                                        </View>

                                                        <View style={{ marginTop: 10, marginLeft: 10, marginRight: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                                                            <LinearGradient
                                                                start={{ x: 0, y: 0.5 }}
                                                                end={{ x: 1, y: 0.5 }}
                                                                useAngle={true}
                                                                angle={180}
                                                                colors={['#2A5F58', '#0C1E5F',]}
                                                                style={{
                                                                    height: 170,
                                                                    width: Dimensions.get('window').width / 2 - 35,
                                                                    borderRadius: 20,
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                }}
                                                            >
                                                                <View>
                                                                    <Image source={require('../../../assets/images/newlogo.png')} style={styles.recommendprofile} />
                                                                </View>

                                                                <View style={styles.recommendusers}>
                                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                        <Feather name="users" size={12} color={'#D8382B'} />
                                                                        <Text style={styles.usercount}>
                                                                            240
                                                                        </Text>
                                                                    </View>
                                                                </View>

                                                                <View style={{ marginTop: 10 }}>
                                                                    <Text style={styles.roomname}>
                                                                        Room name
                                                                    </Text>
                                                                </View>

                                                            </LinearGradient>

                                                            <LinearGradient
                                                                start={{ x: 0, y: 0.5 }}
                                                                end={{ x: 1, y: 0.5 }}
                                                                useAngle={true}
                                                                angle={180}
                                                                colors={['#EB0038', '#0128B1',]}
                                                                style={{
                                                                    height: 170,
                                                                    width: Dimensions.get('window').width / 2 - 35,
                                                                    borderRadius: 20,
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                }}
                                                            >
                                                                <View>
                                                                    <Image source={require('../../../assets/images/newlogo.png')} style={styles.recommendprofile} />
                                                                </View>

                                                                <View style={styles.recommendusers}>
                                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                        <Feather name="users" size={12} color={'#D8382B'} />
                                                                        <Text style={styles.usercount}>
                                                                            240
                                                                        </Text>
                                                                    </View>
                                                                </View>

                                                                <View style={{ marginTop: 10 }}>
                                                                    <Text style={styles.roomname}>
                                                                        Room name
                                                                    </Text>
                                                                </View>

                                                            </LinearGradient>
                                                        </View>

                                                    </View>
                                                </View>
                                            </ScrollView>
                                        </Modal>
                                    </View>


                                    <View style={{ flexDirection: 'row', height: 25, width: Dimensions.get('window').width, marginTop: 20 }}>
                                        <View style={{ marginRight: 0, marginLeft: 15 }}>
                                            <Image
                                                source={require('../../../assets/images/trophy.png')}
                                                style={{ height: 20, width: 20, }}
                                            />
                                        </View>
                                        <View style={{ marginRight: 5 }}>
                                            <Text style={styles.onlinetext}>
                                                {/* 190.8 K */}
                                                0
                                            </Text>
                                        </View>
                                        <View style={{ marginRight: 10 }}>
                                            <Image
                                                source={require('../../../assets/images/trophy.png')}
                                                style={{ height: 20, width: 20, }}
                                            />
                                        </View>
                                    </View>


                                    <ScrollView horizontal>
                                        <View style={{ marginLeft: 10, marginRight: 10, flexDirection: 'row', marginTop: 15 }}>
                                            {this.renderusers()}
                                        </View>
                                    </ScrollView>
                                </View>

                                <View style={{ marginTop: 20 }}>

                                    {this.renderchats()}
                                </View>


                            </ScrollView>
                        </View>
                        {this.state.showchatroomoptions ?
                            <View>
                                {this.chatroomdropdown()}
                            </View>
                            : null
                        }
                        <View style={{ flex: 0.1 }}>
                            {this.renderfooterview()}

                        </View>
                        {this.state.showsettingmodal ?
                            <BlurView
                                style={styles.blurView}
                                reducedTransparencyFallbackColor="gray"
                                blurType="light"
                                blurAmount={20}
                            />
                            : null}

                        {this.state.showoverflowmenu ?
                            <BlurView
                                style={styles.blurView}
                                reducedTransparencyFallbackColor="gray"
                                blurType="light"
                                blurAmount={20}
                            />
                            : null}

                    </ImageBackground>
                }


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
        paddingLeft: 15,
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
        //alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ffffff',
        marginLeft: 15,
        // justifyContent: 'center',

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

