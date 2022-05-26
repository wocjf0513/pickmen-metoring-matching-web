import React, {useState, useEffect} from 'react';
import {SafeAreaView,View, Text, StyleSheet,TouchableOpacity, Alert} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import 'react-navigation';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

function Attention({navigation}){
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('');
    const [open2, setOpen2] = useState(false);
    const [value2, setValue2] = useState('');
    const [selectedValue, setSelectedValue] = useState('');
    const [selectedValue2, setSelectedValue2] = useState('');
    const [lecture1, setLecture1] = useState('');
    const [lecture2, setLecture2] = useState('');
    const [lectureList, setLectureList] = useState([]);

    async function saveLecture() {
        try {
            await AsyncStorage.setItem('lecture1', String(lecture1));
            await AsyncStorage.setItem('lecture2', String(lecture2));
        } catch (e) {
            console.log(e);
        }
    }
    useEffect(() => {
        axios.get('http://10.0.2.2:8090/getAllLectureList').then(response => {
            var count = response.data.length;
            var newData = [];
            for(var i = 0; i < count; i++) {
                newData.push({
                    label: response.data[i].name,
                    value: response.data[i].id,
                });
            }
            setLectureList(newData);
        })
        setOpen(false);
        setOpen2(false);
    },[])

    return(
        <View style = {{flex : 1, backgroundColor : '#27BAFF'}}>
            <View style = {styles.PageStyle}>
            <Text style = {styles.MainTitle}>관심 강의 선택</Text>
            <View style={{marginTop : 50,}}>
                <Text style = {styles.Sector}>관심 강의 1</Text>
            </View>
            <View>
            <DropDownPicker
                style = {{width : 350, marginLeft : 'auto', marginRight : 'auto', borderColor : '#a0a0a0'}}
                open={open}
                value={value}
                searchable={true}
                dropDownContainerStyle={{borderColor : '#a0a0a0', height : 170}}
                searchContainerStyle={{borderColor : '#a0a0a0', borderBottomWidth : .15}}
                listItemContainerStyle={{borderColor : '#a0a0a0', borderTopWidth : 0}}
                searchTextInputStyle={{height : 30, borderRadius : 0, borderWidth : 0, borderColor : '#a0a0a0'}}
                items={lectureList}
                placeholder="관심 강의를 선택하세요."
                placeholderStyle={{borderColor : '#a0a0a0', fontFamily : 'NanumSquareRoundB', fontSize : 14}}
                searchPlaceholder = '강의 검색'
                containerStyle={{width : 350, marginLeft : 'auto', marginRight : 'auto'}}
                onChangeValue={(itemValue) => {
                    const getIndex = (itemValue) => {
                        for (var i=0; i<lectureList.length; i++) {
                            if (lectureList[i].value == itemValue) {
                                return i;
                            }
                        }
                    }
                    if(getIndex(itemValue)>=0) {
                        setLecture1(lectureList[getIndex(itemValue)].value);
                        setSelectedValue(lectureList[getIndex(itemValue)].label);
                    }
                }}

                setValue={setValue}
                setOpen={setOpen}
            />
            </View>
            <View style ={{marginTop : 140,}}>
                <Text style = {styles.Sector}>관심 강의 2</Text>
            </View>
            <View>
            <DropDownPicker
                style = {{width : 350, marginLeft : 'auto', marginRight : 'auto', borderColor : '#a0a0a0'}}
                open={open2}
                value={value2}
                searchable={true}
                dropDownContainerStyle={{borderColor : '#a0a0a0', height : 170}}
                searchContainerStyle={{borderColor : '#a0a0a0', borderBottomWidth : .15}}
                listItemContainerStyle={{borderColor : '#a0a0a0', borderTopWidth : 0}}
                searchTextInputStyle={{height : 30, borderRadius : 0, borderWidth : 0, borderColor : '#a0a0a0'}}
                items={lectureList}
                placeholder="관심 강의를 선택하세요."
                placeholderStyle={{borderColor : '#a0a0a0', fontFamily : 'NanumSquareRoundB', fontSize : 14}}
                searchPlaceholder = '강의 검색'
                containerStyle={{width : 350, marginLeft : 'auto', marginRight : 'auto'}}
                onChangeValue={(itemValue) => {
                  const getIndex = (itemValue) => {
                        for (var i=0; i<lectureList.length; i++) {
                            if (lectureList[i].value == itemValue) {
                                return i;
                            }
                        }
                    }
                    if(getIndex(itemValue)>=0) {
                        setLecture2(lectureList[getIndex(itemValue)].value);
                        setSelectedValue2(lectureList[getIndex(itemValue)].label);
                    }
                }}
                setValue={setValue2}
                setOpen={setOpen2}
            />
            </View>
            <View>
                <TouchableOpacity style = {styles.Button}
                    onPress = {()=>{
                        if(selectedValue == selectedValue2){
                            Alert.alert('중복된 분야 선택');
                        }
                        else {
                            saveLecture();
                            navigation.navigate('Certify_Mentee')}
                            console.log(lectureList)
                        }}>
                    <Text style = {styles.Text}>
                        확인
                    </Text>
                </TouchableOpacity>
            </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    Button:{
     width : 280, 
     height : 40,
     paddingTop : 5, 
     marginLeft : 'auto',
     marginRight : 'auto', 
     marginTop : 200,
     borderRadius:5,
 
     backgroundColor : "#27BAFF"
    },
    MainTitle : {
        fontSize : 20,
        fontFamily : 'Jalnan',
        marginTop : 20,
        marginLeft : 20,
        color : 'black',
    },
    Sector : {
        fontFamily : 'Jalnan',
        fontSize : 15,
        color : 'black',
        marginLeft : 35,
        marginBottom : 15,
    },
    Text:{
        color : "white",
        textAlign : "center",
        marginTop : 5,
        paddingLeft : 10,
        paddingRight : 10,
        fontSize : 15,
        fontFamily : 'Jalnan',
    },
    PageStyle:{
        backgroundColor : 'white',
        width : 380, 
        height : 720,
        borderColor : 'white', 
        borderWidth : 1, 
        borderRadius : 30,
        marginLeft : 'auto', 
        marginRight : 'auto', 
        marginTop : 'auto', 
        marginBottom : 'auto'
      },
   });
 

export default Attention;