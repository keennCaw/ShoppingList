import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/dist/FontAwesome'

const ListItem = ({item, deleteItem, itemInfo}) => {
  return (
    <TouchableOpacity style={styles.listItem} onLongPress={() => itemInfo(item.id)}>
        <View style={styles.listItemView}>
            <Text style={styles.listItemText}>{item.text}</Text>
            <Text style={styles.listItemQty}>Qty: {item.quantity}</Text>
            <Icon name="remove" size={20} color="firebrick" onPress={() => deleteItem(item.id)}/>
        </View>
    </TouchableOpacity>
  )
};

const styles = StyleSheet.create({
    listItem: {
        padding: 15,
        backgroundColor: '#f8f8f8',
        borderBottomWidth: 1,
        borderColor: '#eee'
    },
    listItemView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    listItemText: {
        fontSize: 18,
        flex: 1
    },
    listItemQty: {
        flex: 1
    }
})

export default ListItem
