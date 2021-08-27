import React, {useState} from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/dist/FontAwesome'
import NumericInput from 'react-native-numeric-input'

const AddItem = ({ addItem }) => {
    const [text, setText] = useState('');
    const onChange = textValue => setText(textValue)
    const [number, setNumber] = useState(0);

    const onAddItem = () => {
      addItem(text)
      setText()
    }

    return (
        <View>
          <View style={styles.inputContainer}>
            <TextInput placeholder="Add Item..." style={styles.input} onChangeText={onChange} value={text}/>
            <NumericInput 
            value = {number}
            onChange = { value => { 
              setNumber(parseInt(value))
            } }
            minValue = {0}
            maxValue = {999}
            totalHeight={50}/>
          </View>
            <TouchableOpacity style={styles.btn} onPress={ () => {
              onAddItem()
              console.log(typeof(number))
            }}>
                <Text style={styles.btnText}><Icon name="plus" size={20} />Add Item</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    inputContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      paddingTop: 8,
      paddingHorizontal: 5
    },
    input: {
      flex: 3,
      height: 50,
      padding: 8,
      margin: 5,
    },
    btn: {
      backgroundColor: '#c2bad8',
      padding: 10,
      marginHorizontal: 5
    },
    btnText: {
      color: 'darkslateblue',
      fontSize: 20,
      textAlign: 'center',
    },
  });

export default AddItem
