import React, { Component } from 'react';
import { View, BackHandler, Image, Text, Platform, Dimensions, StyleSheet, TouchableOpacity, ScrollView, Modal, PermissionsAndroid, TextInput,ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import LottieView from 'lottie-react-native';
import { Icon } from 'react-native-gradient-icon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../api';
import { Shadow } from 'react-native-neomorph-shadows';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Contacts from 'react-native-contacts';
import Entypo from 'react-native-vector-icons/Entypo';
var ImagePicker = require('react-native-image-picker');     


export default class Contact extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            friendsselected: true,
            followingselected: false,
            followerselected: false,
            channelselected: false,
            showmodal: false,
            livetabselected: false,
            exploretabselected: false,
            hometabselected: false,
            chattabselected: true,
            profiletabselected: false,
            unseenmessages: 0,
            userid: '',
            friendsid: 0,
            followingid: 0,
            followersid: 0,
            channel1id: 0,
            subgroupmasterid: 3,
            userid1: '',
            subgroupname: 'Friend',
            userdata: [],
            channelid: '',
            listofchannels:[],
            channeluniqueid:'',
            showcreatemodel:false,
            channelname:'',
            profileUri: '',
            profileimage: '',
            profilename: '',
            showcreatemodel:false,
            channelijoindata:[],
            managedcount:'',
            joinedcount:'',
            friendsloader:false,
            followingloader:false,
            followerloader:false,
            channelloader:false,
            friendscount:0,
            followingcount:0,
            followercount:0,
            count:0,
        }
    }

    async componentDidMount() {
        //  this.setState({liveselected:!this.state.liveselected})
        // setTimeout(() => {
        //     this.props.navigation.navigate('Searchchatroom')
        // }, 2000);

        await AsyncStorage.getItem('userid').then((userid) => {
            if (userid) {
                this.setState({ userid: JSON.parse(userid) });
            }
            else {
                console.log('no userid')
            }
        });
        //this.getcontacts();

        // try {
        //     let usr = await AsyncStorage.getItem('userid');
        //     let user = JSON.parse(usr)
        //     // alert(user);  
        //     this.setState({ userid: user })
        // }
        // catch (error) {
        //     alert(error)
        // }
        // console.log('userid', this.state.userid)

        await this.getnotifications();
        await this.getalluserdata();
        await this.getuserdata();
        await this.getchannels();
       
        await this.getchannelsijoined()

    }

    getcontacts = () => {
        console.log('getting contacts');
        // PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        //     title: "Contacts",
        //     message: "This app would like to view your contacts."
        //   }).then(() => {
        //     Contacts.getAll((err, contacts) => {
        //       if (err) {
        //         console.log('err',err)
        //       } else {
        //         console.log(contacts);
        //       }
        //     });
        //   });

        PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
            {
                'title': 'Contacts',
                'message': 'This app would like to view your contacts.',
                'buttonPositive': 'Please accept bare mortal'
            }
        )
            .then(Contacts.getAll())
            .then(contacts => {
                console.log('contacts', contacts);
            })
    }


    getuserdata = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            // "UserId": this.state.userid,
            // "subgroupmasterID": this.state.subgroupmasterid,
            // "CommuncationUserId": this.state.userid1
            "UserId":this.state.userid,
            "subgroupmasterID":this.state.subgroupmasterid,
            "QueryType":"createdByUser",
            "QueryType2":"list",
            "temp":"1) createdByadmin 2)createdByUser",
            "temp2":"1) list 2)detils"
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        console.log('input params ----',raw)


        fetch(BASE_URL + "user/getAllusercommuncation/" + this.state.subgroupname, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result)
                //this.state.userdata.length = 0;
                this.setState({userdata:[], count:result.data.length});

                if (result.status == 200 && result.data =='') {
                    alert('No data found')
                    this.setState({friendsloader:true})
                }
                else if(result.status == 200 && result.data.length>0){
                    for (let i = 0; i < result.data.length; i++) {

                        this.state.userdata.push(result.data[i])
                    }
                    this.setState({friendsloader:true, })
                }
                else{
                    alert(result.msg)
                }
                console.log('data ---', this.state.userdata)
            })
            .catch(error => console.log('error', error));
    }

    setuser = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "SubGroupMasterId": this.state.subgroupmasterid,
            "UserId": this.state.userid,
            "CommuncationUserId": this.state.userid1,
            "SendMessage": "",
            "ReceiveMessage": "",
            "Comment": null
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(BASE_URL + "user/setAllusercommuncation/"+this.state.subgroupname, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result)
                if (result.status == 200) {
                    alert(result.msg)
                }
            })
            .catch(error => console.log('error', error));
    }


    followfriend = () => {
        // makefriend = () => {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                "UserId": this.state.userid,
                "subgroupmasterID": this.state.subgroupmasterid,
                "CommuncationUserId": this.state.userid1
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch(BASE_URL + "user/getAllusercommuncation" + this.state.subgroupname, requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log(result)
                })
                .catch(error => console.log('error', error));
        // }

    }

    getchannelsijoined=()=>{
        var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
    "querytype":"Ijoin",
    "UserId":this.state.userid,
    "SubGroupMasterId":7,
    "UniqueID":"0"
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch(BASE_URL+"user/details/Ijoin", requestOptions)
  .then(response => response.json())
  .then(result => {
      this.setState({channelijoindata:[]});
      console.log('i joined -----',result)
      console.log('joined count ----',result.data.length)
      this.setState({joinedcount:result.data.length})
        if(result.status==200 && result.data ==''){
            alert('No channels joined')
        }
        else if(result.status==200 && result.data.length>0){
            for(let i=0;i<result.data.length;i++){
                this.state.channelijoindata.push(result.data[i])
            }
        }
        else{
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

    getchannelsubgroupid = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "querytype": "getEndUserMaster"
        });

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
                    this.setState({ channelid: result.data[0].id })
                }
            })
            .catch(error => console.log('error', error));
    }

    getchannels = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            // "querytype": "GETEndUserlistfChanel",
            // "UserId": this.state.userid,
            // "userSubGroupMasterUniqueID":0   //this.state.channelid
            "querytype":"GETEndUserChanel",
            "CreatedBY":this.state.userid,
            "SubGroupMasterId":0
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(BASE_URL+"user/details/GETEndUserlistfChanel", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result)
                this.setState({listofchannels:[]});
                console.log('managed count ----',result.data.length)
                this.setState({managedcount:result.data.length})
                if(result.status ==200 && result.data ==''){
                    alert('No data found')
                }
                else if(result.status ==200 && result.data.length>0) {  
                    for(let i=0;i<result.data.length;i++){
                        this.state.listofchannels.push(result.data[i])
                    }
                }
                else{
                    alert(result.msg)
                }

            })
            .catch(error => console.log('error', error));
    }

    addusertochannel=()=>{
        var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
    "userSubGroupMasterUniqueID":this.state.channeluniqueid,       //"e2abff2d-236d-11ec-ac2a-8c8caa8b5606",
    "UserId":this.state.userid
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch(BASE_URL+"user/setAllusercommuncation/AddusertoChannel", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
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
                        friendsid: result.data[0].ID,
                        followingid: result.data[1].ID,
                        followersid: result.data[2].ID,
                        channel1id: result.data[3].ID,
                    })
                }
            })
            .catch(error => console.log('error', error));
    }



    renderfriends = () => {
        return this.state.userdata.map((item) => {
            return (
                <View>
                    <View style={styles.frinedview}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginRight: 15, marginLeft: 15 }}>
                            <View style={{ flexDirection: 'row', }}>
                                <View style={{ marginRight: 10 }}>
                                    {/* <Image source={require('../../../assets/images/lolgrp.png')} style={styles.profile} /> */}
                                    <Image key={item.id} source={{ uri: item.uc2image }} style={styles.profile} />
                                </View>
                                <View>
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
                                <View>
                                </View>
                            </View>

                            <LinearGradient
                                start={{ x: 0, y: 0.5 }}
                                end={{ x: 1, y: 0.5 }}
                                colors={['#01007E', '#FD01FC',]}
                                style={{ height: 38, width: 120, alignItems: 'center', justifyContent: 'center', borderRadius: 16 }}
                            >
                                <TouchableOpacity>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Feather name="user-check" size={15} color={'#ffffff'} style={{ marginRight: 5 }} />
                                        <Text style={styles.friendstext}>
                                            Friends
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </LinearGradient>

                        </View>
                    </View>
                </View>
            )
        })
    }

    renderfollowing = () => {
        return this.state.userdata.map((item) => {
            return (
                <View>
                    <View style={styles.frinedview}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginRight: 15, marginLeft: 15, alignItems: 'center' }}>
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
                                style={{ height: 38, width: 120, alignItems: 'center', justifyContent: 'center', borderRadius: 16, borderWidth: 1, borderColor: '#202020',marginRight:0 }}
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

    renderfollowers = () => {
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

                            {/* <LinearGradient
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                            colors={['#01007E', '#FD01FC',]}
                            style={{ height: 38, width: 120, alignItems: 'center', justifyContent: 'center', borderRadius: 16 }}
                        > */}
                            <View
                                style={{ height: 38, width: 120, alignItems: 'center', justifyContent: 'center', borderRadius: 16, borderWidth: 1, borderColor: '#202020' }}
                            >
                                <TouchableOpacity
                                    onPress={() => this.setState({ showmodal: !this.state.showmodal })}
                                >
                                    {/* <View style={{ flexDirection: 'row' }}> */}
                                    {/* <Feather name="user-check" size={15} color={'#ffffff'} style={{ marginRight: 5 }} /> */}
                                    <Text style={styles.textfollowing}>
                                        Following
                                    </Text>
                                    {/* </View> */}
                                </TouchableOpacity>
                            </View>
                            {/* </LinearGradient> */}

                        </View>
                    </View>
                    {/* <View>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.showModal}
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
                                    <Image source={require('../../../assets/images/lolgrp.png')} style={styles.profile} />
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
                                    <View style={{flexDirection:'row',marginTop:15}}>
                                        <TouchableOpacity
                                        style={styles.cancelbutton}
                                        >
                                            <Text style={styles.areyousure}>
                                                Cancel
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                        style={styles.unfollowbutton}
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
                </View> */}

                    <View style={styles.frinedview}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginRight: 0, marginLeft: 15, alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', }}>
                                <View style={{ marginRight: 10 }}>
                                    <Image source={require('../../../assets/images/newlogo.png')} style={styles.modalimage} />
                                </View>
                                <View style={{ justifyContent: 'center' }}>
                                    <Text style={styles.username}>
                                        Username
                                    </Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Ionicons name="male" size={15} color={'#4D4D4D'} />
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

                            <LinearGradient
                                start={{ x: 0, y: 0.5 }}
                                end={{ x: 1, y: 0.5 }}
                                colors={['#01007E', '#FD01FC',]}
                                style={{ height: 38, width: 120, alignItems: 'center', justifyContent: 'center', borderRadius: 16 }}
                            >
                                {/* <View
                            style={{ height: 38, width: 120, alignItems: 'center', justifyContent: 'center', borderRadius: 16, borderWidth: 1, borderColor: '#202020' }}
                        > */}
                                <TouchableOpacity
                                    onPress={() => this.setState({ showmodal: !this.state.showmodal, subgroupmasterid: this.state.followingid })}
                                >
                                    <View style={{ flexDirection: 'row' }}>
                                        <Feather name="user-plus" size={15} color={'#ffffff'} style={{ marginRight: 5 }} />
                                        <Text style={styles.friendstext}>
                                            Follow
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                                {/* </View> */}
                            </LinearGradient>

                        </View>
                    </View>
                    {/* <View>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.showModal}
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
                                    <Image source={require('../../../assets/images/lolgrp.png')} style={styles.profile} />
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
                                    <View style={{flexDirection:'row',marginTop:15}}>
                                        <TouchableOpacity
                                        style={styles.cancelbutton}
                                        >
                                            <Text style={styles.areyousure}>
                                                Cancel
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                        style={styles.unfollowbutton}
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
                </View> */}
                </View>
            )
        })
    }

    renderchannel = () => {
        return (
            <View>
                <View style={{ marginLeft: 10, marginTop: 15, marginBottom: 0 }}>
                    <Text style={styles.games}>
                        Channel I Managed ({this.state.managedcount} Channels)
                    </Text>
                </View>

                <View style={{ margin: 10 }}>
                    {this.renderchannelmanaged()}
                </View>

                <View style={{ marginLeft: 10, marginTop: 15, marginBottom: 0 }}>
                    <Text style={styles.games}>
                        Channel I Joined ({this.state.joinedcount} Channels)
                    </Text>
                </View>

                <View style={{ margin: 10 }}>
                    {this.renderchanneljoined()}
                </View>
            </View>
        )
    }

    renderchannelmanaged = () => {
        return this.state.listofchannels.map((item)=>{
        return (
            <View style={styles.channelmanagedview}>
                <View style={{ flexDirection: 'row', }}>
                    <View key={item.id} style={{ marginRight: 10, marginLeft: 5, marginTop: 5, marginBottom: 5 }}>
                        <Image 
                        source={{uri:item.img}}
                        //source={require('../../../assets/images/lolgrp.png')} 
                        style={styles.profile} />
                    </View>
                    <View style={{ justifyContent: 'center' }}>
                        <Text style={styles.username}>
                            {/* Your Channel Name */}
                            {item.SGName}
                        </Text>
                        <Text style={styles.intext}>
                            {/* ID: xyz1234 */}
                            ID: {item.UniqueID}
                        </Text>
                    </View>
                    <View>
                    </View>
                </View>

            </View>
        )
    })
    }

    renderchanneljoined = () => {
        return this.state.channelijoindata.map((item)=>{
        return (
            <View style={styles.channelmanagedview}>
                <View style={{ flexDirection: 'row', }}>
                    <View key ={item.id} style={{ marginRight: 10, marginLeft: 5, marginTop: 5, marginBottom: 5 }}>
                        <Image 
                        source={{uri:item.img}}
                        //source={require('../../../assets/images/lolgrp.png')} 
                        style={styles.profile} />
                    </View>
                    <View style={{ justifyContent: 'center' }}>
                        <Text style={styles.username}>
                            {/* Your Channel Name */}
                            {item.SGName}
                        </Text>
                        <Text style={styles.intext}>
                            {/* ID: xyz1234 */}
                            ID: {item.UniqueID}
                        </Text>
                    </View>
                    <View>
                    </View>
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
                                    style={{ height: 50, width: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 30, borderColor: '#ffffff', borderWidth: 2, marginTop: -20, backgroundColor: '#000000' }}
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
                                                    start={{ x: 0, y: 0 }}
                                                    end={{ x: 0, y: 1 }}
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
                                    //  onPress={() => this.props.navigation.navigate('Profile')}
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

    createnewchannel=()=>{
        this.setState({showcreatemodel:false})
        var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
    "querytype":"SETEndUserChanel",
    "CreatedBY":65,  //this.state.userid,
    "SubGroupMasterId":7,  ///this.state.channelid,     //7,
    "SGName":this.state.channelname,   // "MyChanelName",
    "Comment":"gggg"
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("http://lolapi.lolapp.co.in:3000/user/details/SETEndUserChanel", requestOptions)
  .then(response => response.json())
  .then(result => {
      console.log(result)
      if(result.status==200){
          alert(result.msg)
          this.getchannels();
      }
      else{
        alert(result.msg)
      }
    })
  .catch(error => console.log('error', error));
    }

    


    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 0.9 }}>
                    <View style={{
                        height: this.state.followingselected ? 280 : this.state.channelselected ? 210 : 180,
                        width: Dimensions.get('window').width,
                        borderBottomLeftRadius: 30,
                        borderBottomRightRadius: 30,
                        backgroundColor: '#ffffff'
                    }}>
                        <View style={{ flexDirection: 'row', marginTop: 30, marginLeft: 10, marginRight: 10, justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity
                                    style={{ alignItems: 'center', justifyContent: 'center', marginRight: 20, }}
                                    // onPress={() => this.setState({ friendsselected: !this.state.friendsselected, followingselected: false,followerselected:false,channelselected:false })}
                                    onPress={() => this.props.navigation.goBack()}
                                >
                                    <Ionicons name="arrow-back" size={25} />
                                </TouchableOpacity>
                                <View>
                                    <Text style={styles.mobilecontactstext}>
                                        Mobile Contacts
                                    </Text>
                                </View>
                            </View>
                            <View>
                                <TouchableOpacity
                                    style={{ alignItems: 'center', justifyContent: 'center', marginRight: 20 }}
                                    onPress={()=>this.props.navigation.navigate('Addfriends')}
                                // onPress={() => this.setState({ friendsselected: !this.state.friendsselected, followingselected: false,followerselected:false,channelselected:false })}
                                >
                                    <MaterialIcons name="person-add-alt-1" size={25} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <ScrollView horizontal>
                            <View style={{ height: 50, width: Dimensions.get('window').width, alignItems: 'center', justifyContent: 'center', marginTop: 20, marginLeft: 5 }}>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                                    {this.state.friendsselected ?
                                        <View>

                                            <TouchableOpacity
                                                // style={{ marginRight: 20 }}
                                                onPress={() => this.setState({ friendsselected: true, followingselected: false, followerselected: false, channelselected: false, subgroupmasterid: this.state.friendsid, subgroupname: 'Friend' }, () => this.getuserdata())}
                                            >
                                                <Shadow
                                                    style={{
                                                        shadowOffset: { width: 0, height: 7 },
                                                        shadowOpacity: 0.3,
                                                        shadowColor: "#1857CD",
                                                        shadowRadius: 2,
                                                        borderRadius: 16,
                                                        backgroundColor: 'white',
                                                        marginRight: 20,
                                                        width: 115,
                                                        height: 34,
                                                    }}
                                                >
                                                    <LinearGradient
                                                        start={{ x: 0, y: 0.5 }}
                                                        end={{ x: 1, y: 0.5 }}
                                                        colors={['#1E62E4', '#002B6B',]}
                                                        style={{ height: 34, width: 115, justifyContent: 'center', borderRadius: 16.5, alignItems: 'center', marginRight: 20 }}
                                                    >
                                                        <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
                                                            <LottieView
                                                                source={require('../../../assets/json/29774-dance-party.json')}
                                                                autoPlay={true}
                                                                loop={true}
                                                                speed={1}
                                                                ref={(animation) => {
                                                                    this.anim = animation;
                                                                }}
                                                                style={{ height: 25, width: 25, marginRight: 10 }}
                                                            />
                                                            <Text style={styles.friendstext}>
                                                                Friends
                                                            </Text>
                                                        </View>
                                                    </LinearGradient>
                                                </Shadow>
                                            </TouchableOpacity>
                                        </View>
                                        :
                                        <TouchableOpacity
                                            // style={{ marginLeft: 0, marginTop: 8 }}
                                            style={{ marginRight: 20, alignItems: 'center', justifyContent: 'center' }}
                                            onPress={() => this.setState({ friendsselected: true, followingselected: false, followerselected: false, channelselected: false, subgroupmasterid: this.state.friendsid, subgroupname: 'Friend' }, () => this.getuserdata())}
                                        >
                                            <Text style={styles.followingtext}>
                                                Friends
                                            </Text>
                                        </TouchableOpacity>
                                    }

                                    {/* </TouchableOpacity> */}

                                    {this.state.followingselected ?
                                        <View>
                                            <TouchableOpacity
                                                // style={{ marginRight: 20 }}
                                                onPress={() => this.setState({ friendsselected: false, followingselected: true, followerselected: false, channelselected: false, subgroupmasterid: this.state.followingid, subgroupname: 'Following' }, () => this.getuserdata())}
                                            >
                                                <Shadow
                                                    style={{
                                                        shadowOffset: { width: 0, height: 7 },
                                                        shadowOpacity: 0.3,
                                                        shadowColor: "#F94519",
                                                        shadowRadius: 2,
                                                        borderRadius: 16.5,
                                                        backgroundColor: 'white',
                                                        marginRight: 20,
                                                        width: 115,
                                                        height: 34,
                                                    }}
                                                >
                                                    <LinearGradient
                                                        start={{ x: 0, y: 0.5 }}
                                                        end={{ x: 1, y: 0.5 }}
                                                        colors={['#FF3407', '#EF693F',]}
                                                        style={{ height: 34, width: 115, alignItems: 'center', justifyContent: 'center', borderRadius: 16.5, marginRight: 20, }}
                                                    >

                                                        <View style={{ flexDirection: 'row' }}>
                                                            <View style={{ backgroundColor: '#ffffff', height: 24, width: 24, borderRadius: 12 }}>
                                                                <LottieView
                                                                    source={require('../../../assets/json/20032-follow-icon.json')}
                                                                    autoPlay={true}
                                                                    loop={true}
                                                                    speed={1}
                                                                    ref={(animation) => {
                                                                        this.anim = animation;
                                                                    }}
                                                                    style={{ height: 25, width: 25, marginRight: 15 }}
                                                                />
                                                            </View>
                                                            <Text style={styles.friendstext}>
                                                                Following
                                                            </Text>
                                                        </View>
                                                    </LinearGradient>
                                                </Shadow>
                                            </TouchableOpacity>
                                        </View>
                                        :
                                        <TouchableOpacity
                                            // style={{ marginLeft: 0, marginTop: 0 }}
                                            style={{ marginRight: 20, alignItems: 'center', justifyContent: 'center' }}
                                            onPress={() => this.setState({ friendsselected: false, followingselected: true, followerselected: false, channelselected: false, subgroupmasterid: this.state.followingid, subgroupname: 'Following' }, () => this.getuserdata())}
                                        >
                                            <Text style={styles.followingtext}>
                                                Following
                                            </Text>
                                        </TouchableOpacity>
                                    }




                                    {this.state.followerselected ?
                                        <View>
                                            <TouchableOpacity
                                                // style={{ alignItems: 'center', justifyContent: 'center', marginRight: 20 }}
                                                onPress={() => this.setState({ friendsselected: false, followingselected: false, followerselected: true, channelselected: false, subgroupmasterid: this.state.followersid, subgroupname: 'Followers' }, () => this.getuserdata())}
                                            >
                                                <Shadow
                                                    style={{
                                                        shadowOffset: { width: 0, height: 7 },
                                                        shadowOpacity: 0.3,
                                                        shadowColor: "#F8A01A",
                                                        shadowRadius: 10,
                                                        borderRadius: 16.5,
                                                        backgroundColor: 'white',
                                                        marginRight: 20,
                                                        width: 105,
                                                        height: 34,
                                                    }}
                                                >
                                                    <LinearGradient
                                                        start={{ x: 0, y: 0.5 }}
                                                        end={{ x: 1, y: 0.5 }}
                                                        colors={['#F79423', '#FBBC05',]}
                                                        style={{ height: 34, width: 105, alignItems: 'center', justifyContent: 'center', borderRadius: 16.5, marginRight: 20, }}
                                                    >
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <View style={{ backgroundColor: '#ffffff', height: 24, width: 24, borderRadius: 12, marginRight: 5 }}>
                                                                <LottieView
                                                                    source={require('../../../assets/json/42513-man-chatting-on-his-mobile-phone.json')}
                                                                    autoPlay={true}
                                                                    loop={true}
                                                                    speed={1}
                                                                    ref={(animation) => {
                                                                        this.anim = animation;
                                                                    }}
                                                                    style={{ height: 25, width: 25, marginRight: 15 }}
                                                                />
                                                            </View>
                                                            <Text style={styles.friendstext}>
                                                                Follower
                                                            </Text>
                                                        </View>
                                                    </LinearGradient>
                                                </Shadow>
                                            </TouchableOpacity>
                                        </View>
                                        :
                                        <TouchableOpacity
                                            // style={{ marginLeft: 0, marginTop: 0 }}
                                            style={{ marginRight: 20, alignItems: 'center', justifyContent: 'center' }}
                                            onPress={() => this.setState({ friendsselected: false, followingselected: false, followerselected: true, channelselected: false, subgroupmasterid: this.state.followersid, subgroupname: 'Followers' }, () => this.getuserdata())}
                                        >
                                            <Text style={styles.followingtext}>
                                                Follower
                                            </Text>
                                        </TouchableOpacity>
                                    }

                                    {this.state.channelselected ?
                                        <View>
                                            <TouchableOpacity
                                                style={{ alignItems: 'center', justifyContent: 'center', marginRight: 20 }}
                                                onPress={() => this.setState({ friendsselected: false, followingselected: false, followerselected: false, channelselected: true, subgroupmasterid: this.state.channel1id, subgroupname: 'Channel-1' }, () => this.getchannels())}
                                            >
                                                <Shadow
                                                    style={{
                                                        shadowOffset: { width: 0, height: 7 },
                                                        shadowOpacity: 0.3,
                                                        shadowColor: "#23A742",
                                                        shadowRadius: 10,
                                                        borderRadius: 16.5,
                                                        backgroundColor: 'white',
                                                        marginRight: 20,
                                                        width: 105,
                                                        height: 34,
                                                    }}
                                                >
                                                    <LinearGradient
                                                        start={{ x: 0, y: 0.5 }}
                                                        end={{ x: 1, y: 0.5 }}
                                                        colors={['#009A2B', '#7CC97A',]}
                                                        style={{ height: 34, width: 105, alignItems: 'center', justifyContent: 'center', borderRadius: 16.5, marginRight: 20, }}
                                                    >
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <View style={{ backgroundColor: '#ffffff', height: 24, width: 24, borderRadius: 12, marginRight: 5 }}>
                                                                <LottieView
                                                                    source={require('../../../assets/json/69472-mrsnowden-3-animation.json')}
                                                                    autoPlay={true}
                                                                    loop={true}
                                                                    speed={1}
                                                                    ref={(animation) => {
                                                                        this.anim = animation;
                                                                    }}
                                                                    style={{ height: 20, width: 20, marginRight: 15 }}
                                                                />
                                                            </View>
                                                            <Text style={styles.friendstext}>
                                                                Channel
                                                            </Text>
                                                        </View>
                                                    </LinearGradient>
                                                </Shadow>
                                            </TouchableOpacity>
                                        </View>
                                        :
                                        <TouchableOpacity
                                            // style={{ marginLeft: 0, marginTop: 0 }}  , () => this.getuserdata()  subgroupname: 'Channel-1'
                                            style={{ marginRight: 20, alignItems: 'center', justifyContent: 'center' }}
                                            onPress={() => this.setState({ friendsselected: false, followingselected: false, followerselected: false, channelselected: true, subgroupmasterid: this.state.channel1id, })}
                                        >
                                            <Text style={styles.followingtext}>
                                                Channel
                                            </Text>
                                        </TouchableOpacity>
                                    }
                                </View>
                            </View>
                        </ScrollView>

                        {this.state.friendsselected ?
                            <View style={{ margin: 15 }}>
                                <Text style={styles.youhavetext}>
                                    You have {this.state.count} friends
                                </Text>
                            </View>
                            :
                            this.state.followingselected ?
                                <View>
                                    <View style={{ marginLeft: 15, marginRight: 15, marginBottom: 15, marginTop: 10 }}>
                                        <Text style={styles.username}>
                                            Stories
                                        </Text>
                                    </View>
                                    <ScrollView horizontal>
                                        <View style={{ flexDirection: 'row' }}>
                                            <LinearGradient
                                                start={{ x: 0, y: 0.5 }}
                                                end={{ x: 1, y: 0.5 }}
                                                colors={['#01007E', '#FD01FC',]}
                                                style={{ height: 50, width: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 25, marginRight: 15, marginLeft: 15 }}
                                            >
                                            </LinearGradient>
                                            <LinearGradient
                                                start={{ x: 0, y: 0.5 }}
                                                end={{ x: 1, y: 0.5 }}
                                                colors={['#01007E', '#FD01FC',]}
                                                style={{ height: 50, width: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 25, marginRight: 15, marginLeft: 0 }}
                                            >
                                            </LinearGradient>
                                            <LinearGradient
                                                start={{ x: 0, y: 0.5 }}
                                                end={{ x: 1, y: 0.5 }}
                                                colors={['#01007E', '#FD01FC',]}
                                                style={{ height: 50, width: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 25, marginRight: 15, marginLeft: 0 }}
                                            >
                                            </LinearGradient>
                                            <LinearGradient
                                                start={{ x: 0, y: 0.5 }}
                                                end={{ x: 1, y: 0.5 }}
                                                colors={['#01007E', '#FD01FC',]}
                                                style={{ height: 50, width: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 25, marginRight: 15, marginLeft: 0 }}
                                            >
                                            </LinearGradient>
                                            <LinearGradient
                                                start={{ x: 0, y: 0.5 }}
                                                end={{ x: 1, y: 0.5 }}
                                                colors={['#01007E', '#FD01FC',]}
                                                style={{ height: 50, width: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 25, marginRight: 15, marginLeft: 0 }}
                                            >
                                            </LinearGradient>
                                            <LinearGradient
                                                start={{ x: 0, y: 0.5 }}
                                                end={{ x: 1, y: 0.5 }}
                                                colors={['#01007E', '#FD01FC',]}
                                                style={{ height: 50, width: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 25, marginRight: 15, marginLeft: 0 }}
                                            >
                                            </LinearGradient>
                                            <LinearGradient
                                                start={{ x: 0, y: 0.5 }}
                                                end={{ x: 1, y: 0.5 }}
                                                colors={['#01007E', '#FD01FC',]}
                                                style={{ height: 50, width: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 25, marginRight: 15, marginLeft: 0 }}
                                            >
                                            </LinearGradient>
                                            <LinearGradient
                                                start={{ x: 0, y: 0.5 }}
                                                end={{ x: 1, y: 0.5 }}
                                                colors={['#01007E', '#FD01FC',]}
                                                style={{ height: 50, width: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 25, marginRight: 15, marginLeft: 0 }}
                                            >
                                            </LinearGradient>

                                        </View>
                                    </ScrollView>

                                    <View style={{ margin: 15, marginTop: 20 }}>
                                        <Text style={styles.youhavetext}>
                                            You have followed {this.state.count} users
                                        </Text>
                                    </View>
                                </View>
                                : this.state.followerselected ?
                                    <View style={{ margin: 15 }}>
                                        <Text style={styles.youhavetext}>
                                            {this.state.count} Followers
                                        </Text>
                                    </View>
                                    : this.state.channelselected ?
                                        <View style={{ marginRight: 15, marginLeft: 15, marginBottom: 15, marginTop: 5 }}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <TouchableOpacity
                                                    style={styles.createchannel}
                                                    onPress={()=>this.setState({showcreatemodel:true})}
                                                >
                                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                        <View style={styles.grommentstyle}>
                                                            <Feather name="tv" size={20} color={'#ffffff'} />
                                                        </View>
                                                        <Text style={styles.areyousure}>
                                                            Create Channel
                                                        </Text>
                                                    </View>

                                                </TouchableOpacity>
                                                 <TouchableOpacity
                                                    style={styles.findchannel}
                                                    onPress={() => this.props.navigation.navigate('Channelsearch')}
                                                >
                                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                        <View style={styles.sharelocation}>
                                                            <Image source={require('../../../assets/images/share_loc.png')} style={{ height: 25, width: 25, }} />
                                                        </View>
                                                        <Text style={styles.areyousure}>
                                                            Find Channel
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity> 

<View>
                                        <Modal
                                            animationType="fade"
                                            transparent={true}
                                            onRequestClose={() => this.setState({ showcreatemodel: false })}
                                            visible={this.state.showcreatemodel}
                                        >
                                            <View
                                                style={{
                                                    flex: 1,
                                                    justifyContent: 'center',
                                                    alignItems:'center'
                                                }}
                                            >
                                                <View style={{
                                                    height: Dimensions.get('window').height/3,
                                                    width: Dimensions.get('window').width-30,
                                                    //borderBottomLeftRadius: 30,
                                                    //borderBottomRightRadius: 30,
                                                    borderRadius:30,
                                                    backgroundColor: '#ffffff',
                                                    alignItems:'center',
                                                    //justifyContent:'center'
                                                    marginTop:30,
                                                }}>
     
                                                <TextInput 
                                                placeholder="Enter a channel name"
                                                onChangeText={(text) =>this.setState({channelname:text})}
                                                value={this.state.channelname}
                                                style={{height:40, width:Dimensions.get('window').width-50,borderRadius:15,borderWidth:1,borderColor:'#000',paddingLeft:10,marginTop:10}}
                                                />
                                                   
                                                <TouchableOpacity
                                                style={{height:100,width:100,borderRadius:10,borderColor:'#000',borderWidth:1,marginTop:10,alignItems:'center',justifyContent:'center'}}
                                                onPress={() => this.launchCamera()}
                                                >
                                                    {this.state.profileUri?
                                                    <Image 
                                                    source={{ uri: this.state.profileUri }}
                                                    //source={require('../../../assets/images/lolgrp.png')}
                                                    style={{height:98,width:98,borderRadius:10}}
                                                    />
                                                    :
                                                    <Entypo name="camera" size={20}   />
                                                    }
                                                </TouchableOpacity>
                                                    
                                                    <TouchableOpacity
                                                    style={{height:40,width:100,borderRadius:10, borderColor:'#000',borderWidth:1,alignItems:'center',justifyContent:'center',marginTop:15}}
                                                    onPress={()=>this.createnewchannel()}
                                                    >
                                                        <Text style={{fontSize:16,}}>
                                                            Submit
                                                        </Text>
                                                    </TouchableOpacity>

                                                </View>
                                            </View>
                                        </Modal>
                                    </View>
                                            </View>
                                        </View>
                                        : null
                        }
                    </View>
                    {
                        this.state.friendsselected ?
                            <View>
                                {this.state.friendsloader?
                                this.renderfriends()
                                :
                                <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                                            <ActivityIndicator size="small" color="#2e3191" />
                                        </View>
                                }
                            </View>
                            : null
                    }
                    {
                        this.state.followingselected ?
                        <ScrollView>
                            <View>
                                {this.state.friendsloader?
                                this.renderfollowing()
                                :
                                <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                                            <ActivityIndicator size="small" color="#2e3191" />
                                        </View>
                                }
                            </View>
                            </ScrollView>
                            : null
                    }
                    {
                        this.state.followerselected ?
                            <View>
                                {this.renderfollowers()}
                            </View>
                            : null
                    }
                    {
                        this.state.channelselected ?
                            <View>
                                {this.renderchannel()}
                            </View>
                            : null
                    }
                </View >

                <View style={{ flex: 0.1, position: 'absolute', bottom: 0, left: 0, }}>
                    {this.renderfooter()}
                </View>

            </View >
        )
    }
}

const styles = StyleSheet.create({
    mobiletopview: {
        height: 180,
        width: Dimensions.get('window').width,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        backgroundColor: '#ffffff'
    },
    mobilecontactstext: {
        fontFamily: 'Raleway',
        fontWeight: 'bold',
        fontSize: 22,
        color: '#202020'
    },
    friendstext: {
        fontFamily: 'Raleway',
        fontWeight: '700',
        fontSize: 16,
        color: '#ffffff'
    },
    followingtext: {
        fontFamily: 'Raleway',
        fontWeight: '700',
        fontSize: 16,
        color: '#4D4D4D',
        marginLeft: 0,
    },
    youhavetext: {
        fontFamily: 'Raleway',
        fontWeight: '600',
        fontSize: 14,
        color: '#4D4D4D'
    },
    profile: {
        width: 50,
        height: 50,
        borderRadius: 16,
        //backgroundColor: '#ffffff'
    },
    frinedview: {
        height: 80,
        width: Dimensions.get('window').width,
        borderBottomColor: '#D9D9D9',
        borderBottomWidth: 1,
        // alignItems:'center',
        justifyContent: 'center'
        // borderRadius: 24,
        // marginLeft: 5,
        // marginRight: 5,
        // marginTop: 5,
    },
    username: {
        fontFamily: 'Raleway',
        fontWeight: '700',
        fontSize: 16,
        color: '#202020',
        //textAlign: 'center',
        // marginTop: 10
    },
    intext: {
        fontFamily: 'Raleway',
        fontWeight: '600',
        fontSize: 12,
        color: '#4D4D4D'
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
    textfollowing: {
        fontFamily: 'Raleway',
        fontWeight: '600',
        fontSize: 16,
        color: '#202020',
    },
    modalimage: {

        width: 80,
        height: 80,
        borderRadius: 30,
        //backgroundColor: '#ffffff'
    },
    areyousure: {
        fontFamily: 'Raleway',
        fontWeight: '600',
        fontSize: 16,
        color: '#ffffff',
        // textAlign:'center',
    },
    cancelbutton: {
        height: 35,
        width: 105,
        borderRadius: 16,
        backgroundColor: 'rgba(196, 196, 196, 0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#ffffff',
        marginRight: 10,
    },
    unfollowbutton: {
        height: 35,
        width: 105,
        borderRadius: 16,
        // backgroundColor:'rgba(196, 196, 196, 0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#ffffff'
    },
    createchannel: {
        width: Dimensions.get('window').width / 2 - 20,
        height: 50,
        backgroundColor: '#01007E',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    findchannel: {
        width: Dimensions.get('window').width / 2 - 20,
        height: 50,
        backgroundColor: '#BA25B9',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    grommentstyle: {
        width: 40,
        height: 40,
        borderRadius: 16,
        backgroundColor: '#4F4ED7',
        marginRight: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    sharelocation: {
        width: 40,
        height: 40,
        borderRadius: 16,
        backgroundColor: '#E96FE8',
        marginRight: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    channelmanagedview: {
        height: 80,
        width: Dimensions.get('window').width - 20,
        //borderBottomColor: '#D9D9D9',
        //borderBottomWidth: 1,
        //alignItems:'center',
        justifyContent: 'center',
        borderRadius: 20,
        backgroundColor: '#ffffff',
        marginBottom:10,
        // marginLeft: 5,
        // marginRight: 5,
        // marginTop: 5,
    },


})

