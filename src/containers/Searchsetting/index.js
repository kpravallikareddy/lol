import React, { Component } from 'react';
import { View, BackHandler, Image, Text, Platform, Dimensions, StyleSheet, TouchableOpacity, ScrollView, Modal, ImageBackground, FlatList, TextInput, } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import LottieView from 'lottie-react-native';
import { Shadow } from 'react-native-neomorph-shadows';

// export function Live({navigation}) {

// useEffect(() =>{
//     // setTimeout(() => {
//     //     navigation.navigate('Login')
//     // }, 2000);

// },[]);

// const [liveselected,setLiveselected] = useState(true);
// const [partyselected,setPartyselected] = useState(false);

export default class Searchsetting extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    componentDidMount() {
        //  this.setState({liveselected:!this.state.liveselected})
        // setTimeout(() => {
        //     this.props.navigation.navigate('Profile')
        // }, 2000);
    }



    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 0.9 }}>
                    <ScrollView>
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
                                // onPress={() => this.setState({ friendsselected: !this.state.friendsselected, followingselected: false,followerselected:false,channelselected:false })}
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

                            <View style={{marginLeft:15,marginRight:15,marginTop:10}}>
                            <View style={styles.billboardview}>
                                <View style={{flexDirection:'row',justifyContent:'space-between',marginLeft:20, marginRight:20}}>
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
                                <View style={{flexDirection:'row',justifyContent:'space-between',marginLeft:20, marginRight:20}}>
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
                                <View style={{flexDirection:'row',justifyContent:'space-between',marginLeft:20, marginRight:20}}>
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
                    </ScrollView>
                </View>



            </View>
        )
    }
}

const styles = StyleSheet.create({
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
    billboardview:{
        height:60,
        width:Dimensions.get('window').width-30,
        borderRadius:20,
        backgroundColor:'#ffffff',
        shadowColor: '#000000',
        shadowOpacity: 0.1,
        elevation: 10,
        justifyContent:'center',
        marginTop:10,
    }

})

