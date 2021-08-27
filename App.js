import React, {useState, useEffect} from 'react'
import { View, StyleSheet, FlatList, Alert, SafeAreaView} from 'react-native'
import Header from './components/Header'
import ListItem from './components/ListItem'
import AddItem from './components/AddItem';
import { openDatabase } from 'react-native-sqlite-storage' // sqlite database
import Icon from 'react-native-vector-icons/dist/FontAwesome'
import pickerIcon from 'react-native-vector-icons/dist/Ionicons'
import Toast, { BaseToast } from 'react-native-toast-message';

const db = openDatabase({
  name: "rn_sqlite" // DB name
});

// Customize Toast
const toastConfig = {
  success: ({ text1, text2, ...rest }) => (
    <BaseToast
      {...rest}
      style={{ borderLeftColor: 'pink' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: 'bold'
      }}
      text1={text1}
      text2={text2}
    />
  ),
};

const App = () => {
  Icon.loadFont(); //used to fix error unable to load FontAwesome
  pickerIcon.loadFont();
  const [items, setItems] = useState([]);

  const createTables = () => {
    db.transaction(txn => {
      txn.executeSql(
        'CREATE TABLE IF NOT EXISTS shopping_list (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(20))',
        [],
        (sqlTxn, res) => {
          console.log('table created successfullly')
        },
        error => {
          console.log('error on creating table ' + error.message);
        },
      );
    });
  };

  // Get Shopping List from Database
  const getShoppingList = () => {
    db.transaction(txn => {
      txn.executeSql(
        `SELECT * FROM shopping_list ORDER BY id DESC`,
        [],
        (sqlTxn, res) => {
          console.log('shopping list retrieved successfully')
          let len = res.rows.length

          if( len >= 0 ) {
            let results = [];
            for (let i = 0; i < len; i++) {
              let item = res.rows.item(i);
              results.push({id: item.id, text: item.name})
            }

            setItems(results)
          }
        },
        error => {console.log('error on getting Shopping List '+ error.message)}
      )
    })
  }

  useEffect( async () => {
    await createTables();
    await getShoppingList();
  }, []);

// Delete Item From shopping list table
  const deleteItem = (id) => {
    Alert.alert(
      "Delete Item",
      "Are you sure you want to delete"+ items.find(item => item.id === id).text +"? You cannot undo this later on.",
      [
        {text: 'YES', onPress: () => {
          try {
            const name = items.find(item => item.id === id).text;
            db.transaction(txn => {
              txn.executeSql(`DELETE FROM shopping_list WHERE id = ${id}`)
            })
            console.log(`Successfully Deleted ${name}`)
            getShoppingList();
            Toast.show({
              position: 'bottom',
              text1: `Deleted Successfully`,
              text2: `Successfully Deleted ${name} 👋`
            })
          } catch (e) {
            console.log('error on deleting item ' + e.message)
          }
        }
      },
        {text: 'NO'}
      ]
    )
  }

  // Add Item to Shopping List
  const addItem = (text) => {
    if(!text) {
      Alert.alert('Error', 'Please enter an item', [{text: 'Ok'}], {cancelable: true})
    } else {
      db.transaction(txn => {
        txn.executeSql(
          'INSERT INTO shopping_list (name) VALUES (?)',
          [text],
          (sqlTxn, res) => {
            console.log(`${text} item added successfully`);
            getShoppingList();
          },
          error => {
            console.log('error on adding item ' + error.message)
          },
        )
      })
    }
  }

  const itemInfo = (id) => {
    Alert.alert('Info', items.find(item => item.id === id).text, {text: 'OK'})
  }

  return (
    <SafeAreaView style={styles.container}>
      
      <Header />
      <View style={styles.addItem}>
        <AddItem addItem={addItem}/>
      </View>
      <FlatList data={items} renderItem={({item})=> 
        <ListItem item={item} deleteItem={deleteItem} itemInfo={itemInfo}/>
      } />
      <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />
    </SafeAreaView>
    
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }, 
  addItem: {
    flex: 0,
    paddingBottom: 10
  }
})

export default App
