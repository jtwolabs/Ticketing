import React, { useState } from "react";
import { StyleSheet, View, Text, Modal, TouchableOpacity, TextInput } from 'react-native';

//       setTimeModalVisible
export const ServerTime = (props) => {
    const selectedServer = props.selectedServer;
    return(
        <View style = {styles.container}>
            {/* 서버 상세 정보 모달 */}
            {selectedServer && (
            <Modal visible={props.timeModalVisible} animationType="slide">
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Server name: {selectedServer.name}</Text>
                    <Text>Server address: {selectedServer.address}</Text>
                    <Text>Current time: {props.currentTime}</Text>
                    <TextInput
                    style={{ marginTop: 10, borderWidth: 1, padding: 5, width: 200 }}
                    placeholder="Enter Goal Time"
                    value={props.goalTime}
                    onChangeText={text => props.setGoalTime(text)}
                    />
                    <TouchableOpacity onPress={() => props.setTimeModalVisible(false)}>
                        <Text>Close</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
            )}
        </View>
    );
};

const styles = StyleSheet.create({


})