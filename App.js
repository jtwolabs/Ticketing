import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { GetServerDate } from './ServerObj'; // ServerObj.js에서 GetServerDate 함수 import


const ServerList = () => {
  const [servers, setServers] = useState([]); //서버 리스트 관리하는 상태
  const [selectedServer, setSelectedServer] = useState(null); //리스트의 서버 중 선택한 서버의 정보 상태

  const [addModalVisible, setAddModalVisible] = useState(false); //서버 이름과 주소를 입력하는 모달 상태
  const [timeModalVisible, setTimeModalVisible] = useState(false); //리스트에 추가된 서버를 누르면 나타나는 모달 상태
  const [modifyModalVisible, setModifyModalVisible] = useState(false); //서버 정보를 수정하는 모달 상태
  
  const [serverName, setServerName] = useState(''); //서버 이름 상태
  const [serverAddress, setServerAddress] = useState('https://'); //서버 주소 상태
  const [modifiedServerName, setModifiedServerName] = useState(''); //수정한 서버 이름 상태
  const [modifiedServerAddress, setModifiedServerAddress] = useState(''); //수정한 서버 주소 상태
  
  const [currentTime, setCurrentTime] = useState(''); //현재 시간 상태
  const [timeOffset, setTimeOffset] = useState(0); //현재 시간 - 서버 시간 차이를 계산하고, 옵셋 상태
  const [goalTime, setGoalTime] = useState('00:00:00'); //목표 시간 상태
  const [nextIdx, setNextIdx] = useState(1); //다음 서버 추가할 때 사용할 인덱스


  // 현재 시간을 표시하는 함수
  const getCurrentTime = () => {
    const date = new Date(new Date().getTime() + timeOffset);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const milliseconds = date.getMilliseconds().toString().padStart(3, '0');
    return `${hours}:${minutes}:${seconds}:${milliseconds}`;
  };

  // 컴포넌트가 처음 마운트될 때와 현재 시간이 변경될 때마다 실행되는 함수
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 1);

    return () => clearInterval(intervalId);
  }, [currentTime]);
  
  // 새로운 서버 추가
  const handleAddServer = () => {
    const newServer = { name: serverName, address: serverAddress, idx: servers.length };
    setServers([...servers, newServer]);
    setAddModalVisible(false);
    setServerName('');
    setServerAddress('https://');
    
  };

  // 서버 삭제
  // "servers" 배열에서 "idx" 속성값이 주어진 "idx"와 일치하지 않는 모든 요소를 선택하여 "newServers" 배열에 새로운 배열로 저장
  const handleDeleteServer = (idx) => {
    const newServers = servers.filter(server => server.idx !== idx); // idx로 서버 삭제
    setServers(newServers);
  };

  // 서버 수정
  const handleModifyServer = (server) => {
    setSelectedServer(server);
    setModifyModalVisible(true);
    setModifiedServerName(server.name);
    setModifiedServerAddress(server.address);
  };

  // 서버 클릭 시 상세 정보 모달 띄우기
  const handleServerClick = async (server) => {
    setTimeModalVisible(true);
    setSelectedServer(server);
    try {
      const serverDate = await GetServerDate(server.address); // 서버 시간을 호출
      setTimeOffset(new Date().getTime() - serverDate.getTime())
    } 
    catch (error) {
    }
  };

  // 서버 목록을 렌더링하는 컴포넌트
  const renderItem = ({ item }) => (
    <View style={{flexDirection: 'row'}}>
      <TouchableOpacity onPress={() => handleServerClick(item)}>
        <Text>{item.name}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDeleteServer(item.idx)}>
        <Text style={{color: 'red'}}>  Delete</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleModifyServer(item)}>
        <Text style={{color: 'blue'}}>  Modify</Text>
      </TouchableOpacity>
    </View>
  );

  
  return (
    <View>
      {/* 상단 여백 */}
      <View style={{ height: 200 }}></View>

      {/* 새로운 서버 추가 버튼 */}
      <TouchableOpacity onPress={() => setAddModalVisible(true)}>
        <Text>Add server</Text>
      </TouchableOpacity>

      {/* 새로운 서버 추가 모달 */}
      <Modal visible={addModalVisible} animationType="slide">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Add server</Text>
          <TextInput
            placeholder="Server name"
            value={serverName}
            onChangeText={setServerName}
          />
          <TextInput
            placeholder="Server address"
            value={serverAddress}
            onChangeText={text => setServerAddress(text)}
          />
          <TouchableOpacity onPress={handleAddServer}>
            <Text>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setAddModalVisible(false)}>
            <Text>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* 서버 수정 모달 */}
      <Modal visible={modifyModalVisible} animationType="slide">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Modify server</Text>
          <TextInput
            placeholder="Server name"
            value={modifiedServerName}
            onChangeText={setModifiedServerName}
          />
          <TextInput
            placeholder="Server address"
            value={modifiedServerAddress}
            onChangeText={text => setModifiedServerAddress(text)}
          />
          <TouchableOpacity onPress={() => {
            const newServers = servers.map(server => {
            if (server.idx === selectedServer.idx) {
              return {
                ...server,
                name: modifiedServerName,
                address: modifiedServerAddress,
              };
            } 
            else {
              return server;
            }
          });
            setServers(newServers);
            setModifyModalVisible(false);
          }}>
            <Text>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {setModifyModalVisible(false);}}>
            <Text>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* 서버 목록 */}
      <FlatList
        data={servers}
        renderItem={renderItem}
        keyExtractor={item => item.idx.toString()} // idx를 key로 사용
      />

      {/* 서버 상세 정보 모달 */}
      {selectedServer && (
        <Modal visible={timeModalVisible} animationType="slide">
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Server name: {selectedServer.name}</Text>
            <Text>Server address: {selectedServer.address}</Text>
            <Text>Current time: {currentTime}</Text>
            <TextInput
              style={{ marginTop: 10, borderWidth: 1, padding: 5, width: 200 }}
              placeholder="Enter Goal Time"
              value={goalTime}
              onChangeText={text => setGoalTime(text)}
            />
            <TouchableOpacity onPress={() => setTimeModalVisible(false)}>
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default ServerList;
