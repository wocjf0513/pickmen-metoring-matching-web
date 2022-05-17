import React from 'react';
import { View, Text, StyleSheet ,FlatList, TouchableOpacity, Alert, Image} from 'react-native';
import {Card, Title, Paragraph, Colors} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import 'react-navigation';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import profiledata from './ProfileData';
import { CommonActions } from '@react-navigation/native';
import CreateRoom from './CreateRoom';

async function Test() {
    try{
    await axios.get('http://10.0.2.2:8090/mentors').then(async function(response){
        var data = response.data;
        console.log(data.length)
        for(var i=0;i<data.length;i++) {
            await AsyncStorage.setItem('data'+i, JSON.stringify(data[i]));
        }      
    })
    }catch(error) {
        console.log(error);
    }
}
async function loadData() {
    await axios.get('http://10.0.2.2:8090/mentors').then(async function(response){
        var data = response.data;
        var maxcount = data.length;
        profiledata.length = 0;
        for(var i=0;i<maxcount;i++) {
            var data2 = await AsyncStorage.getItem('data'+i);
            var newData = JSON.parse(data2);
            profiledata.push(newData);
        } }
    )
}

function MentoProfile({navigation}) {
    function createChatRoom(item) {
        Alert.alert(
            '채팅방이 생성되었습니다. 이동하시겠습니까?',
            '',
            [
                {
                    text: '확인',
                    onPress: () => { CreateRoom();},
                },
                {
                    text: '취소',
                    onPress: () => {navigation.dispatch(CommonActions.reset({
                        index : 0,
                        routes : [{name : 'MentoProfile'}]
                    }))},
                }
            ]
        )
        }
    const renderCard = ({ item }) => {
        console.log(item)
        return (
            <Card style = {styles.cards}>
                <Card.Title title = "멘토 정보" subtitle = "Mento Profile" titleStyle = {styles.MainTitle} subtitleStyle={styles.subtitle}/>
                <Card.Content style = {{flexDirection : 'row'}}>
                </Card.Content>
            <Card.Content> 
                <View style = {{flexDirection : 'row'}}>
                <Image source = {{uri :'http://10.0.2.2:8090/getProfile?userid='+ Number(item.id)}}style = {{width : 130, height : 130}}></Image>
                <View style={{flexDirection : 'row'}}>
                    <View style={{marginLeft : 20}}>
                    <Title style = {styles.MentoName}>멘토 닉네임</Title>
                    <Title style = {styles.MentoName}>{item.nickname}</Title>
                    <View style = {{flexDirection : 'row'}}>
                    </View>
                    </View> 
                    <View>
                        <Title style = {styles.MentoGrade}>평가 점수</Title>
                        <Title style = {styles.MentoGrade}>3.0</Title>     
                    </View>        
                </View>
                </View>
                <View>
                    <Title style = {styles.teachSector}>Teach Sector</Title>
                    <Title style = {styles.teachSector}>{item.teachSector}</Title>
                    </View>
            </Card.Content>
            <Card.Actions>
                <TouchableOpacity style = {{marginLeft : 10}} onPress={()=>{createChatRoom(item)}}>
                    <Text style = {styles.ButtonText}>채팅 연결하기</Text>
                </TouchableOpacity>
            </Card.Actions>
            </Card>
        )
    };
    Test();
    loadData();
    return(
            <View style={{flex : 1, backgroundColor : '#fff'}}>
                <View>
                    <Text style = {styles.Title}>
                        멘토 프로필 리스트
                    </Text>
                </View>
                <View style = {{borderBottomColor : 'black', borderBottomWidth : .5, marginBottom : 20,}}/>
                <FlatList
                    data = {profiledata}
                    renderItem={renderCard}
                >
                </FlatList>
            </View>
    )
}

const styles = StyleSheet.create({
    cards : {
        borderRadius : 10,
        width : 400,
        borderWidth : 1,
        marginLeft : 'auto',
        marginRight : 'auto',
        marginBottom : 10,
    },
    MainTitle : {
        fontSize : 17,
        fontFamily: 'Jalnan',
        color : "#27BAFF",
    },
    subtitle : {  
        fontFamily: 'Jalnan',
        color : "black"
    },
    MentoName : {
        fontFamily: 'Jalnan',
        marginBottom : 10,
        fontSize : 14,
    },
    teachSector : {
        fontFamily: 'Jalnan',
        marginBottom : 10,
        marginLeft : 150,
        marginBottom : 20,
        fontSize : 14,
    },
    nickName : {
        fontFamily: 'Jalnan',
        marginBottom : 10,
        fontSize : 14,
        color : '#a0a0a0'
    },
    MentoGrade : {
        fontFamily: 'Jalnan',
        fontSize : 14,
        marginLeft : 50,
        marginRight : 'auto'
    },
    Title : {
        fontFamily: 'Jalnan',
        fontSize : 17,
        color : "#27BAFF",
        marginBottom : 10,
        marginLeft : 10,
        marginTop : 18,
    },
    ButtonText : {
        fontFamily: 'Jalnan',
        fontSize : 14,
        color : "#27BAFF",
    }
})

export default MentoProfile;