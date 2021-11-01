import React, { Component } from 'react';
import { View, BackHandler, Image, Text, Platform, Dimensions, StyleSheet, TouchableOpacity, ScrollView, Modal, } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import LottieView from 'lottie-react-native';
import { Icon } from 'react-native-gradient-icon';
import { Shadow } from 'react-native-neomorph-shadows';
import { TextInput } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { BASE_URL } from '../../api';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default class Createchannel extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            livetabselected: true,
            exploretabselected: false,
            hometabselected: false,
            chattabselected: false,
            profiletabselected: false,
            unseenmessages:0,
            userid:'',
            search:'',
            searchresult:[],
            mygroupselected:true,
            recentlyvisitedslected:false,
            channelmanagedselected:false,
            managedroomselected:false,
            channelid: '',
            listofchannels:[],
            channeluniqueid:'',
            showcreatemodel:false,
            channelname:'',
            profileUri: '',
            profileimage: '',
            profilename: '',
            channelsijoined:[],
            managedcount:'',
            joinedcount:'',
            channelmanagedloader:false,
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

        await this.getnotifications();
        await this.getchannelsubgroupid();
        await this.getchannels();
        await this.getchannelsijoined();
    }

    getnotifications =() => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
          };
          
          fetch(BASE_URL+"notification/"+this.state.userid, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result)
                if(result.status ==200){
                    this.setState({unseenmessages:result.data.unseen})
                }
            })
            .catch(error => console.log('error', error));
    }

    searchchannel=() =>{
        var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
    "language":this.state.search,
    "querytype":"searchchanel"
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
      console.log(result)
    })
  .catch(error => console.log('error', error));
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
      console.log('i joined -----',result)
      console.log('joined count ----',result.data.length)
      this.setState({joinedcount:result.data.length})
        if(result.status==200 && result.data ==''){
            alert('No channels joined')
        }
        else if(result.status==200 && result.data.length>0){
            for(let i=0;i<result.data.length;i++){
                this.state.channelsijoined.push(result.data[i])
            }
        }
        else{
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
                    this.setState({channelmanagedloader:true})
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

    createnewchannel=()=>{
        this.setState({showcreatemodel:false})
        var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
    // "querytype":"SETEndUserChanel",
    // "CreatedBY":65,  //this.state.userid,
    // "SubGroupMasterId":7,  ///this.state.channelid,     //7,
    // "SGName":this.state.channelname,   // "MyChanelName",
    // "Comment":"gggg"
    "querytype":"SETEndUserChanel",
    "CreatedBY":this.state.userid,
    "SubGroupMasterId":7,
    "SGName":this.state.channelname,
    "Comment":"gggg",
    "NoOfSeat":9,
    "image":"uu.jpg"
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch(BASE_URL+"user/details/SETEndUserChanel", requestOptions)
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

    

    renderchannel1 = () => {
        return (
            <View>
                <View style={styles.frinedview}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginRight: 10, marginLeft: 15 }}>
                        <View style={{ flexDirection: 'row', }}>
                            <View style={{ marginRight: 10 }}>
                                <Image source={require('../../../assets/images/newlogo.png')} style={styles.profile} />
                            </View>
                            <View>
                                <Text style={styles.topsearch}>
                                    Channel Name
                                </Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={styles.usersview}>
                                    <View style={{flexDirection:'row'}}>
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
                            <TouchableOpacity>
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
    }

    renderchannel = () => {
        return (
            <View>
                <View style={{ marginLeft: 10, marginTop: 15, marginBottom: 0,  }}>
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
                    <View style={{ marginRight: 10, marginLeft: 5, marginTop: 5, marginBottom: 5 }}>
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
        return this.state.channelsijoined.map((item)=>{
        return (
            <View style={styles.channelmanagedview}>
                <View style={{ flexDirection: 'row', }}>
                    <View style={{ marginRight: 10, marginLeft: 5, marginTop: 5, marginBottom: 5 }}>
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
    



    renderfooter = () => {
        return (
            <View>
                <View style={{ height: 60, width: Dimensions.get('window').width, backgroundColor: 'rgba(255, 255, 255, 0.9)', justifyContent: 'center', }}>
                    <View style={{ flexDirection: 'row', marginLeft: 10, marginRight: 10, justifyContent: 'space-between', }}>
                        <View>
                            {this.state.livetabselected ?
                                <View>
                                    <TouchableOpacity
                                     onPress={() =>this.props.navigation.navigate('Live')}
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
                                onPress={() =>this.props.navigation.navigate('Live')}
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
                                     onPress={() =>this.props.navigation.navigate('Explore')}
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
                                onPress={() =>this.props.navigation.navigate('Explore')}
                                    style={{ height: 42, width: 42, alignItems: 'center', justifyContent: 'center' }}
                                >
                                    <Image source={require('../../../assets/images/bx_bxs-planet.png')} style={{ height: 30, width: 30 }} />
                                </TouchableOpacity>
                            }
                        </View>

                        <View>
                            {this.state.hometabselected?
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
                        //onPress={() =>this.setState({hometabselected:true})}
                        style={{ height: 50, width: 50, alignItems: 'center', justifyContent: 'center',borderRadius:25,borderColor:'#ffffff',borderWidth:2,marginTop:-20,backgroundColor:'#000000' }}
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
                                     onPress={() =>this.props.navigation.navigate('Chat')}
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
                                        <View style={{flexDirection:'row'}}>
                                        <Icon name="chatbubble-ellipses" size={30} type="ionicon" 
                                     useAngle={true}
                                     angle={180}
                                     start={{ x: 0, y: 0 }}
                                     end={{ x: 0, y: 1 }}
                                    colors={[
                                        { color: "#01007E", offset: "1", opacity: "1" },
                                        { color: "#FD01FC", offset: "0", opacity: "1" },
                                    ]} />
                                    <View style={{height:16,width:16,borderRadius:8,backgroundColor:'#D8382B',borderColor:'#ffffff',borderWidth:1,marginLeft:-10,marginTop:-3,alignItems:'center',justifyContent:'center'}}>
                                        <Text style={{fontFamily:'Raleway',fontWeight:'600',fontSize:10,color:'#ffffff'}}>
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
                                onPress={() =>this.props.navigation.navigate('Chat')}
                                    style={{ height: 42, width: 42, alignItems: 'center', justifyContent: 'center' }}
                                >
                                    <View style={{flexDirection:'row'}}>
                                    <Ionicons name="chatbubble-ellipses" size={30} />
                                    <View style={{height:16,width:16,borderRadius:8,backgroundColor:'#D8382B',borderColor:'#ffffff',borderWidth:1,marginLeft:-10,marginTop:-3,alignItems:'center',justifyContent:'center'}}>
                                        <Text style={{fontFamily:'Raleway',fontWeight:'600',fontSize:10,color:'#ffffff'}}>
                                            {this.state.unseenmessages}
                                        </Text>
                                    </View>
                                    </View>
                                </TouchableOpacity>
                            }
                        </View>

                        <View>
                            {this.state.profiletabselected ?
                                <View style={{alignItems:'center',justifyContent:'center'}}>
                                    <TouchableOpacity
                                     //onPress={() =>this.props.navigation.navigate('Profile')}
                                     onPress={() =>this.props.navigation.navigate('Menu')}
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

    render() {
        return (
            <View style={{flex:1}}>
                <View style={{flex:0.9}}>
                <View style={{
                    height: this.state.mygroupselected?130:100,
                    width: Dimensions.get('window').width,
                    borderBottomLeftRadius: 30,
                    borderBottomRightRadius: 30,
                    backgroundColor: '#ffffff'
                }}>
                    <View style={{ marginTop: 20, marginLeft: 15, marginRight: 15,}}>
                        <View style={{ flexDirection: 'row',justifyContent:'space-between',alignItems:'center' }}>
                            <TouchableOpacity
                                style={{ alignItems: 'center', justifyContent: 'center', marginRight: 20, }}
                             onPress={() =>this.props.navigation.goBack()}
                            >
                                <Ionicons name="arrow-back" size={25} />
                            </TouchableOpacity>
                            <View style={{flexDirection:'row'}}>
                                {this.state.mygroupselected?
                                <TouchableOpacity
                                style={{marginRight:30}}
                                onPress={()=>this.setState({mygroupselected:true,recentlyvisitedslected:false})}
                                >
                                    <Text style={styles.mygroup}>
                                        My Group
                                    </Text>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity
                                style={{marginRight:30}}
                                onPress={()=>this.setState({mygroupselected:true,recentlyvisitedslected:false})}
                                >
                                    <Text style={styles.recentlyvisited}>
                                        My Group
                                    </Text>
                                </TouchableOpacity>
                                }
                                {this.state.recentlyvisitedslected?
                                <TouchableOpacity
                                onPress={()=>this.setState({mygroupselected:false,recentlyvisitedslected:true})}
                              >
                                  <Text style={styles.mygroup}>
                                      Recently Visited
                                  </Text>
                              </TouchableOpacity>
                              :
                                <TouchableOpacity
                                  onPress={()=>this.setState({mygroupselected:false,recentlyvisitedslected:true})}
                                >
                                    <Text style={styles.recentlyvisited}>
                                        Recently Visited
                                    </Text>
                                </TouchableOpacity>
                                }
                            </View>
                        </View>
                    </View>
                    {this.state.mygroupselected?
                    <View style={{flexDirection:'row', justifyContent:'space-between',marginLeft:10,marginRight:10,marginTop:20}}>
                                <View>
                                    <TouchableOpacity
                                    onPress={()=>this.setState({showcreatemodel:true})}
                                    >
                                        <Text>
                                            Create a Channel
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                {/* <TouchableOpacity>
                                        <Text>
                                            Channel I managed
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity> 
                                        <Text>
                                            My managed rooms
                                        </Text>
                                    </TouchableOpacity>*/}
                            </View>
                            :
                            null}
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
                
                
                    {this.state.mygroupselected?
                    <ScrollView>
                    <View style={{marginLeft:10,marginRight:10, alignItems:'center',justifyContent:'center'}}>
                        {this.renderchannel()}
                    </View>
                    </ScrollView>
                    :
                    null}
                    
                    </View>
                    <View style={{ flex: 0.1, position: 'absolute', bottom: 0, left: 0, }}>
                    {this.renderfooter()}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    
    recentlyvisited: {
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
    mygroup:{
        fontFamily: 'Raleway',
        fontWeight: '700',
        fontSize: 16,
        color: '#FEA20C',
    },
    chattext:{
        fontFamily: 'Raleway',
        fontWeight: '700',
        fontSize: 16,
        color: '#ffffff',
        marginLeft:22,
        //textAlign:'center'
    },
    friendstext: {
        fontFamily: 'Raleway',
        fontWeight: '700',
        fontSize: 16,
        color: '#ffffff'
    },
    makefreindsview:{
        height:22,
        width:90,
        borderRadius:20,
        backgroundColor:'#FFC6D2',
        alignItems:'center',
        justifyContent:'center',
    },
    makefriendstext:{
        fontFamily: 'Raleway',
        fontWeight: '500',
        fontSize: 12,
        color: '#EC899E',
    },
    usersview:{
        height:22,
        width:45,
        borderRadius:20,
        backgroundColor:'#E8D7FF',
        alignItems:'center',
        justifyContent:'center',
        marginRight:5
    },
    usernumber:{
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
        backgroundColor: '#ffffff',
        marginBottom:10,
        // marginLeft: 5,
        // marginRight: 5,
        // marginTop: 5,
    },


})

