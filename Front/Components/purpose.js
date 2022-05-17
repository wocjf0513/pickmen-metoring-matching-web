import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {TouchableOpacity } from 'react-native';
import 'react-navigation'
function Purpose({navigation}) {
    return(
            <View style = {{}}>
                <View style = {{marginBottom : 100}}>
                    <Text style = {styles.Introduce}>당신의 가입 유형은 무엇인가요?</Text>
                </View>
                <TouchableOpacity style={styles.Button}
                    onPress = {()=> navigation.navigate('SelectSchool_Mento')}>
                    <Text style={styles.Text}>멘토</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.Button}
                    onPress = {() => navigation.navigate('SelectSchool')}>
                    <Text style={styles.Text}>멘티</Text>
                </TouchableOpacity>
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
    marginTop : 60,
    borderRadius:20,

    backgroundColor : "#27BAFF"
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
   Introduce:{
    color : "black",
    textAlign : "center",
    marginTop : 200,
    paddingLeft : 10,
    paddingRight : 10,
    fontSize : 20,
    fontFamily : 'Jalnan',
}
  });

export default Purpose;