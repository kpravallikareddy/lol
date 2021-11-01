import React, { useEffect, useState } from 'react';
import { View, BackHandler, Image, Text, Platform, Dimensions, Modal, TouchableOpacity, ScrollView, StyleSheet, PermissionsAndroid, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Contacts from 'react-native-contacts';
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../api';

export function Addfriends({ navigation }) {

    useEffect(async () => {

        await AsyncStorage.getItem('userid').then((userid) => {
            if (userid) {
                //this.setState({ userid: JSON.parse(userid) });
                setUserid(userid)
            }
            else {
                console.log('no userid')
            }
        });

        //getcontacts();
        getuserprofiles();



    }, [suggestedfriends]);

    const [showmobilecontacts, setShowmobilecontacts] = useState(false);
    const [friendscount, setFriendscount] = useState();
    const [showloader, setShowloader] = useState(false);
    const [userid, setUserid] = useState();
    const [userid1, setUserid1] = useState();
    const [suggestedfriends, setSuggestedfriends] = useState([]);
    const [friendsloader, setFriendsloader] = useState(false);

    const setuser = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "SubGroupMasterId": 4,
            "UserId": userid,
            "CommuncationUserId": userid1,
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

    const addfriend = () => {


        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "SubGroupMasterId": 3,
            "UserId": userid,
            "CommuncationUserId": userid1,
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

        fetch(BASE_URL + "user/setAllusercommuncation/Friend", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result)
                if (result.status == 200) {
                    alert(result.msg)
                }
            })
            .catch(error => console.log('error', error));
    }

    const getuserprofiles = () => {
        let suggestedfriends =[];
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "querytype": "getProfile",
            "test": 0,
            "searchBy": 1,
            "rsType": 0
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

                setSuggestedfriends([]);
                if (result.status == 200) {
                    for (let i = 0; i < result.data.length; i++) {
                        suggestedfriends.push(result.data[i])
                    }
                    setFriendsloader(true);
                    setSuggestedfriends(suggestedfriends);
                }
                else {
                    alert(result.msg)
                }
                console.log('suggested friends ------', suggestedfriends)
            })
            .catch(error => console.log('error', error));
    }

    const getcontacts = () => {
        console.log('getting contacts');

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

    const rendermobilecontacts = () => {
        return suggestedfriends.map(item => {
            return (
                <View style={{ height: 90, width: Dimensions.get('window').width, borderBottomColor: '#D9D9D9', borderBottomWidth: 1, backgroundColor: '#fff' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginRight: 10, marginLeft: 10, marginTop: 0, alignItems: 'center' }}>
                        <View key={item.id} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image
                                // source={require('../../../assets/images/lolgrp.png')}
                                source={{ uri: item.img }}
                                style={{ height: 70, width: 70, borderRadius: 35, marginRight: 10 }}
                            />
                            <View>
                                <Text style={{ fontFamily: 'Raleway', fontSize: 14, fontWeight: 'bold', color: '#202020' }}>
                                    {/* Name */}
                                    {item.first_name} {item.last_name}
                                </Text>
                                <Text style={{ fontFamily: 'Raleway', fontSize: 14, fontWeight: 'bold', color: '#888888' }}>
                                    {/* Name */}
                                    {item.first_name} {item.last_name}
                                </Text>
                            </View>
                        </View>
                        <View>
                            <TouchableOpacity
                                style={{ height: 30, width: 100, alignItems: 'center', justifyContent: 'center', borderRadius: 16, backgroundColor: '#FEA20C',marginTop:10 }}
                                onPress={() => {setUserid1(item.id);setuser()}}
                            >
                                <View style={{ flexDirection: 'row' }}>
                                    <Feather name="user-plus" size={15} color={'#ffffff'} style={{ marginRight: 5, marginTop: 2 }} />
                                    <Text style={styles.friendstext}>
                                        Follow
                                    </Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{ height: 30, width: 110, alignItems: 'center', justifyContent: 'center', borderRadius: 16, backgroundColor: '#FF5C00', marginTop:10 }}
                                onPress={() => {setUserid1(item.id);addfriend()}}
                            >
                                <View style={{ flexDirection: 'row' }}>
                                    <Feather name="user-plus" size={15} color={'#ffffff'} style={{ marginRight: 5, marginTop: 2 }} />
                                    <Text style={styles.friendstext}>
                                        Add Friend
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )
        })
    }

    return (
        <View>
            <View style={{
                height: 70,
                width: Dimensions.get('window').width,
                //borderBottomLeftRadius: 30,
                //borderBottomRightRadius: 30,
                backgroundColor: '#ffffff',
                borderBottomColor: '#EEEEEE',
                borderBottomWidth: 10
            }}>
                <View style={{ flexDirection: 'row', marginTop: 20, marginLeft: 10, marginRight: 10, justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity
                            style={{ alignItems: 'center', justifyContent: 'center', marginRight: 20, }}
                            // onPress={() => this.setState({ friendsselected: !this.state.friendsselected, followingselected: false,followerselected:false,channelselected:false })}
                            onPress={() => navigation.goBack()}
                        >
                            <Ionicons name="arrow-back" size={25} />
                        </TouchableOpacity>
                        <View>
                            <Text style={styles.mobilecontactstext}>
                                Add new friends
                            </Text>
                        </View>
                    </View>

                </View>
            </View>
            <ScrollView>
                <View style={{ height: 150, width: Dimensions.get('window').width, backgroundColor: '#fff', }}>
                    <View style={{ marginLeft: 15, marginTop: 15, marginBottom: 15, }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', height: 55, width: Dimensions.get('window').width, }}>
                            <TouchableOpacity style={{ marginRight: 15 }}>
                                <Entypo name="facebook-with-circle" size={35} color={"#3b5998"} />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Text style={{ fontSize: 16, }}>
                                    Facebook Friends
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', height: 55, width: Dimensions.get('window').width }}>
                            <TouchableOpacity style={{ marginRight: 15 }}>
                                <AntDesign name="contacts" size={35} color={"#FEA20C"} />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Text style={{ fontSize: 16, }}>
                                    Contacts Friends
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View>
                    {friendsloader ?
                    <View style={{marginBottom:100}}>
                        {rendermobilecontacts()}
                    </View>
                        :
                        <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                            <ActivityIndicator size="small" color="#2e3191" />
                        </View>
                    }
                </View>
            </ScrollView>

        </View>
    )
}

const styles = StyleSheet.create({
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
})