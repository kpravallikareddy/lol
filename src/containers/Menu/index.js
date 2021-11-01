import React, { useEffect } from 'react';
import { View, BackHandler, Image, Text, Platform, Dimensions, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import LinearGradient from 'react-native-linear-gradient';
import { Icon } from 'react-native-gradient-icon';
import { BASE_URL } from '../../api';
import { Shadow } from 'react-native-neomorph-shadows';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default class Menu extends React.Component {
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
            showloader: false,
            profileUri:'',
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
            .catch(error => console.log('error1', error));
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
                    this.setState({ showloader: true,profileUri:result.data[0].img })
                    
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
                console.log('userdetails-----', result)
                //this.state.userdata.length = 0;
                this.setState({ userdata: [] })
                if (result.status == 200) {
                    for (let i = 0; i < result.data.length; i++) {
                        this.state.userdata.push(result.data[i])
                    }
                    this.setState({ showloader: true })
                    console.log('userdata', this.state.userdata[0].first_name)
                }
                else {
                    alert(result.msg)
                }
            })
            .catch(error => console.log('error2', error));
    }




    shareOptions = {
        title: 'Title',
        message: 'Message to share', // Note that according to the documentation at least one of "message" or "url" fields is required
        //url: '',
        subject: 'Subject'
    };

    renderheader = () => {
        return this.state.userdata.map((item) => {
            return (
                <View style={{ height: 170, width: Dimensions.get('window').width, backgroundColor: '#fff' }}>
                    <View style={{ flexDirection: 'row', marginLeft: 20, marginRight: 20, marginTop: 30 }}>
                        <View style={{ marginRight: 40 }}>

                            {this.state.profileUri ?
                                <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate('Profile')}
                                >
                                    <Image
                                        source={{ uri: this.state.profileUri }}
                                        //source={require('../../../assets/images/lolgrp.png')} 
                                        style={styles.profile} />
                                </TouchableOpacity>
                                :
                                <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate('Profile')}
                                >
                                    <Image
                                        //source={{uri:item.image}}
                                        source={require('../../../assets/images/lolgrp.png')}
                                        style={styles.profile} />
                                </TouchableOpacity>
                            }
                        </View>
                        <View>
                            <Text>
                                {/* Username */}
                                {item.first_name}
                            </Text>
                            <View style={{ flexDirection: 'row', marginTop: 5 }}>
                                <Text style={styles.id}>
                                    {/* ID:2065757898 */}
                                    ID:{item.id}
                                </Text>
                                <TouchableOpacity
                                    style={{ height: 20, width: 20, borderRadius: 10, backgroundColor: '#000000', alignItems: 'center', justifyContent: 'center', marginLeft: 10 }}
                                    onPress={() => this.shareOptions()}
                                >
                                    <MaterialIcons name="share" size={10} color={'#fff'} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'space-between', width: Dimensions.get('window').width - 185, marginLeft: 10, marginRight: 30 }}>
                                <View>
                                    <Text style={styles.followernum}>
                                        192
                                    </Text>
                                </View>
                                {/* <View style={{marginTop:15}}>
                                <Text>/</Text>
                            </View> */}
                                <View>
                                    <Text style={styles.followernum}>
                                        200
                                    </Text>
                                </View>
                                {/* <View style={{marginTop:15}}>
                                <Text>/</Text>
                            </View> */}
                                <View >
                                    <Text style={styles.followernum}>
                                        179
                                    </Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 0, width: Dimensions.get('window').width - 170, justifyContent: 'space-between', marginRight: 50 }}>
                                <View>
                                    <Text style={styles.followerstext}>
                                        Followers
                                    </Text>
                                </View>

                                <View>
                                    <Text style={styles.followerstext}>
                                        Following
                                    </Text>
                                </View>

                                <View >
                                    <Text style={styles.followerstext}>
                                        Friends
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            )
        })
    }

    rendermenu = () => {
        return (
            <View style={{ width: Dimensions.get('window').width, backgroundColor: '#fff' }}>
                <View style={{ marginLeft: 20, marginTop: 20 }}>
                    <TouchableOpacity
                        style={{ justifyContent: 'center', }}
                    >
                        <View style={{ flexDirection: 'row' }}>
                            <MaterialCommunityIcons name="wallet-outline" size={25} style={{ marginRight: 10 }} />
                            <Text style={styles.menutitle}>Wallet</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ justifyContent: 'center', marginTop: 30 }}
                    >
                        <View style={{ flexDirection: 'row' }}>
                            <Image source={require('../../../assets/images/2.png')} style={{ height: 25, width: 25, marginRight: 10 }} />
                            <Text style={styles.menutitle}>VIP Center</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ justifyContent: 'center', marginTop: 30 }}
                    >
                        <View style={{ flexDirection: 'row' }}>
                            <Image source={require('../../../assets/images/3.png')} style={{ height: 25, width: 25, marginRight: 10 }} />
                            <Text style={styles.menutitle}>Noble center</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ justifyContent: 'center', marginTop: 30 }}
                    >
                        <View style={{ flexDirection: 'row' }}>
                            <Image source={require('../../../assets/images/4.png')} style={{ height: 25, width: 25, marginRight: 10 }} />
                            <Text style={styles.menutitle}>Privilege Shop</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ justifyContent: 'center', marginTop: 30 }}
                    >
                        <View style={{ flexDirection: 'row' }}>
                            <Image source={require('../../../assets/images/5.png')} style={{ height: 25, width: 25, marginRight: 10 }} />
                            <Text style={styles.menutitle}>Privilege Pack</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ justifyContent: 'center', marginTop: 30 }}
                    >
                        <View style={{ flexDirection: 'row' }}>
                            <Image source={require('../../../assets/images/6.png')} style={{ height: 25, width: 25, marginRight: 10 }} />
                            <Text style={styles.menutitle}>Family</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ justifyContent: 'center', marginTop: 30 }}
                    >
                        <View style={{ flexDirection: 'row' }}>
                            <Image source={require('../../../assets/images/7.png')} style={{ height: 25, width: 25, marginRight: 10 }} />
                            <Text style={styles.menutitle}>Fab club</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ justifyContent: 'center', marginTop: 30, }}
                    >
                        <View style={{ flexDirection: 'row' }}>
                            <Image source={require('../../../assets/images/8.png')} style={{ height: 25, width: 25, marginRight: 10 }} />
                            <Text style={styles.menutitle}>User level center</Text>
                        </View>
                    </TouchableOpacity>

                </View>
                <View style={{ borderTopColor: '#DDDDDD', borderTopWidth: 15, marginTop: 20 }}>
                    <View style={{ marginLeft: 20 }}>
                        <TouchableOpacity
                            style={{ justifyContent: 'center', marginTop: 20, }}
                        >
                            <View style={{ flexDirection: 'row' }}>
                                <Image source={require('../../../assets/images/9.png')} style={{ height: 25, width: 25, marginRight: 10 }} />
                                <Text style={styles.menutitle}>Invite Friends</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ justifyContent: 'center', marginTop: 30 }}
                        >
                            <View style={{ flexDirection: 'row' }}>
                                <Image source={require('../../../assets/images/10.png')} style={{ height: 25, width: 25, marginRight: 10 }} />
                                <Text style={styles.menutitle}>Settings</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ justifyContent: 'center', marginTop: 30 }}
                        >
                            <View style={{ flexDirection: 'row' }}>
                                <Image source={require('../../../assets/images/11.png')} style={{ height: 25, width: 25, marginRight: 10 }} />
                                <Text style={styles.menutitle}>Help Center</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ justifyContent: 'center', marginTop: 30, marginBottom: 15 }}
                        >
                            <View style={{ flexDirection: 'row' }}>
                                <Image source={require('../../../assets/images/12.png')} style={{ height: 25, width: 25, marginRight: 10 }} />
                                <Text style={styles.menutitle}>Rules and Policies</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

        )
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
                        <View >
                            {this.state.showloader ?
                                this.renderheader()
                                :
                                <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                                    <ActivityIndicator size="small" color="#2e3191" />
                                </View>
                            }
                        </View>

                        <View style={{ borderTopColor: '#DDDDDD', borderTopWidth: 10 }}>
                            {this.rendermenu()}
                        </View>



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
    }



})