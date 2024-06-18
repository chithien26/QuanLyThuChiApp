import React from 'react';
import { View, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';
import GroupDetailStyle from '../../styles/GroupDetailStyle';
import { Button, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
const GroupDetail = () => {
    const route = useRoute();
    const { group } = route.params;
    const navigation = useNavigation();
    const onPressThemThuChi = (group) => {
        navigation.navigate('AddThuChiGroup', { group });
    };
    return (
        <View style={GroupDetailStyle.container}>
            <View style={GroupDetailStyle.row}>
                <Button  icon={() => <IconButton icon='arrow-left' color='#000' size={30} />}
                 mode='contained'
                 onPress={() => navigation.goBack()}
                 style={GroupDetailStyle.button}>
                </Button>
                <Text style={GroupDetailStyle.groupName}> {group.name}</Text>
            </View>
            <View style={[GroupDetailStyle.buttonView, GroupDetailStyle.row]}>
            <Button style={GroupDetailStyle.buttonType} onPress={() => onPressThemThuChi(group)}>Thêm thu chi</Button>
            <Button style={GroupDetailStyle.buttonType} onPress={() => onPressThemThuChi(group)}>Lịch họp</Button>
            </View>   
                         
        </View>
    );
};

export default GroupDetail;
