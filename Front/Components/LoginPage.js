import React , {useState} from 'react';
import { View, Text, StyleSheet , TextInput, Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {TouchableOpacity } from 'react-native';
import 'react-navigation';
import axios  from 'axios';
import data from './PostData'
import profiledata from './ProfileData'
import auth from '@react-native-firebase/auth';
import myprofile from './MyProfile';

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

async function loadprofile() {
    await axios.get('http://10.0.2.2:8090/user/myprofile').then(async function(response) {
        myprofile.length = 0;
        myprofile.push({
            id : response.data.data.id,
            nickname : response.data.data.nickname,
            email : response.data.data.email,
            role : response.data.data.role,
            teachSector : response.data.data.teachSector,
        })
    })
}


function LoginPage({navigation}) {
    const  [email, setEmail] = useState('');
    const  [password, setPassword] = useState('');

    async function saveUserId(user_id) {
        if(user_id)
            await AsyncStorage.setItem('user_id', JSON.stringify(user_id));
            var data = await AsyncStorage.getItem('user_id');
    }
    async function firebaseregister(email, password) {
        try {
            await auth().createUserWithEmailAndPassword(email, password);
        } catch (e) {
            console.log(e);
        }
    }
    async function firebaselogin(email, password) {
        try {
            await auth().signInWithEmailAndPassword(email, password);
        } catch (e) {
            console.log(e);
        }
    }
    async function LoginAccess(email, password) {
       axios.post('http://10.0.2.2:8090/login',null,{ params: {
            username: email,
            password: password,
       }}).then(response => {
              if(response.data.status == 200){
                console.log(response.data.status)
                saveUserId(response.data.data.id);
                firebaselogin(email, password);
                loadprofile();
                navigation.navigate('HomeScreen');
              }else{
                alert('아이디 또는 비밀번호가 틀렸습니다.');
                navigation.navigate('LoginPage');
              }
    }).catch(function(error){
        console.log(error)
    })
    }
    async function loadBoard() {
        await axios.get('http://10.0.2.2:8090/post/getPost')
        .then(response => {
            var count = parseInt(response.data.numberOfElements);
            count = count-1;
            for(count;count >=0; count--){
            data.push({
                id : response.data.content[count].id,
                title : response.data.content[count].title,
                user : response.data.content[count].user.id,
                content : response.data.content[count].content,
                count : response.data.content[count].count,
                nickname : response.data.content[count].user.nickname,
            },)
        }
        }).catch(error => {
            console.log(error)
        })
    }
    return(
        data.length = 0,
            <View>
                <View>
                    <Text style = {styles.Text}>
                        PickMen
                    </Text>
                </View>
                <View>
                <TextInput style = {styles.TextInput} placeholder = "ID" onChangeText={(UserEmail)=> setEmail(UserEmail)} >
                </TextInput>
                <TextInput secureTextEntry={true} style = {styles.TextInput} placeholder = "Password" onChangeText={(password)=> setPassword(password)}/>
                </View>
                <TouchableOpacity style={styles.startButton} 
                    onPress = {()=> {
                        LoginAccess(email, password);
                        Test();
                        loadData();
                        loadprofile();
                        loadBoard();
                        navigation.navigate('HomeScreen');
                        data.length = 0;                    
                    }}>
                    <Text style={styles.ButtonText}>Login</Text>
                </TouchableOpacity>  
            </View>
    )
}
const styles = StyleSheet.create({
   startButton:{
    width : 280, 
    height : 40,
    paddingTop : 5,
    marginLeft : 'auto',
    marginRight : 'auto', 
    marginTop : 100,
    borderRadius:5,

    backgroundColor : "#27BAFF"
   },
   Text:{
       color : "#27BAFF",
       textAlign : "center",
       marginTop : 150,
       paddingLeft : 10,
       paddingRight : 10,
       fontSize : 28,
       marginBottom : 60,
       fontFamily : 'Jalnan',
   },
   ButtonText:{
    color : "#FFFFFF",
    textAlign : "center",
    paddingLeft : 10,
    paddingRight : 10,
    marginTop : 4,
    fontSize : 18,
    fontFamily : 'Jalnan',
},
    TextInput: {
        width : 320,
        height: 50,
        margin: 12,
        borderColor : '#d3d3d3',
        borderWidth: 1,
        padding: 10,
        paddingLeft : 20,
        borderRadius : 50,
        marginLeft : 'auto',
        marginRight : 'auto',
        marginBottom : 5,
    },
  });

export default LoginPage;