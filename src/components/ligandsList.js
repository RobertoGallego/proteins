import React, { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const LigandsList = ({ item, navigations }) => {
  const handleLigandItem = () => {
    navigations.navigate('Protein', { item })
  }

  return (
      <View style={{ }}>
        <TouchableOpacity delayPressIn={30} style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 10 }} onPress={handleLigandItem}>
            <Text style={{ fontSize: 20, color: 'red' }} >{item}</Text>
        </TouchableOpacity>
      </View>
  );
};
    
 export default memo(LigandsList)