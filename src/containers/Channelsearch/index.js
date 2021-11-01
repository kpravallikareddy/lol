import React, { Component } from 'react';
import { View, BackHandler, Image, Text, Platform, Dimensions, StyleSheet, TouchableOpacity, ScrollView, Modal, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import LottieView from 'lottie-react-native';
import { Icon } from 'react-native-gradient-icon';
import { Shadow } from 'react-native-neomorph-shadows';
import { TextInput } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../api';

// export function Live({navigation}) {

// useEffect(() =>{
//     // setTimeout(() => {
//     //     navigation.navigate('Login')
//     // }, 2000);

// },[]);

// const [liveselected,setLiveselected] = useState(true);
// const [partyselected,setPartyselected] = useState(false);

export default class Channelsearch extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            livetabselected: false,
            exploretabselected: false,
            hometabselected: false,
            chattabselected: true,
            profiletabselected: false,
            unseenmessages: 0,
            userid: '',
            search: '',
            searchresult: [],
            channeluniqueid: '',
            listofchannels: [],
            showloader:false,
        }
    }

    async componentDidMount() {
        //  this.setState({liveselected:!this.state.liveselected})
        // setTimeout(() => {
        //     this.props.navigation.navigate('Searchchannel')
        // }, 2000);

        await AsyncStorage.getItem('userid').then((userid) => {
            if (userid) {
                this.setState({ userid: JSON.parse(userid) });
            }
            else {
                console.log('no userid')
            }
        });

        //await this.getchannels();
        await this.getlistofchannels();
    }

    getchannels = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            // "querytype": "GETEndUserlistfChanel",
            // "UserId": this.state.userid,
            // "userSubGroupMasterUniqueID":0   //this.state.channelid
            "querytype": "GETEndUserChanel",
            "CreatedBY": this.state.userid,
            "SubGroupMasterId": 0
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
                console.log('get channel----', result)
                this.setState({ listofchannels: [] });
                if (result.status == 200 && result.data == '') {
                    alert('No results found')
                }
                else if (result.status == 200 && result.data.length > 0) {
                    for (let i = 0; i < result.data.length; i++) {
                        this.state.listofchannels.push(result.data[i])
                    }
                }
                else {
                    alert(result.msg)
                }

            })
            .catch(error => console.log('error', error));
    }

    addusertochannel = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "userSubGroupMasterUniqueID": this.state.channeluniqueid,      //"7d51b5d3-27fb-11ec-9526-005056436bc8",
            "SubGroupMasterId": 7,
            "CommuncationUserId": 0,
            "UserId": this.state.userid
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(BASE_URL+"user/setAllusercommuncation/AddusertoChannel", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('channels-----', result)
                if(result.status == 200){
                    alert('Successfully added to the channel')
                    this.getlistofchannels();
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

    searchchannel = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "querytype": "suggestsearch",
            "test": this.state.search
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(BASE_URL+"user/details/suggestsearch", requestOptions)
            .then(response => response.json())
            .then(result => {
                // this.setState({ listofchannels: [] })
                this.setState({ searchresult: [] });
                console.log('search result-----', result)
                if (result.status == 200 && result.data == '') {
                    alert('No results found')
                }
                else if (result.status == 200 && result.data.length > 0) {
                    for (let i = 0; i < result.data.length; i++) {
                        this.state.searchresult.push(result.data[i])
                    }
                }
                else {
                    alert(result.msg)
                }
            })
            .catch(error => console.log('error', error));
    }


    topsearch=()=>{
        var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
    "querytype":"suggestsearch",
    "test":this.state.search
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch(BASE_URL+"user/details/suggestsearch", requestOptions)
  .then(response => response.json())
  .then(result => {
      console.log('topsearch-----',result)
    })
  .catch(error => console.log('error', error));
    }

    searchchannel1 = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "language": this.state.search,
            "querytype": "searchchanel"
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(BASE_URL+"user/details/search", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('search result-----', result)
                if (result.status == 200 && result.data == '') {
                    alert('No results found')
                }
                else if (result.status == 200 && result.data.length > 0) {
                    for (let i = 0; i < result.data.length; i++) {
                        this.state.listofchannels.push(result.data[i])
                    }
                }
                else {
                    alert(result.msg)
                }
            })
            .catch(error => console.log('error', error));
    }

    getlistofchannels = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        // 
        
        var raw = JSON.stringify({
            "querytype":"EnduserCreatedOrjoin",
            "UserId":this.state.userid,
            "groupId":0
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(BASE_URL+"user/details/EnduserCreatedOrjoin", requestOptions)
            .then(response => response.json())
            .then(result => {
                //console.log('channels-------', result)
                this.setState({ listofchannels: [] });
                if (result.status == 200 && result.data == '') {
                    alert('No results found')
                }
                else if (result.status == 200 && result.data.length > 0) {
                    
                    for (let i = 0; i < result.data.length; i++) {
                        this.state.listofchannels.push(result.data[i])
                    }

                    this.setState({showloader:true})
                }
                else {
                    alert(result.msg)
                }
                console.log('listof channels-----',this.state.listofchannels)
            })
            .catch(error => console.log('error', error));
    }


    renderchannel = () => {
        return this.state.listofchannels.map((item) => {
            return (
                <View>
                    <View style={styles.frinedview}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginRight: 10, marginLeft: 15 }}>
                            <View style={{ flexDirection: 'row', }}>
                                <View style={{ marginRight: 10 }}>
                                    <Image
                                        source={{ uri: item.img }}
                                        //source={require('../../../assets/images/newlogo.png')} 
                                        style={styles.profile} />
                                </View>
                                <View>
                                    <Text style={styles.topsearch}>
                                        {/* Channel Name */}
                                        {item.SGName}
                                    </Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={styles.usersview}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Feather name="users" size={12} color={'#BA85D2'} />
                                                <Text style={styles.usernumber}>
                                                    231
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={styles.makefreindsview}>
                                            <Text style={styles.makefriendstext}>
                                                Make Friends
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <View>
                                </View>
                            </View>

                            <LinearGradient
                                start={{ x: 0, y: 0.5 }}
                                end={{ x: 1, y: 0.5 }}
                                colors={['#01007E', '#FD01FC',]}
                                style={{ height: 48, width: 90, alignItems: 'center', justifyContent: 'center', borderRadius: 20 }}
                            >
                                <TouchableOpacity
                                    onPress={() => { this.setState({ channeluniqueid: item.UniqueID }, () => this.addusertochannel()) }}
                                >
                                    {/* <View style={{ flexDirection: 'row' }}>
                                    <Feather name="user-check" size={15} color={'#ffffff'} style={{ marginRight: 5 }} /> */}
                                    <Text style={styles.friendstext}>
                                        JOIN
                                    </Text>
                                    {/* </View> */}
                                </TouchableOpacity>
                            </LinearGradient>

                        </View>
                    </View>
                </View>
            )
        })
    }


    rendersuggestedparties = () => {
        return (
            <View style={{ flexDirection: 'row' }}>
                <View style={styles.suggestedpartiesview}>
                    <Text style={styles.topsearch}>
                        Parties Heading
                    </Text>
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <View >
                            <Image source={require('../../../assets/images/newlogo.png')} style={styles.suggestedprofile} />
                        </View>
                        <View style={styles.suggestedchat}>
                            <Text style={styles.chattext}>
                                Chat
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.suggestedpartiesview}>
                    <Text style={styles.topsearch}>
                        Parties Heading
                    </Text>
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <View >
                            <Image source={require('../../../assets/images/newlogo.png')} style={styles.suggestedprofile} />
                        </View>
                        <View style={styles.suggestedchat}>
                            <Text style={styles.chattext}>
                                Chat
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.suggestedpartiesview}>
                    <Text style={styles.topsearch}>
                        Parties Heading
                    </Text>
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <View >
                            <Image source={require('../../../assets/images/newlogo.png')} style={styles.suggestedprofile} />
                        </View>
                        <View style={styles.suggestedchat}>
                            <Text style={styles.chattext}>
                                Chat
                            </Text>
                        </View>
                    </View>
                </View>

            </View>
        )
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
    //                                     style={{ height: 42, width: 42, alignItems: 'center', justifyContent: 'center' }}
    //                                 onPress={() =>this.props.navigation.navigate('Live')}
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
    //                              //onPress={() =>this.props.navigation.navigate('Live')}
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
                                    style={{ height: 50, width: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 25, borderColor: '#ffffff', borderWidth: 2, marginTop: -20, backgroundColor: '#000000' }}
                                >
                                    {/* <MaterialIcons name="home" size={25} color={'#ffffff'}/> */}
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
                                        //onPress={() =>this.props.navigation.navigate('Profile')}
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
                                    // onPress={() =>this.props.navigation.navigate('Profile')}
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
                    <ScrollView>
                    <View style={{
                        height: 340,
                        width: Dimensions.get('window').width,
                        borderBottomLeftRadius: 30,
                        borderBottomRightRadius: 30,
                        backgroundColor: '#ffffff'
                    }}>
                        <View style={{ flexDirection: 'row', marginTop: 15, marginLeft: 10, marginRight: 10, justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity
                                    style={{ alignItems: 'center', justifyContent: 'center', marginRight: 20, }}
                                    onPress={() => this.props.navigation.goBack()}
                                >
                                    <Ionicons name="arrow-back" size={25} />
                                </TouchableOpacity>
                                <View>
                                    {/* <Text style={styles.searchtext}>
                                    Search User/Channel
                                </Text> */}
                                    <TextInput
                                        placeholder="Search User/Channel"
                                        onChangeText={(text) => this.setState({ search: text }, () => this.searchchannel())}
                                        style={styles.searchtext}
                                        value={this.state.search}
                                    />
                                </View>
                            </View>
                            <View>
                                <TouchableOpacity
                                    style={{ alignItems: 'center', justifyContent: 'center', marginRight: 20 }}
                                    onPress={() => this.setState({ search: '' })}
                                >
                                    <Ionicons name="close-outline" size={25} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{ margin: 15, marginBottom: 0 }}>
                            <Text style={styles.topsearch}>
                                Top Search
                            </Text>
                        </View>

                        <View style={{ height: 40, width: Dimensions.get('window').width, marginTop: 20, marginLeft: 5, }}>
                            <ScrollView horizontal>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                                    {/* {this.state.channelselected ? */}
                                    <View>
                                        <TouchableOpacity
                                            style={{ alignItems: 'center', justifyContent: 'center', marginRight: 10 }}
                                            onPress={() => this.setState({ friendsselected: false, followingselected: false, followerselected: false, channelselected: true })}
                                        >
                                            <View>
                                                <LinearGradient
                                                    start={{ x: 0, y: 0.5 }}
                                                    end={{ x: 1, y: 0.5 }}
                                                    colors={['#009A2B', '#7CC97A',]}
                                                    style={{ height: 34, width: 114, alignItems: 'center', justifyContent: 'center', borderRadius: 16.5 }}
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
                                                                style={{ height: 25, width: 25, marginRight: 15 }}
                                                            />
                                                        </View>
                                                        <Text style={styles.friendstext}>
                                                            Channel
                                                        </Text>
                                                    </View>
                                                </LinearGradient>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    {/* :
                                    <TouchableOpacity
                                        style={{ marginLeft: 0, marginTop: 0 }}
                                        onPress={() => this.setState({ friendsselected: false, followingselected: false, followerselected: false, channelselected: true })}
                                    >
                                        <Text style={styles.followingtext}>
                                            Channel
                                        </Text>
                                    </TouchableOpacity>
                                } */}


                                    <View>
                                        <TouchableOpacity style={styles.topsearchtagsview}>
                                            <Text style={styles.topsearch}>
                                                Tamil
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View>
                                        <TouchableOpacity style={styles.topsearchtagsview}>
                                            <Text style={styles.topsearch}>
                                                Hindi
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>

                        <View style={{ margin: 15, marginBottom: 10 }}>
                            <Text style={styles.topsearch}>
                                Suggested Parties
                            </Text>
                        </View>
                        <ScrollView horizontal={true}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 10, }}>
                                {this.rendersuggestedparties()}
                            </View>
                        </ScrollView>
                    </View>

                    <View style={{ margin: 15, marginBottom: 10 }}>
                        <Text style={styles.topsearch}>
                            Channel
                        </Text>
                    </View>


                    <View style={{ marginLeft: 10, marginRight: 10, marginBottom:30 }}>
                        {this.state.showloader ?
                            this.renderchannel()
                            :
                            <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                                <ActivityIndicator size="small" color="#2e3191" />
                            </View>
                        }
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
    mobiletopview: {
        height: 180,
        width: Dimensions.get('window').width,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        backgroundColor: '#ffffff'
    },
    searchtext: {
        fontFamily: 'Raleway',
        fontWeight: '600',
        fontSize: 16,
        color: '#888888'
    },
    topsearch: {
        fontFamily: 'Raleway',
        fontWeight: '700',
        fontSize: 16,
        color: '#202020',
        //textAlign: 'center',
        // marginTop: 10
    },
    topsearchtagsview: {
        paddingLeft: 10,
        paddingRight: 10,
        //paddingTop:2,
        //paddingBottom:2,
        height: 34,
        borderRadius: 16.5,
        backgroundColor: '#C4C4C4',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    suggestedpartiesview: {
        height: 108,
        width: Dimensions.get('window').width / 2 - 50,
        borderRadius: 18,
        backgroundColor: '#CEBFEE',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15
    },
    suggestedprofile: {
        width: 30,
        height: 30,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        borderBottomLeftRadius: 16,
        borderWidth: 1,
        borderColor: '#ffffff',
        zIndex: 1,
    },
    suggestedchat: {
        width: 65,
        height: 30,
        //borderTopLeftRadius:16,
        borderTopRightRadius: 16,
        //borderBottomLeftRadius:16,
        backgroundColor: '#6B38DE',
        //alignItems:'center',
        justifyContent: 'center',
        marginLeft: -15,
    },
    chattext: {
        fontFamily: 'Raleway',
        fontWeight: '700',
        fontSize: 16,
        color: '#ffffff',
        marginLeft: 22,
        //textAlign:'center'
    },
    friendstext: {
        fontFamily: 'Raleway',
        fontWeight: '700',
        fontSize: 16,
        color: '#ffffff'
    },
    makefreindsview: {
        height: 22,
        width: 90,
        borderRadius: 20,
        backgroundColor: '#FFC6D2',
        alignItems: 'center',
        justifyContent: 'center',
    },
    makefriendstext: {
        fontFamily: 'Raleway',
        fontWeight: '500',
        fontSize: 12,
        color: '#EC899E',
    },
    usersview: {
        height: 22,
        width: 45,
        borderRadius: 20,
        backgroundColor: '#E8D7FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 5
    },
    usernumber: {
        fontFamily: 'Raleway',
        fontWeight: '400',
        fontSize: 12,
        color: '#B57AD0',
    },
    mobilecontactstext: {
        fontFamily: 'Raleway',
        fontWeight: '800',
        fontSize: 22,
        color: '#202020'
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
        width: Dimensions.get('window').width - 20,
        //borderBottomColor: '#D9D9D9',
        //borderBottomWidth: 1,
        // alignItems:'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 20,
        marginBottom:10,
        // marginLeft: 5,
        // marginRight: 5,
        // marginTop: 5,
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
    },
    sharelocation: {
        width: 40,
        height: 40,
        borderRadius: 16,
        backgroundColor: '#E96FE8',
        marginRight: 5,
    },
    channelmanagedview: {
        height: 80,
        width: Dimensions.get('window').width - 20,
        //borderBottomColor: '#D9D9D9',
        //borderBottomWidth: 1,
        //alignItems:'center',
        justifyContent: 'center',
        borderRadius: 20,
        backgroundColor: '#ffffff'
        // marginLeft: 5,
        // marginRight: 5,
        // marginTop: 5,
    },


})

