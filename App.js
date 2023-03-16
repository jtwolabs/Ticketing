import React, { useEffect, useState } from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import { GetServerDate, ServerObj } from './ServerObj'

export const App = () => {
  const [ServerUrl, setServerUrl] = useState('');
  const [MyServerlist, setMyServerlist] = useState([]);

  useEffect(() => { //MyServerList 변동시 HOOK
    console.log("My Server List : ",MyServerlist.length, MyServerlist)
  },[MyServerlist]);

  const addServer = (url) => {
    GetServerDate(url)
    .then((date) => {
      setMyServerlist([...MyServerlist, new ServerObj(url, date)]); 
    })
  }

  const RenderServer = () => {
    if(MyServerlist.length ===0 ){
      return(
      <View>
        <Text>
          리스트가 없습니다.
        </Text>
      </View>
      )

    }
    else{
      return(
        <View>
          {MyServerlist.map(item => (
            <Text key={item.url}>{item.url} : {item.ServerDate.toLocaleString()}</Text>
          ))}
      </View>
      )
    }
  }

  return (
    <View>
      <View
      style ={{flexDirection: 'row', alignItems:'center'}}
      >
        <TextInput
        style ={{borderColor: 'gray', borderWidth: 0.5, marginTop : 10, marginLeft : 5, flex :5}}
        onChangeText={setServerUrl}
        value={ServerUrl}
        placeholder='url을 입력해주세요'
        />
        <TouchableOpacity
        style = {{flex : 1, marginLeft: 5}}
        onPress = {()=>addServer(ServerUrl)}
        >
          <Text>
            등록
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        {RenderServer()}
      </View>
    </View>
  );
};


export default App;
