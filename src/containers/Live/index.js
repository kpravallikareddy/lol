import React, { Component } from 'react';
import { View, BackHandler, Image, Text, Platform, Dimensions, StyleSheet, TouchableOpacity, ScrollView, ImageBackground, FlatList, Animated, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import LottieView from 'lottie-react-native';
import { Icon } from 'react-native-gradient-icon';
import { BASE_URL } from '../../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Shadow, Neomorph, NeomorphFlex } from 'react-native-neomorph-shadows';
import MaskedView from '@react-native-community/masked-view';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
//import WheelOfFortune from 'react-native-wheel-of-fortune'


const bgfiles = [
    require('../../../assets/json/63812-gradient-background.json'),
    require('../../../assets/json/63814-gradient-dots-background.json'),
    require('../../../assets/json/58180-sport-background.json'),
    require('../../../assets/json/44943-bokeh-valentine-background.json')
    //require('../../../assets/json/37383-background-bubble.json')
]
//require('../../../assets/json/44943-bokeh-valentine-background.json')

export default class Live extends React.Component {
    constructor(props) {
        super(props)
        // performSomeLongRunningOperation();
        this.state = {
            liveselected: false,
            partyselected: true,
            liverecommendselected: false,
            livemegastarselected: false,
            liveglobalselected: false,
            livebannerselected: false,
            partyrecommendselected: true,
            partygamesselected: false,
            showbannerdropdown: false,
            livetabselected: true,
            exploretabselected: false,
            hometabselected: false,
            chattabselected: false,
            profiletabselected: false,
            unseenmessages: 0,
            friendsid: 0,
            followingid: 0,
            followersid: 0,
            liverecommendid: 0,
            upcomingliveid: 0,
            performerrankingid: 0,
            fanclubrankingid: 0,
            videotalentid: 0,
            partyrecommendid: 0,
            gamesid: 0,
            datingid: 0,
            chatid: 0,
            multivideoid: 0,
            familyid: 0,
            channel1id: 0,
            megastarid: 0,
            userid: '',
            subgroupmasterid: 3,
            userid1: '',
            subgroupname: 'MegaStar',
            images: [],
            animations: [],
            userdata: [],
            x: new Animated.Value(0),
            partyroomdata: [],
            showmegastarloader: false,
            showpartyrecommendloader: false,
            megastardata: [],
            liverecommenddata: [],
            showliverecommendloader: false,
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

        this.anim.play();
        setTimeout(() => { }, 9000);

        this.getnotifications();
        this.getalluserdata();
        this.getanimations();
        this.getimages();
        this.getuserdata();
        this.getpartyrecommend();
        this.getmegastar();
        this.getliverecommend();
        // this.getmegastardata();

        //  this.setState({liveselected:!this.state.liveselected})
        // setTimeout(() => {
        //     this.props.navigation.navigate('Chat')
        // }, 1000);


    }

    getanimations = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({ "dirPath": "assets/json", "Temp": "LolAppimages, json,Country" });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(BASE_URL + "user/getImages", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result)
            })
            .catch(error => console.log('error', error));
    }

    getimages = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({ "dirPath": "assets/LolAppimages" });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(BASE_URL + "user/getImages", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result)
            })
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
                        megastarid: result.data[4].ID,
                        liverecommendid: result.data[5].ID,
                        upcomingliveid: result.data[6].ID,
                        performerrankingid: result.data[7].ID,
                        fanclubrankingid: result.data[8].ID,
                        videotalentid: result.data[9].ID,
                        partyrecommendid: result.data[10].ID,
                        gamesid: result.data[11].ID,
                        datingid: result.data[12].ID,
                        chatid: result.data[13].ID,
                        multivideoid: result.data[14].ID,
                        familyid: result.data[15].ID,

                    })
                }
            })
            .catch(error => console.log('error', error));
    }

    getpartyrecommend = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "querytype": "GETEndUserChanel",
            "CreatedBY": 0,
            "SubGroupMasterId": 8
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(BASE_URL + "user/details/getEndPartyroom", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('party room data ---- ', result)
                this.setState({ partyroomdata: [] });
                if (result.status == 200) {
                    for (let i = 0; i < result.data.length; i++) {
                        this.state.partyroomdata.push(result.data[i])
                    }
                    this.setState({ showpartyrecommendloader: true })
                }
                console.log('party room  ---- ', this.state.partyroomdata)
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


    setallusercommunication = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "SubGroupMasterId": this.state.subgroupmasterid,
            "UserId": this.state.userid,
            "CommuncationUserId": 2,
            "SendMessage": "1",
            "ReceiveMessage": "1",
            "Comment": null
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(BASE_URL + "user/setAllusercommuncation", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result)
                if (result.status == 200) {
                    alert(result.msg)
                }
            })
            .catch(error => console.log('error', error));
    }

    getmegastar = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "querytype": "GETEndUserLive",
            "querytype2": "Megastar"
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(BASE_URL + "user/details/Megastarroom", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result)
                this.setState({ megastardata: [] })
                if (result.status == 200 && result.data == '') {
                    alert('No data found')
                }
                else if (result.status == 200 && result.data.length > 0) {
                    for (let i = 0; i < result.data.length; i++) {
                        this.state.megastardata.push(result.data[i])
                    }
                    this.setState({ showmegastarloader: true })
                }
                else {
                    alert(result.msg)
                }
                console.log('megastardata ----', this.state.megastardata)

            })
            .catch(error => console.log('error', error));
    }

    getliverecommend = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({ "querytype": "GETEndUserLive", "querytype2": "Recommended" });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(BASE_URL + "user/details/Recommendedroom", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result)
                this.setState({ liverecommenddata: [] })
                if (result.status == 200 && result.data == '') {
                    alert('No data found')
                }
                else if (result.status == 200 && result.data.length > 0) {
                    for (let i = 0; i < result.data.length; i++) {
                        this.state.liverecommenddata.push(result.data[i])
                    }
                    this.setState({ showliverecommendloader: true })
                }
                else {
                    alert(result.msg)
                }
                console.log('liverecommenddata ----', this.state.liverecommenddata)
            })
            .catch(error => console.log('error', error));
    }

    getmegastardata = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "querytype": "CreatedbyAdmin",
            "UserId": this.state.userid,
            "subgroupmasterID": 8,
            "groupId": 0
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(BASE_URL + "user/details/masterMagaStar", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result)
                this.setState({ megastardata: [] })
                if (result.status == 200 && result.data == '') {
                    alert('No data found')
                }
                else if (result.status == 200 && result.data.length > 0) {
                    for (let i = 0; i < result.data.length; i++) {
                        this.state.megastardata.push(result.data[i])
                    }
                    this.setState({ showmegastarloader: true })
                }
                else {
                    alert(result.msg)
                }
                console.log('megastardata ----', this.state.megastardata)
            })
            .catch(error => console.log('error', error));
    }

    getuserdata = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        // var raw = JSON.stringify({
        //     "UserId": this.state.userid,
        //     "subgroupmasterID": this.state.subgroupmasterid,
        //     "CommuncationUserId": this.state.userid1
        // });

        var raw = JSON.stringify({
            "UserId": this.state.userid,
            "subgroupmasterID": this.state.subgroupmasterid,
            "CommuncationUserId": "",
            "QueryType": "createdByadmin",
            "temp": "1) createdByadmin 2)createdByUser"
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
                //console.log(result)
                this.setState({ userdata: [] })
                if (result.status == 200) {
                    for (let i = 0; i < result.data.length; i++) {
                        this.state.userdata.push(result.data[i])
                    }
                    //this.setState({ showmegastarloader: true })
                }
                console.log('userdata ----', this.state.userdata)
            })
            .catch(error => console.log('error', error));
    }

    getpartydata = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "UserId": this.state.userid,
            "subgroupmasterID": this.state.subgroupmasterid,
            "CommuncationUserId": 0,
            "QueryType": "createdByadmin",
            "temp": "1) createdByadmin 2)createdByUser"
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(BASE_URL + "user/getAllusercommuncation/partyroom", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result)
            })
            .catch(error => console.log('error', error));
    }

    rendertrendingcard = () => {
        return (
            // Dimensions.get('window').width / 2 - 50
            <View style={{ width: 174, marginLeft: 10, marginRight: 15, }}>
                <LinearGradient
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    colors={['#FD01FC', '#F39EB0', '#01007E']}
                    style={{ height: 60, width: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', zIndex: 1, alignSelf: 'center', }}
                >
                </LinearGradient>
                <View style={{ top: -30, }}>
                    <Shadow
                        style={{
                            shadowColor: '#025EE9',
                            shadowOffset: { width: 0, height: 7 },
                            shadowOpacity: 0.3,
                            shadowRadius: 2,
                            backgroundColor: 'transparent',
                            width: 174, height: 100,
                            borderRadius: 20
                        }}>
                        <LinearGradient
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                            useAngle={true}
                            angle={118}
                            colors={['#0032E1', '#07D2FF',]}
                            // Dimensions.get('window').width / 2 - 50
                            style={{ height: 100, width: 174, borderRadius: 20, alignItems: 'center', justifyContent: 'center', }}
                        >
                            <LinearGradient
                                start={{ x: 0, y: 0.5 }}
                                end={{ x: 1, y: 0.5 }}
                                colors={['#3B39FF', '#FF1ACD',]}
                                useAngle={true}
                                angle={125}
                                style={{ height: 22, width: Dimensions.get('window').width / 4, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginTop: 5, zIndex: 2, marginBottom: 8 }}
                            >
                                <Text style={styles.trendingtext}>
                                    #1 Trending
                                </Text>
                            </LinearGradient>
                            <View style={{ paddingTop: 0, marginBottom: 5 }}>
                                <Text style={styles.megastar}>
                                    Party Room Name
                                </Text>
                            </View>
                            {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 30, marginRight: 30 }}> */}
                            <View style={{ flexDirection: 'row', marginRight: 15 }}>
                                <MaterialIcons name="person" size={15} color={'#ffffff'} />
                                <Text style={styles.numtext}>314</Text>
                            </View>
                            {/* <View>
                                    <TouchableOpacity>
                                        <Text style={styles.pickme}>
                                            Pick Me
                                        </Text>
                                    </TouchableOpacity>
                                </View> */}
                            {/* </View> */}
                        </LinearGradient>
                    </Shadow>
                </View>
            </View>
        )
    }

    renderpartyroom2 = () => {
        const color = this.state.x.interpolate({
            inputRange: [0, 1],
            outputRange: ['#0032E1', '#07D2FF']
        });
        return (
            <View style={{ width: Dimensions.get('window').width / 2 - 20, marginLeft: 0, }}>
                {/* <LinearGradient
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    colors={['#FD01FC', '#F39EB0', '#01007E']}
                    style={{ height: 100, width: 100, borderRadius: 30, alignItems: 'center', justifyContent: 'center', zIndex: 1, alignSelf: 'center' }}
                >
                </LinearGradient> */}


                <View
                    style={{ height: 100, width: 100, borderRadius: 30, alignItems: 'center', justifyContent: 'center', zIndex: 1, alignSelf: 'center', borderWidth: 1, borderColor: '#ffffff' }}
                >

                </View>
                {/* <View style={{ height:190,width:Dimensions.get('window').width/2-30}}> */}
                {/* <LinearGradient
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        colors={['#0032E1', '#07D2FF',]}
                        style={{ height: 190, width: Dimensions.get('window').width / 2 - 30, borderRadius: 26, alignItems: 'center', justifyContent: 'center' }}
                    > */}



                <ImageBackground
                    //resizeMode={'cover'}
                    imageStyle={{ borderRadius: 26 }}
                    source={require('../../../assets/images/edit2.gif')}
                    //source={require('../../../assets/images/63812-gradient-background.gif')}  
                    style={{ height: 190, width: Dimensions.get('window').width / 2 - 20, marginTop: -80, overflow: 'hidden', alignItems: 'center' }}
                >
                    <View style={{ flexDirection: 'row', marginTop: 85 }}>
                        <MaterialIcons name="person" size={20} color={'#ffffff'} />
                        <Text style={styles.numtextpartyroom}>202</Text>
                    </View>

                    <View style={{ paddingTop: 0, marginBottom: 5 }}>
                        <Text style={styles.partytext}>
                            Party Room Name
                        </Text>
                    </View>
                    {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 30, marginRight: 30 }}> */}
                    <TouchableOpacity>
                        <View style={{
                            paddingTop: 3,
                            paddingBottom: 3, paddingRight: 8,
                            paddingLeft: 8, borderRadius: 30,
                            backgroundColor: '#fff'
                        }}>
                            <Text style={{
                                fontFamily: 'Raleway',
                                fontWeight: '700',
                                fontSize: 16, color: color,
                            }}>
                                60 Seats
                            </Text>
                        </View>
                    </TouchableOpacity>
                    {/* </View> */}
                </ImageBackground>

                {/* <View style={{height:190,width:Dimensions.get('window').width/2-30,borderRadius:26, }}>
                    <LottieView
                        source={require('../../../assets/json/63812-gradient-background.json')}
                        autoPlay={true}
                        loop={true}
                        speed={1}
                        ref={(animation) => {
                            this.anim = animation;
                        }}
                        style={{ 
                            //height: 190, 
                            aspectRatio: 400 / 800,
                           // width: Dimensions.get('window').width / 2-30,
                        }}
                    />
                    </View> */}
                {/* <View style={{ flexDirection: 'row',marginTop:55 }}>
                        <MaterialIcons name="person" size={20} color={'#ffffff'} />
                        <Text style={styles.numtextpartyroom}>202</Text>
                    </View>

                    <View style={{ paddingTop: 0, marginBottom: 5 }}>
                        <Text style={styles.partytext}>
                            Party Room Name
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 30, marginRight: 30 }}>

                        <View style={{ paddingTop: 3, paddingBottom: 3, paddingRight: 8, paddingLeft: 8, borderRadius: 30, backgroundColor: '#ffffff' }}>
                            <TouchableOpacity>
                                <Text style={styles.seats}>
                                    6 Seats
                                </Text>
                            </TouchableOpacity>
                        </View> 
                    </View>*/}
                {/* </LinearGradient> */}
                {/* </View> */}
            </View>
        )
    }

    setroomnameid = () => {
        // AsyncStorage.setItem('chatroom',this.state.roomname);
        // AsyncStorage.setItem('chatroomid',result.data[0].UniqueID);
    }

    renderpartyroom = () => {
        return (
            <View>
                <ScrollView>
                    <FlatList
                        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 10 }}
                        numColumns={2}
                        keyExtractor={(item, index) => index}
                        data={this.state.partyroomdata}
                        renderItem={({ item, index }) => {
                            return (
                                <View
                                //style={{ width: Dimensions.get('window').width / 2 - 20, marginLeft: 0, marginTop: 0, borderRadius: 26,}}
                                >
                                    <TouchableOpacity
                                        onPress={() => this.props.navigation.navigate('Searchchatroom', {chatroom:item.SGName, chatroomid:item.UniqueID})}
                                    >
                                        {/* <View
                    style={{ height: 100, width: 100, borderRadius: 30, alignItems: 'center', justifyContent: 'center', zIndex: 1, alignSelf: 'center', borderWidth: 1, borderColor: '#ffffff' }}
                > */}
                                        {/* <Image 
                    source={{uri:item.img}}
                    style={{height:100,width:100,borderRadius:30}}
                    /> */}
                                        {/* </View> */}
                                        {/*<View
                 style={{ 
                     height: 190, 
                     width: Dimensions.get('window').width / 2 - 20, 
                     borderRadius: 26,  
                     alignItems: 'center',
                     //borderWidth:1,
                     borderColor:'#000000',
                     aspectRatio:1,
                     marginTop:-80 
                    }}
                    
                >
                <LottieView
                        source={require('../../../assets/json/63812-gradient-background.json')}
                        autoPlay={true}
                        loop={true}
                        speed={1}
                        ref={(animation) => {
                            this.anim = animation;
                        }}
                        resizeMode="cover"
                        style={{ 
                            //height:width * sourceHeight / sourceWidth , 
                            aspectRatio:0.5,
                            
                            //width: Dimensions.get('window').width/2-30,
                        }}>
                             
                        </LottieView> 
                    </View>*/}
                                        <ImageBackground
                                            //resizeMode={'cover'}
                                            //source={require('../../../assets/json/63812-gradient-background.json')}
                                            //source={require('../../../assets/images/edit2.gif')}
                                            //source={require('../../../assets/images/63812-gradient-background.gif')}  
                                            //imageStyle={{borderRadius:26}}
                                            style={{ height: 190, width: Dimensions.get('window').width / 2 - 20, marginTop: 0, overflow: 'hidden', alignItems: 'center', borderRadius: 26 }}
                                        >
                                            {/* {item.jsonpath? */}
                                            <LottieView
                                                // item.jsonpath
                                                //source={{uri:"https://lolapi.lolapp.co.in/assets/json/58180-sport-background.json"}}
                                                //source={require('../../../assets/json/63812-gradient-background.json')}
                                                //source={{uri:item.jsonpath}}
                                                //source={{uri:jsonpath}}
                                                source={bgfiles[index % bgfiles.length]}
                                                autoPlay={true}
                                                loop={true}
                                                speed={1}
                                                ref={(animation) => {
                                                    this.anim = animation;
                                                }}
                                                resizeMode="cover"
                                                style={{
                                                    aspectRatio: 0.5,
                                                }}
                                            />
                                            {/* :null} */}

                                            <View
                                                style={{ height: 70, width: 70, borderRadius: 35, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', borderWidth: 1, borderColor: '#ffffff', marginTop: 10 }}
                                            >
                                                {/* zIndex: 1, */}
                                                <Image
                                                    source={{ uri: item.img }}
                                                    style={{ height: 66, width: 66, borderRadius: 33 }}
                                                />
                                            </View>
                                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                                <MaterialIcons name="person" size={20} color={'#ffffff'} />
                                                <Text
                                                    style={styles.numtextpartyroom}>
                                                    {/* 202 */}
                                                    {item.avluser}
                                                </Text>
                                            </View>

                                            <View style={{ paddingTop: 0, marginBottom: 5 }}>
                                                <Text style={styles.partytext}>
                                                    {/* Party Room Name */}
                                                    {item.SGName}
                                                </Text>
                                            </View>

                                            <TouchableOpacity>
                                                <View style={{
                                                    paddingTop: 3,
                                                    paddingBottom: 3,
                                                    paddingRight: 8,
                                                    paddingLeft: 8,
                                                    borderRadius: 30,
                                                    backgroundColor: '#fff',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    <MaskedView
                                                        style={{ height: 26, width: 80, alignItems: 'center', justifyContent: 'center' }}
                                                        maskElement={
                                                            <Text style={{
                                                                fontFamily: 'Raleway',
                                                                fontWeight: 'bold',
                                                                fontSize: 16,
                                                                // color: color,
                                                                alignSelf: 'center'
                                                            }}>
                                                                {/* 60 Seats */}
                                                                {item.NoOfSeat} Seats
                                                            </Text>
                                                        }
                                                    >
                                                        {/* <Image
                        source={require('../../../assets/images/63812-gradient-background.gif')}
                        //source={require('../../../assets/images/edit2.gif')}
                        style={{height:80,width:80, }}
                        /> */}
                                                        <LottieView
                                                            //source={{uri:item.jsonpath}}
                                                            //source={require('../../../assets/json/63812-gradient-background.json')}
                                                            source={bgfiles[index % bgfiles.length]}
                                                            autoPlay={true}
                                                            loop={true}
                                                            speed={1}
                                                            ref={(animation) => {
                                                                this.anim = animation;
                                                            }}
                                                            resizeMode="cover"
                                                            style={{
                                                                aspectRatio: 0.5,
                                                            }}
                                                        />
                                                    </MaskedView>
                                                </View>
                                            </TouchableOpacity>
                                        </ImageBackground>

                                        {/* <View style={{height:190,width:Dimensions.get('window').width/2-30,borderRadius:26, }}>
                    <LottieView
                        source={require('../../../assets/json/63812-gradient-background.json')}
                        autoPlay={true}
                        loop={true}
                        speed={1}
                        ref={(animation) => {
                            this.anim = animation;
                        }}
                        style={{ 
                            //height: 190, 
                            aspectRatio: 400 / 800,
                           // width: Dimensions.get('window').width / 2-30,
                        }}
                    />
                    </View> */}
                                        {/* <View style={{ flexDirection: 'row',marginTop:55 }}>
                        <MaterialIcons name="person" size={20} color={'#ffffff'} />
                        <Text style={styles.numtextpartyroom}>202</Text>
                    </View>

                    <View style={{ paddingTop: 0, marginBottom: 5 }}>
                        <Text style={styles.partytext}>
                            Party Room Name
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 30, marginRight: 30 }}>

                        <View style={{ paddingTop: 3, paddingBottom: 3, paddingRight: 8, paddingLeft: 8, borderRadius: 30, backgroundColor: '#ffffff' }}>
                            <TouchableOpacity>
                                <Text style={styles.seats}>
                                    6 Seats
                                </Text>
                            </TouchableOpacity>
                        </View> 
                    </View>*/}
                                        {/* </LinearGradient> */}
                                        {/* </View> */}
                                    </TouchableOpacity>
                                </View>
                            )
                        }}
                    />
                </ScrollView>
            </View>
        )
    }

    renderpartyroom1 = () => {
        return (
            <View style={{ width: Dimensions.get('window').width / 2 - 20, marginLeft: 0, }}>
                {/* <LinearGradient
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    colors={['#FD01FC', '#F39EB0', '#01007E']}
                    style={{ height: 100, width: 100, borderRadius: 30, alignItems: 'center', justifyContent: 'center', zIndex: 1, alignSelf: 'center' }}
                >
                </LinearGradient> */}
                <View
                    style={{ height: 100, width: 100, borderRadius: 30, alignItems: 'center', justifyContent: 'center', zIndex: 1, alignSelf: 'center', borderWidth: 1, borderColor: '#ffffff' }}
                >

                </View>
                <View style={{ flex: 1, height: 190, width: Dimensions.get('window').width / 2 - 20 }}>
                    {/* <LinearGradient
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        colors={['#0032E1', '#07D2FF',]}
                        style={{ height: 190, width: Dimensions.get('window').width / 2 - 30, borderRadius: 26, alignItems: 'center', justifyContent: 'center' }}
                    > */}

                    <ImageBackground
                        // source ={{uri:'https://lottiefiles.com/63814-gradient-dots-background'}}
                        // source={require('../../../assets/images/63814-gradient-dots-background.gif')}  
                        //source={require('../../../assets/images/edit1.gif')}
                        imageStyle={{ borderRadius: 26 }}
                        style={{ height: 190, width: Dimensions.get('window').width / 2 - 30, marginTop: -80, overflow: 'hidden', alignItems: 'center' }}
                    >
                        <LottieView
                            source={require('../../../assets/json/63814-gradient-dots-background.json')}
                            autoPlay={true}
                            loop={true}
                            speed={1}
                            ref={(animation) => {
                                this.anim = animation;
                            }}
                            resizeMode="cover"
                            style={{
                                //height:width * sourceHeight / sourceWidth , 
                                aspectRatio: 0.5,

                                //width: Dimensions.get('window').width/2-30,
                            }}
                        />
                        <View style={{ flexDirection: 'row', marginTop: 85 }}>
                            <MaterialIcons name="person" size={20} color={'#ffffff'} />
                            <Text style={styles.numtextpartyroom}>202</Text>
                        </View>

                        <View style={{ paddingTop: 0, marginBottom: 5 }}>
                            <Text style={styles.partytext}>
                                Party Room Name
                            </Text>
                        </View>
                        <TouchableOpacity>
                            <View style={{
                                paddingTop: 3,
                                paddingBottom: 3,
                                paddingRight: 8,
                                paddingLeft: 8,
                                borderRadius: 30,
                                backgroundColor: '#fff',
                                // alignItems:'center',
                                // justifyContent:'center'
                            }}>
                                <MaskedView
                                    style={{ height: 26, width: 80, alignItems: 'center', justifyContent: 'center' }}
                                    maskElement={
                                        <Text style={{
                                            fontFamily: 'Raleway',
                                            fontWeight: 'bold',
                                            fontSize: 16,
                                            // color: color,
                                            alignSelf: 'center'
                                        }}>
                                            16 Seats
                                        </Text>
                                    }
                                >
                                    {/* <Image
                        source={require('../../../assets/images/edit1.gif')}
                        style={{height:80,width:80, }}
                        /> */}
                                    <LottieView
                                        source={require('../../../assets/json/63814-gradient-dots-background.json')}
                                        autoPlay={true}
                                        loop={true}
                                        speed={1}
                                        ref={(animation) => {
                                            this.anim = animation;
                                        }}
                                        resizeMode="cover"
                                        style={{
                                            aspectRatio: 0.5,
                                        }}
                                    />
                                </MaskedView>
                            </View>
                        </TouchableOpacity>
                    </ImageBackground>
                </View>
            </View>
        )
    }


    rendermegastar = () => {
        return (
            <View>
                <ScrollView>
                    <FlatList
                        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 10 }}
                        numColumns={2}
                        keyExtractor={(item, index) => String(item.id)}
                        //data={this.state.userdata}
                        data={this.state.megastardata}
                        renderItem={({ item, index }) => {
                            return (
                                <View style={styles.liveimageview}>
                                    <View elevation={15}
                                        style={styles.imageview}
                                    >
                                        <ImageBackground
                                            //key={item.id}
                                            source={{ uri: item.img }}
                                            imageStyle={{ borderRadius: 24 }}
                                            //source={require('../../../assets/images/lolgrp.png')} 
                                            style={styles.image}
                                        >
                                            <View style={{ width: 60, height: 28, backgroundColor: 'rgba(7, 7, 7, 0.8)', borderBottomRightRadius: 24, position: 'absolute', top: 0, left: 0, borderTopLeftRadius: 24, alignItems: 'center', justifyContent: 'center' }}>
                                                <Text style={{ fontFamily: 'Raleway', fontWeight: '600', fontSize: 14, color: '#ffffff' }}>
                                                    {/* 629 */}
                                                    {item.avluser}
                                                </Text>
                                            </View>

                                        </ImageBackground>
                                    </View>
                                    <Text
                                        //key={item.id} 
                                        style={styles.title}>
                                        {/* Title Username */}
                                        {item.SGName}
                                    </Text>
                                </View>
                            )
                        }}
                    />
                </ScrollView>
            </View>
        )
    }

    renderliverecommend = () => {
        return (
            <View>
                <ScrollView>
                    <FlatList
                        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 10 }}
                        numColumns={2}
                        keyExtractor={(item, index) => String(item.id)}
                        data={this.state.liverecommenddata}
                        renderItem={({ item, index }) => {
                            return (
                                <View style={styles.liveimageview}>
                                    <View elevation={15}
                                        style={styles.imageview}
                                    >
                                        <ImageBackground
                                            source={{ uri: item.img }}
                                            imageStyle={{ borderRadius: 24 }}
                                            //source={require('../../../assets/images/lolgrp.png')} 
                                            style={styles.image}>
                                            <View style={{ width: 60, height: 28, backgroundColor: 'rgba(7, 7, 7, 0.8)', borderBottomRightRadius: 24, position: 'absolute', top: 0, left: 0, borderTopLeftRadius: 24, alignItems: 'center', justifyContent: 'center' }}>
                                                <Text style={{ fontFamily: 'Raleway', fontWeight: '600', fontSize: 14, color: '#ffffff' }}>
                                                    {/* 629 */}
                                                    {item.avluser}
                                                </Text>
                                            </View>

                                        </ImageBackground>
                                    </View>
                                    <Text style={styles.title}>
                                        {/* Title Username */}
                                        {item.SGName}
                                    </Text>
                                </View>
                            )
                        }}
                    />
                </ScrollView>
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
                                    // style={{ height: 42, width: 42, alignItems: 'center', justifyContent: 'center' }}
                                    >

                                        <LinearGradient
                                            start={{ x: 0, y: 0.5 }}
                                            end={{ x: 1, y: 0.5 }}
                                            colors={['#FD01FC', '#01007E',]}
                                            style={{ height: 3, width: 15, alignSelf: 'center', marginBottom: 5, marginLeft: 10 }}
                                        >
                                        </LinearGradient>
                                        <Shadow
                                            style={{
                                                shadowOffset: { width: 0, height: 7 },
                                                shadowOpacity: 0.2,
                                                shadowColor: "#FD01FC",
                                                shadowRadius: 2,
                                                borderRadius: 5,
                                                backgroundColor: 'transparent',
                                                //marginRight: 20,
                                                width: 20,
                                                height: 20,
                                                marginTop: 0
                                            }}>
                                            <Image source={require('../../../assets/images/mdi_party-popper.png')} style={{ height: 30, width: 30 }} />
                                        </Shadow>

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
                                        <Shadow
                                            style={{
                                                shadowOffset: { width: 10, height: 0 },
                                                shadowOpacity: 0.2,
                                                shadowColor: "#FD01FC",
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
                                        // style={{ height: 42, width: 42,borderRadius:21, alignItems: 'center', justifyContent: 'center',borderWidth:2,borderColor:'#FFF8F8' }}
                                        style={{ alignItems: 'center', justifyContent: 'center', marginTop: -20 }}
                                        onPress={() => this.setState({ hometabselected: true, livetabselected: true, exploretabselected: false, chattabselected: false, profiletabselected: false }, () => this.props.navigation.navigate('Createroom'))}
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
                                    onPress={() => this.setState({ hometabselected: true, livetabselected: true, exploretabselected: false, chattabselected: false, profiletabselected: false }, () => this.props.navigation.navigate('Createroom'))}
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
                                        <Shadow
                                            style={{
                                                shadowOffset: { width: 10, height: 0 },
                                                shadowOpacity: 0.2,
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
                                        <Shadow
                                            style={{
                                                shadowOffset: { width: 10, height: 0 },
                                                shadowOpacity: 0.2,
                                                shadowColor: "#FD01FC",
                                                shadowRadius: 5,
                                                borderRadius: 5,
                                                backgroundColor: 'transparent',
                                                //marginRight: 20,
                                                width: 25,
                                                height: 25,
                                            }}>
                                            <Icon name="person" size={35} type="material"
                                                useAngle={true}
                                                angle={180}
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
            </View >
        )
    }

    bannerdropdown = () => {
        return (
            <View style={{ height: Dimensions.get('window').height / 3, width: Dimensions.get('window').width / 2, backgroundColor: '#ffffff', borderBottomLeftRadius: 30, borderBottomRightRadius: 30, marginTop: 10, marginLeft: Dimensions.get('window').width / 2 }}>
                <TouchableOpacity
                    onPress={() => this.setState({ subgroupmasterid: this.state.upcomingliveid, subgroupname: 'Upcoming Live Events', showbannerdropdown: false }, () => this.getuserdata())}
                    style={{ height: 40, width: Dimensions.get('window').width / 2, justifyContent: 'center', alignItems: 'center', borderBottomColor: '#EEEEEE', borderBottomWidth: 1 }}
                >
                    <Text style={{ fontSize: 16, fontFamily: 'Raleway', color: '#202020', marginRight: 15 }}>
                        Upcoming Live Events
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{ height: 40, width: Dimensions.get('window').width / 2, justifyContent: 'center', alignItems: 'center', borderBottomColor: '#EEEEEE', borderBottomWidth: 1 }}
                    onPress={() => this.setState({ subgroupmasterid: this.state.performerrankingid, subgroupname: 'Performer Ranking', showbannerdropdown: false }, () => this.getuserdata())}
                >
                    <Text style={{ fontSize: 16, fontFamily: 'Raleway', color: '#202020', marginRight: 15 }}>
                        Performer Ranking
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{ height: 40, width: Dimensions.get('window').width / 2, justifyContent: 'center', alignItems: 'center', borderBottomColor: '#EEEEEE', borderBottomWidth: 1 }}
                    onPress={() => this.setState({ subgroupmasterid: this.state.fanclubrankingid, subgroupname: 'Fan Club ranking', showbannerdropdown: false }, () => this.getuserdata())}
                >
                    <Text style={{ fontSize: 16, fontFamily: 'Raleway', color: '#202020', marginRight: 15 }}>
                        Fan Club ranking
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{ height: 40, width: Dimensions.get('window').width / 2, justifyContent: 'center', alignItems: 'center', borderBottomColor: '#EEEEEE', borderBottomWidth: 1 }}
                    onPress={() => this.setState({ subgroupmasterid: this.state.videotalentid, subgroupname: 'Video Talent Policy', showbannerdropdown: false }, () => this.getuserdata())}
                >

                    <Text style={{ fontSize: 16, fontFamily: 'Raleway', color: '#202020', marginRight: 15 }}>
                        Video Talent Policy
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }


    render() {
        // console.log('count rendering',1)
        return (
            <View
                style={{ flex: 1 }}
            >
                <View style={{ flex: 0.9 }}>
                    <View style={styles.liveview}>
                        <View style={{ flexDirection: 'row', marginTop: 15, marginLeft: 10, marginRight: 10, justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity
                                    style={{ alignItems: 'center', justifyContent: 'center', marginRight: 20 }}
                                    onPress={() => this.setState({ liveselected: !this.state.liveselected, partyselected: false, livemegastarselected: true, liverecommendselected: false, liveglobalselected: false, livebannerselected: false })}
                                >
                                    {this.state.liveselected ?
                                        <View>
                                            <Text style={styles.livetextselected}>
                                                Live
                                            </Text>
                                            <LinearGradient
                                                start={{ x: 0, y: 0.5 }}
                                                end={{ x: 1, y: 0.5 }}
                                                colors={['#01007E', '#FD01FC',]}
                                                style={{ height: 3, width: 15, alignSelf: 'center' }}
                                            >
                                            </LinearGradient>
                                        </View>
                                        :
                                        <Text style={styles.livetext}>
                                            Live
                                        </Text>
                                    }

                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ alignItems: 'center', justifyContent: 'center', }}
                                    //  onPress={() =>setLiveselected(false),setPartyselected(true)} partyrecommendselected: true
                                    onPress={() => this.setState({ liveselected: false, partyselected: true, partyrecommendselected: true, subgroupmasterid: this.state.partyrecommendid, showbannerdropdown: false, partygamesselected: false, }, () => this.getpartyrecommend())}   //() => this.getpartydata()
                                >
                                    {this.state.partyselected ?
                                        <View>
                                            <Text style={styles.livetextselected}>
                                                Party
                                            </Text>
                                            <LinearGradient
                                                start={{ x: 0, y: 0.5 }}
                                                end={{ x: 1, y: 0.5 }}
                                                colors={['#01007E', '#FD01FC',]}
                                                style={{ height: 3, width: 15, alignSelf: 'center', }}
                                            >
                                            </LinearGradient>
                                        </View>
                                        :
                                        <Text style={styles.livetext}>
                                            Party
                                        </Text>
                                    }
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity
                                    style={{ alignItems: 'center', justifyContent: 'center', marginRight: 20 }}
                                    onPress={() => this.props.navigation.navigate('Createchannel')}
                                >
                                    {/* <MaterialIcons name="person" size={20} /> */}
                                    <Feather name="tv" size={20} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ alignItems: 'center', justifyContent: 'center', marginRight: 20 }}
                                    onPress={() => this.props.navigation.navigate('Channelsearch')}
                                >
                                    <Ionicons name="search-outline" size={20} />
                                </TouchableOpacity>
                                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', marginRight: 20 }}>
                                    <FontAwesome5 name="trophy" size={20} color={'#FFA012'} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        {this.state.liveselected ?
                            <View style={{ flexDirection: 'row', marginLeft: 10, marginTop: 20 }}>
                                {this.state.livemegastarselected ?
                                    <TouchableOpacity
                                        onPress={() => this.setState({ livemegastarselected: true, liveglobalselected: false, liverecommendselected: false, livebannerselected: false, subgroupmasterid: this.state.megastarid, subgroupname: 'Megastar', showbannerdropdown: false }, () => this.getmegastar())}
                                    //style={{ height: 34, width: 118, borderRadius: 16,alignItems:'center',justifyContent:'center',backgroundColor:'#FFA012',marginRight:20  }} 
                                    >
                                        <Shadow
                                            style={{
                                                shadowOffset: { width: 0, height: 7 },
                                                shadowOpacity: 0.3,
                                                shadowColor: "#FEA20C",
                                                shadowRadius: 2,
                                                borderRadius: 16,
                                                backgroundColor: 'white',
                                                marginRight: 20,
                                                width: 105,
                                                height: 34,
                                            }}
                                        >
                                            <LinearGradient
                                                start={{ x: 0, y: 0.5 }}
                                                end={{ x: 1, y: 0.5 }}
                                                colors={['#FFA012', '#FCA600']}
                                                style={{ height: 34, width: 105, borderRadius: 16, justifyContent: 'center', marginRight: 20, alignItems: 'center' }}
                                            >
                                                <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10, marginLeft: 0, justifyContent: 'center' }}>
                                                    <LottieView
                                                        source={require('../../../assets/json/4892-star.json')}
                                                        autoPlay={true}
                                                        loop={true}
                                                        speed={1}
                                                        ref={(animation) => {
                                                            this.anim = animation;
                                                        }}
                                                        style={{ height: 45, width: 45, marginRight: -10 }}
                                                    />
                                                    <Text style={styles.megastar}>
                                                        Megastar
                                                    </Text>
                                                </View>
                                            </LinearGradient>
                                        </Shadow>
                                    </TouchableOpacity>

                                    :

                                    <TouchableOpacity
                                        style={{ marginRight: 20, alignItems: 'center', justifyContent: 'center' }}
                                        onPress={() => this.setState({ livemegastarselected: true, liveglobalselected: false, liverecommendselected: false, livebannerselected: false, subgroupmasterid: this.state.megastarid, subgroupname: 'Megastar', showbannerdropdown: false }, () => this.getmegastar())}
                                    // style={{ height: 34, width: 118, borderRadius: 16,alignItems:'center',justifyContent:'center',backgroundColor:'#FFA012'  }} 
                                    >
                                        <Text style={styles.recommend}>
                                            Megastar
                                        </Text>
                                    </TouchableOpacity>
                                }
                                {this.state.liverecommendselected ?
                                    <TouchableOpacity
                                        onPress={() => this.setState({ livemegastarselected: false, liveglobalselected: false, liverecommendselected: true, livebannerselected: false, subgroupmasterid: this.state.liverecommendid, subgroupname: 'Recommended', showbannerdropdown: false }, () => this.getliverecommend())}
                                    //style={{ height: 34, width: 130, borderRadius: 16,alignItems:'center',justifyContent:'center',backgroundColor:'transparent',marginRight:20  }} 
                                    >
                                        <Shadow
                                            style={{
                                                shadowOffset: { width: 0, height: 7 },
                                                shadowOpacity: 0.3,
                                                shadowColor: "#FF7400",
                                                shadowRadius: 2,
                                                borderRadius: 16,
                                                backgroundColor: 'white',
                                                marginRight: 20,
                                                width: 125,
                                                height: 34,
                                            }}
                                        >
                                            <LinearGradient
                                                start={{ x: 0, y: 0.5 }}
                                                end={{ x: 1, y: 0.5 }}
                                                colors={['#FF5C00', '#EA4335']}
                                                style={{ height: 34, width: 125, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 20 }}
                                            >
                                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                                    <LottieView
                                                        source={require('../../../assets/json/58634-fire.json')}
                                                        autoPlay={true}
                                                        loop={true}
                                                        speed={1}
                                                        ref={(animation) => {
                                                            this.anim = animation;
                                                        }}
                                                        style={{ height: 25, width: 25 }}
                                                    />
                                                    <Text style={styles.partyrecommend}>
                                                        Recommend
                                                    </Text>
                                                </View>

                                            </LinearGradient>
                                        </Shadow>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity
                                        onPress={() => this.setState({ livemegastarselected: false, liveglobalselected: false, liverecommendselected: true, livebannerselected: false, subgroupmasterid: this.state.liverecommendid, subgroupname: 'Recommended', showbannerdropdown: false }, () => this.getliverecommend())}
                                        style={{ marginRight: 20, alignItems: 'center', justifyContent: 'center' }}
                                    // style={{ height: 34, width: 118, borderRadius: 16,alignItems:'center',justifyContent:'center',backgroundColor:'#FFA012'  }} 
                                    >
                                        <Text style={styles.recommend}>
                                            Recommend
                                        </Text>
                                    </TouchableOpacity>
                                }
                                {this.state.liveglobalselected ?
                                    <TouchableOpacity
                                        onPress={() => this.setState({ livemegastarselected: false, liveglobalselected: true, liverecommendselected: false, livebannerselected: false, showbannerdropdown: false })}
                                    //style={{ height: 34, width: 118, borderRadius: 16,alignItems:'center',justifyContent:'center',backgroundColor:'#FFA012',marginRight:20  }} 
                                    >
                                        <Shadow
                                            style={{
                                                shadowOffset: { width: 0, height: 7 },
                                                shadowOpacity: 0.3,
                                                shadowColor: "#3A59FF",
                                                shadowRadius: 2,
                                                borderRadius: 16,
                                                backgroundColor: 'white',
                                                marginRight: 20,
                                                width: 90,
                                                height: 34,
                                            }}
                                        >
                                            <LinearGradient
                                                start={{ x: 0, y: 0.5 }}
                                                end={{ x: 1, y: 0.5 }}
                                                colors={['#3331FF', '#39F3FF']}
                                                style={{ height: 34, width: 90, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 20 }}
                                            >
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <LottieView
                                                        source={require('../../../assets/json/43310-globe-map-1.json')}
                                                        autoPlay={true}
                                                        loop={true}
                                                        speed={1}
                                                        ref={(animation) => {
                                                            this.anim = animation;
                                                        }}
                                                        style={{ height: 25, width: 25, marginRight: 5 }}
                                                    />
                                                    <Text style={styles.partyrecommend}>
                                                        Global
                                                    </Text>
                                                </View>
                                            </LinearGradient>
                                        </Shadow>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity
                                        onPress={() => this.setState({ livemegastarselected: false, liveglobalselected: true, liverecommendselected: false, livebannerselected: false, showbannerdropdown: false })}
                                        style={{ alignItems: 'center', justifyContent: 'center', marginRight: 20 }}
                                    //style={{ height: 34, width: 118, borderRadius: 16,alignItems:'center',justifyContent:'center',backgroundColor:'#FFA012'  }} 
                                    >
                                        <Text style={styles.recommend}>
                                            Global
                                        </Text>
                                    </TouchableOpacity>
                                }
                                {this.state.livebannerselected ?
                                    <TouchableOpacity
                                        onPress={() => this.setState({ livemegastarselected: false, liveglobalselected: false, liverecommendselected: false, livebannerselected: true, showbannerdropdown: !this.state.showbannerdropdown })}
                                    //style={{ height: 34, width: 118, borderRadius: 16,alignItems:'center',justifyContent:'center',backgroundColor:'#FFA012',marginRight:20  }} 
                                    >
                                        <Shadow
                                            style={{
                                                shadowOffset: { width: 0, height: 7 },
                                                shadowOpacity: 0.3,
                                                //shadowColor: "#FEA20C",
                                                shadowColor: "#23A742",
                                                shadowRadius: 2,
                                                borderRadius: 16,
                                                backgroundColor: 'white',
                                                marginRight: 20,
                                                width: 105,
                                                height: 34,
                                            }}
                                        >
                                            <LinearGradient
                                                start={{ x: 0, y: 0.5 }}
                                                end={{ x: 1, y: 0.5 }}
                                                //colors={['#3331FF', '#39F3FF']}
                                                colors={['#009A2B', '#7CC97A',]}
                                                style={{ height: 34, width: 105, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 20 }}
                                            >
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <LottieView
                                                        source={require('../../../assets/json/6121-live-animation.json')}
                                                        autoPlay={true}
                                                        loop={true}
                                                        speed={1}
                                                        ref={(animation) => {
                                                            this.anim = animation;
                                                        }}
                                                        style={{ height: 40, width: 40, marginRight: -2, marginBottom: 2 }}
                                                    />
                                                    <Text style={styles.partyrecommend}>
                                                        Banner
                                                    </Text>
                                                    <Entypo name="triangle-down" size={15} color={'#fff'} />
                                                </View>
                                            </LinearGradient>
                                        </Shadow>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity
                                        onPress={() => this.setState({ livemegastarselected: false, liveglobalselected: false, liverecommendselected: false, livebannerselected: true, showbannerdropdown: true })}
                                        style={{ alignItems: 'center', justifyContent: 'center' }}
                                    //style={{ height: 34, width: 118, borderRadius: 16,alignItems:'center',justifyContent:'center',backgroundColor:'#FFA012'  }} 
                                    >
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={styles.recommend}>
                                                Banner
                                            </Text>
                                            <Entypo name="triangle-down" size={15} />
                                        </View>
                                    </TouchableOpacity>
                                }

                            </View>
                            :
                            <View>
                                <ScrollView
                                    horizontal
                                >
                                    <View style={{ flexDirection: 'row', marginLeft: 10, marginTop: 20, marginBottom: 15 }}>
                                        {this.state.partyrecommendselected ?
                                            <TouchableOpacity
                                                onPress={() => this.setState({ partyrecommendselected: true, partygamesselected: false, subgroupmasterid: this.state.partyrecommendid, subgroupname: 'Recommended', showbannerdropdown: false }, () => this.getpartyrecommend())}
                                            //style={{ height: 34, width: 118, borderRadius: 16,alignItems:'center',justifyContent:'center',backgroundColor:'#FFA012',marginRight:20  }} 
                                            >
                                                <Shadow
                                                    style={{
                                                        shadowOffset: { width: 0, height: 7 },
                                                        shadowOpacity: 0.3,
                                                        shadowColor: "#FF5B00",
                                                        shadowRadius: 2,
                                                        borderRadius: 16,
                                                        backgroundColor: 'white',
                                                        marginRight: 20,
                                                        width: 125,
                                                        height: 34,
                                                    }}
                                                >
                                                    <LinearGradient
                                                        start={{ x: 0, y: 0.5 }}
                                                        end={{ x: 1, y: 0.5 }}
                                                        colors={['#FF5C00', '#EA4335']}
                                                        style={{ height: 34, width: 125, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 20, }}
                                                    >
                                                        <View style={{ flexDirection: 'row', }}>
                                                            {/* <SimpleLineIcons name="fire" size={20} color={'#FFA012'} /> */}
                                                            <LottieView
                                                                source={require('../../../assets/json/58634-fire.json')}
                                                                autoPlay={true}
                                                                loop={true}
                                                                speed={3}
                                                                ref={(animation) => {
                                                                    this.anim = animation;
                                                                }}
                                                                style={{ height: 25, width: 25 }}
                                                            />
                                                            <Text style={styles.partyrecommend}>
                                                                Recommend
                                                            </Text>
                                                        </View>
                                                    </LinearGradient>
                                                </Shadow>
                                            </TouchableOpacity>
                                            :
                                            <TouchableOpacity
                                                onPress={() => this.setState({ partyrecommendselected: true, partygamesselected: false, subgroupmasterid: this.state.partyrecommendid, subgroupname: 'Recommended', showbannerdropdown: false }, () => this.getuserdata())}
                                                style={{ alignItems: 'center', justifyContent: 'center', marginRight: 20 }}
                                            //style={{ height: 34, width: 118, borderRadius: 16,alignItems:'center',justifyContent:'center',backgroundColor:'#FFA012'  }} 
                                            >
                                                <Text style={styles.games}>
                                                    Recommend
                                                </Text>
                                            </TouchableOpacity>
                                        }
                                        {this.state.partygamesselected ?
                                            <TouchableOpacity
                                                // style={{ marginRight: 20, alignItems: 'center', justifyContent: 'center' }}
                                                // style={{ height: 34, width: 118, borderRadius: 16,alignItems:'center',justifyContent:'center',backgroundColor:'#FFA012'  }} 
                                                onPress={() => this.setState({ partyrecommendselected: false, partygamesselected: true, subgroupmasterid: this.state.gamesid, subgroupname: 'Games' }, () => this.getuserdata())}
                                            >
                                                <Shadow
                                                    style={{
                                                        shadowOffset: { width: 0, height: 7 },
                                                        shadowOpacity: 0.3,
                                                        //shadowColor: "#FF5B00",
                                                        shadowColor: "#F8A01A",
                                                        shadowRadius: 2,
                                                        borderRadius: 16,
                                                        backgroundColor: 'white',
                                                        marginRight: 20,
                                                        width: 90,
                                                        height: 34,
                                                    }}
                                                >
                                                    <LinearGradient
                                                        start={{ x: 0, y: 0.5 }}
                                                        end={{ x: 1, y: 0.5 }}
                                                        colors={['#F79423', '#FBBC05',]}
                                                        //colors={['#FF5C00', '#EA4335']}
                                                        style={{ height: 34, width: 90, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 20 }}
                                                    >
                                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                                            {/* <SimpleLineIcons name="fire" size={20} color={'#FFA012'} /> */}
                                                            <LottieView
                                                                source={require('../../../assets/json/24219-controller.json')}
                                                                autoPlay={true}
                                                                loop={true}
                                                                speed={1}
                                                                ref={(animation) => {
                                                                    this.anim = animation;
                                                                }}
                                                                style={{ height: 30, width: 30, marginRight: 0 }}
                                                            />
                                                            <Text style={styles.partyrecommend}>
                                                                Games
                                                            </Text>
                                                        </View>
                                                    </LinearGradient>
                                                </Shadow>
                                            </TouchableOpacity>
                                            :
                                            <TouchableOpacity
                                                onPress={() => this.setState({ partyrecommendselected: false, partygamesselected: true, subgroupmasterid: this.state.gamesid, subgroupname: 'Games' }, () => this.getuserdata())}
                                                style={{ alignItems: 'center', justifyContent: 'center', marginRight: 20 }}
                                            //style={{ height: 34, width: 118, borderRadius: 16,alignItems:'center',justifyContent:'center',backgroundColor:'#FFA012'  }} 
                                            >
                                                <Text style={styles.games}>
                                                    Games
                                                </Text>
                                            </TouchableOpacity>
                                        }

                                        <TouchableOpacity
                                            style={{ alignItems: 'center', justifyContent: 'center', marginRight: 20 }}

                                        //style={{ height: 34, width: 118, borderRadius: 16,alignItems:'center',justifyContent:'center',backgroundColor:'#FFA012'  }} 
                                        >
                                            <Text style={styles.games}>
                                                Dating
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={{ alignItems: 'center', justifyContent: 'center', marginRight: 20 }}
                                        //style={{ height: 34, width: 118, borderRadius: 16,alignItems:'center',justifyContent:'center',backgroundColor:'#FFA012'  }} 
                                        >
                                            <Text style={styles.games}>
                                                Chat
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={{ alignItems: 'center', justifyContent: 'center', marginRight: 20 }}
                                        //style={{ height: 34, width: 118, borderRadius: 16,alignItems:'center',justifyContent:'center',backgroundColor:'#FFA012'  }} 
                                        >
                                            <Text style={styles.games}>
                                                Multi-video
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={{ alignItems: 'center', justifyContent: 'center', marginRight: 20 }}
                                        //style={{ height: 34, width: 118, borderRadius: 16,alignItems:'center',justifyContent:'center',backgroundColor:'#FFA012'  }} 
                                        >
                                            <Text style={styles.games}>
                                                Family
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </ScrollView>
                            </View>
                        }
                    </View>
                    {this.state.showbannerdropdown ?
                        <View>
                            {this.bannerdropdown()}
                        </View>
                        : null}

                    <ScrollView>
                        {this.state.liveselected ?
                            this.state.livemegastarselected ?
                                <View style={{ marginLeft: 10, marginRight: 10, marginTop: 15, }}>
                                    {this.state.showmegastarloader ?
                                        this.rendermegastar()
                                        :
                                        <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                                            <ActivityIndicator size="small" color="#2e3191" />
                                        </View>
                                    }
                                </View>
                                /*<View style={{ flexDirection: 'row', marginLeft: 10, marginRight: 10, justifyContent: 'space-between', marginTop: 15 }}>
                                    <View style={styles.liveimageview}>
                                        <View elevation={15}
                                            style={styles.imageview}
                                        >
                                            <Image source={require('../../../assets/images/lolgrp.png')} style={styles.image} />
                                        </View>
                                        <Text style={styles.title}>Title Username</Text>
                                    </View>

                                    <View style={styles.liveimageview}>
                                        <View elevation={15}
                                            style={styles.imageview}
                                        >
                                            <ImageBackground
                                                source={require('../../../assets/images/lolgrp.png')}
                                                style={styles.image}>
                                            </ImageBackground>
                                        </View>
                                        <Text style={styles.title}>Title Username</Text>
                                    </View>
                                </View>*/

                                :
                                this.state.liverecommendselected ?
                                    <View style={{ marginLeft: 10, marginRight: 10, marginTop: 15, }}>
                                        {this.renderliverecommend()}
                                    </View>

                                    :
                                    <View style={{ flexDirection: 'row', marginLeft: 10, marginRight: 10, justifyContent: 'space-between', marginTop: 15 }}>
                                        <View style={styles.liveimageview}>
                                            <View elevation={15}
                                                style={styles.imageview}
                                            >
                                                <Image source={require('../../../assets/images/newlogo.png')} style={styles.image} />
                                            </View>
                                            <Text style={styles.title}>Title Username</Text>
                                        </View>

                                        <View style={styles.liveimageview}>
                                            <View elevation={15}
                                                style={styles.imageview}
                                            >
                                                <Image source={require('../../../assets/images/newlogo.png')} style={styles.image} />
                                            </View>
                                            <Text style={styles.title}>Title Username</Text>
                                        </View>
                                    </View>
                            :
                            this.state.partyrecommendselected ?
                                <View style={{ marginTop: 15 }}>
                                    <View>
                                        {this.rendertrendingcard()}
                                    </View>
                                    <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                                        <Text style={{ fontFamily: 'Raleway', fontWeight: '600', fontSize: 18, color: '#202020' }}>
                                            You may like it
                                        </Text>
                                        <Image source={require('../../../assets/images/bookmark.png')} style={{ height: 18, width: 18, marginTop: 5, marginLeft: 5 }} />
                                    </View>
                                    <View style={{ marginTop: 20, marginLeft: 10, marginRight: 10 }}>
                                        {this.state.showpartyrecommendloader ?
                                            this.renderpartyroom()
                                            :
                                            <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                                                <ActivityIndicator size="small" color="#2e3191" />
                                            </View>
                                        }
                                        {/* {this.renderpartyroom1()}  flexDirection: 'row', justifyContent: 'space-between',*/}
                                    </View>
                                </View>
                                :
                                null
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
        height: 130,
        width: Dimensions.get('window').width,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        backgroundColor: '#ffffff'
    },
    livetextselected: {
        fontFamily: 'Raleway',
        fontWeight: 'bold',
        fontSize: 30,
        color: '#202020'
    },
    livetext: {
        fontFamily: 'Raleway',
        fontWeight: '600',
        fontSize: 20,
        color: '#4D4D4D'
    },
    megastar: {
        fontFamily: 'Raleway',
        fontWeight: 'bold',
        fontSize: 15,
        color: '#ffffff',
        //textAlign: 'center',
        textAlignVertical: 'center',
        marginBottom: 2,
    },
    recommend: {
        fontFamily: 'Raleway',
        fontWeight: 'bold',
        fontSize: 15,
        color: '#4D4D4D'
    },
    liveimageview: {
        width: Dimensions.get('window').width / 2 - 20,
        height: 180,
        borderRadius: 24,
        backgroundColor: '#ffffff',
        zIndex: 1,
    },
    imageview: {
        backgroundColor: '#ffffff',
        borderRadius: 24,
        height: 128,
        width: Dimensions.get('window').width / 2 - 30,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5,
        zIndex: 2,
    },
    image: {
        height: 128,
        width: Dimensions.get('window').width / 2 - 30,
        //borderRadius: 24,
        //zIndex:1,
        //marginLeft: 5,
        //marginRight: 5,
        // marginTop: 5,

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
        fontWeight: 'bold',
        fontSize: 15,
        color: '#ffffff',
        //textAlign:'center',
        //alignSelf:'center'
        textAlignVertical: 'center',
        marginBottom: 2
    },
    games: {
        fontFamily: 'Raleway',
        fontWeight: 'bold',
        fontSize: 15,
        color: '#4D4D4D'
    },
    partyroomtext: {
        fontFamily: 'Raleway',
        fontWeight: 'bold',
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
        fontWeight: 'bold',
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

