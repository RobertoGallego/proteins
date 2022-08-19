import React, { useRef, useState, useEffect, useMemo} from 'react'
import { TextInput, StyleSheet, Text, View, AppState, ScrollView, TouchableOpacity, FlatList } from 'react-native'
import { FontAwesome } from '@expo/vector-icons' 
import { Entypo } from '@expo/vector-icons' 

import { ligands } from '../utils/ligands'
import LigandsList from '../components/ligandsList'

const HomeScreen = ({ navigation }) => {
  const appState = useRef(AppState.currentState)

  useEffect(() => {
    // console.log("here")

    const subscription = AppState.addEventListener("change", nextAppState => {
      if ( 
        appState.current.match(/active/) &&
        nextAppState === "inactive" || nextAppState === "background" 
      ) {
        // ACTIVAR
        // navigation.navigate('Signin')
      }


      appState.current = nextAppState
    })

    return () => {
      subscription.remove()
    }
  }, [])

  const myListEmpty = () => {
    return (
      <View style={{ alignItems:"center" }}>
      <Text style={styles.item}>No data found</Text>
      </View>
    )
  }

  const myItemSeparator = () => {
    return (
      <View
        style={{ height: 1, backgroundColor: "gray", marginHorizontal:10 }}
      />
    )
  }

  const memoizedValue = useMemo(() => ligands, [ligands])

  const [filtredData, setfiltredData] = useState([])
  const [masterData, setmasterData] = useState([])
  const [search, setsearch] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = () => {
    setfiltredData(ligands)
    setmasterData(ligands)
  }

  const searchFilter = (search) => {
    setsearch(search)
    if (search === "") setfiltredData(masterData)
    else {
      setfiltredData(
        masterData.filter((item) =>
          item.toLowerCase().includes(search.toLowerCase())
        )
      )
    }
  }

  return (
    <View style={styles.container}>
      {/* <ScrollView keyboardShouldPersistTaps="true"> */}
      <View style={styles.searchBarContainer}>
        <FontAwesome name="search" size={24} color="#3D405B" />
        <TextInput
          style={styles.searchBar}
          value={search}
          placeholder="Protein search"
          placeholderTextColor={'#3D405B'}
          underlineColorAndroid="transparent"
          onChangeText={searchFilter}
        />
        <Entypo name="circle-with-cross" size={24} color={search.length > 0 ? "#3D405B" : "#F4F1DE" } onPress={() => setsearch("")}/>
      </View>
      <FlatList 
        data={filtredData}
        style={{ flex: 1 }}
        renderItem={({ item }) => <LigandsList item={item} navigations={navigation}/>}
        keyExtractor={(index) => index.toString()}
        ItemSeparatorComponent={myItemSeparator}
        ListEmptyComponent={myListEmpty}

        removeClippedSubviews={true} // Unmount components when outside of window 
        initialNumToRender={15} // Reduce initial render amount
        maxToRenderPerBatch={50} // Reduce number in each render batch
        updateCellsBatchingPeriod={100} // Increase time between renders
        windowSize={7} // Reduce the window size
      />
          {/* {ligands.flatMap((contact, index) => {
            return (
              <TouchableOpacity delayPressIn={30} style={{ flex: 1, width: "100%" }} key={index} onPress={() => console.log("ok")}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 10, 
                  backgroundColor: index % 2 == 1 ? "#F4F1DE": "#F2CC8F"
   
                  }}>
                  <View style={{ flexDirection: "row"}}>
                    <View style={{ paddingHorizontal: 20 }}>
                      <Text style={{ fontSize: 20, color: 'red' 
                      }} >{contact}</Text>
                      <Text style={{ 
                      }}></Text>
                    </View>
                  </View>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center', flex: 1, height: 1, backgroundColor: 'grey'}} />
              </TouchableOpacity>
            )
          })} */}
        
      {/* </ScrollView> */}
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F1DE',
    // alignItems: 'center',
    // justifyContent: 'flex-start',
  },
  text: {
    color: '#3D405B'
  },
  searchBarContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    borderColor: '#3D405B',
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 20,
    marginBottom: 5,
    width: '90%'
  },
  searchBar: {
    flex: 1,
    textAlign: 'center',
  }
})

// #F4F1DE #E07A5F #3D405B #81B29A #F2CC8F